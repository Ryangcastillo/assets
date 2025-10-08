#!/usr/bin/env tsx
/*
 * Export selected registry items into a fresh Next.js application by invoking the shadcn CLI.
 */

import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

interface CliOptions {
  collectionPath: string;
  registryUrl: string;
  template: "empty" | "starter";
  packageManager: "pnpm" | "npm" | "yarn";
  force?: boolean;
}

interface CollectionFile {
  id: string;
  name: string;
  description?: string;
  items: string[];
}

interface RegistryIndexItem {
  id: string;
  meta: string;
}

interface RegistryIndex {
  items: RegistryIndexItem[];
}

interface RegistryMetaFile {
  id: string;
  name: string;
  files: Array<{ dest: string }>;
  license?: { type: string; url?: string };
}

function parseArgs(argv: string[]): CliOptions {
  const args = [...argv];
  const options: Partial<CliOptions> = {};

  while (args.length) {
    const arg = args.shift();
    if (!arg) continue;
    switch (arg) {
      case "--collection":
        options.collectionPath = args.shift() ?? "";
        break;
      case "--registry":
        options.registryUrl = args.shift() ?? "";
        break;
      case "--template":
        options.template = (args.shift() as CliOptions["template"]) ?? "empty";
        break;
      case "--pm":
        options.packageManager = (args.shift() as CliOptions["packageManager"]) ?? "pnpm";
        break;
      case "--force":
        options.force = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.collectionPath) {
    throw new Error("Missing --collection option.");
  }
  if (!options.registryUrl) {
    throw new Error("Missing --registry option.");
  }

  return {
    collectionPath: options.collectionPath,
    registryUrl: options.registryUrl,
    template: options.template ?? "empty",
    packageManager: options.packageManager ?? "pnpm",
    force: options.force ?? false,
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const data = await readFile(filePath, "utf8");
  return JSON.parse(data) as T;
}

async function runCommand(command: string, args: string[], options: { cwd: string }): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
    child.on("error", reject);
  });
}

async function ensureCleanDirectory(targetDir: string, force: boolean) {
  try {
    await rm(targetDir, { recursive: true, force: true });
  } catch (error) {
    if (!force) {
      throw error;
    } else {
      console.warn(
        `[ensureCleanDirectory] Failed to remove directory '${targetDir}' with force=true:`,
        error
      );
    }
  }
  await mkdir(targetDir, { recursive: true });
}

async function scaffoldTemplate(baseDir: string, template: CliOptions["template"], packageManager: CliOptions["packageManager"]) {
  if (template === "empty") {
    await runCommand("npx", [
      "create-next-app@latest",
      baseDir,
      "--ts",
      "--eslint",
      "--tailwind",
      "--app",
      "--src-dir",
      "--import-alias",
      "@/*",
      "--no-install",
    ], { cwd: process.cwd() });
    return;
  }

  if (template === "starter") {
    const templateDir = path.resolve(process.cwd(), "templates", "starter");
    await mkdir(baseDir, { recursive: true });
    await runCommand("cp", ["-R", `${templateDir}/.`, baseDir], { cwd: process.cwd() });
    if (packageManager === "pnpm") {
      await runCommand("pnpm", ["install"], { cwd: baseDir });
    } else if (packageManager === "npm") {
      await runCommand("npm", ["install"], { cwd: baseDir });
    } else {
      await runCommand("yarn", [], { cwd: baseDir });
    }
    return;
  }

  throw new Error(`Unsupported template: ${template}`);
}

async function initShadcn(appDir: string) {
  await runCommand("npx", ["shadcn@latest", "init", "-y"], { cwd: appDir });
}

async function installBaseDependencies(appDir: string, manager: CliOptions["packageManager"]) {
  const packages = ["lucide-react"];
  if (packages.length === 0) return;
  if (manager === "pnpm") {
    await runCommand("pnpm", ["add", ...packages], { cwd: appDir });
    return;
  }
  if (manager === "npm") {
    await runCommand("npm", ["install", ...packages], { cwd: appDir });
    return;
  }
  await runCommand("yarn", ["add", ...packages], { cwd: appDir });
}

async function addComponents(appDir: string, registryUrl: string, items: string[]) {
  if (items.length === 0) {
    throw new Error("No components selected for export.");
  }
  await runCommand("npx", ["shadcn@latest", "add", "--registry", registryUrl, ...items], { cwd: appDir });
}

async function loadRegistryMeta(registryRoot: string, itemId: string) {
  const index = await readJsonFile<RegistryIndex>(path.join(registryRoot, "index.json"));
  const record = index.items.find((item) => item.id === itemId);
  if (!record) {
    throw new Error(`Item '${itemId}' not found in registry index.`);
  }
  const metaPath = path.resolve(registryRoot, record.meta);
  return readJsonFile<RegistryMetaFile>(metaPath);
}

async function validateFiles(appDir: string, registryRoot: string, items: string[]) {
  const missing: Array<{ itemId: string; file: string }> = [];
  for (const itemId of items) {
    const meta = await loadRegistryMeta(registryRoot, itemId);
    for (const file of meta.files) {
      const targetPath = path.join(appDir, file.dest);
      try {
        await readFile(targetPath, "utf8");
      } catch {
        missing.push({ itemId, file: file.dest });
      }
    }
  }
  if (missing.length > 0) {
    const message = missing
      .map((entry) => `• ${entry.itemId} → ${entry.file}`)
      .join("\n");
    throw new Error(`Some files were not generated:\n${message}`);
  }
}

async function generateLicenseSummary(appDir: string, registryRoot: string, items: string[]) {
  const lines = ["# Component licenses", ""];
  lines.push("| Item | License | Source |");
  lines.push("| --- | --- | --- |");
  const seen = new Set<string>();

  for (const itemId of items) {
    const meta = await loadRegistryMeta(registryRoot, itemId);
    if (seen.has(itemId)) continue;
    seen.add(itemId);
    const license = meta.license?.type ?? "Custom";
    const source = meta.license?.url ?? "—";
    lines.push(`| ${meta.name ?? itemId} | ${license} | ${source} |`);
  }

  await writeFile(path.join(appDir, "LICENSES.md"), `${lines.join("\n")}\n`, "utf8");
}

async function writeSummaryReadme(appDir: string, collection: CollectionFile, registryUrl: string, options: CliOptions) {
  const content = `# Export summary\n\n- Source collection: **${collection.name}** (${collection.id})\n- Registry: ${registryUrl}\n- Components installed: ${collection.items.join(", ")}\n- Package manager: ${options.packageManager}\n\n## Next steps\n\n1. Install dependencies (if not already):\n   \`${options.packageManager} install\`\n2. Start the dev server:\n   \`${options.packageManager} dev\`\n3. Configure any required environment variables (AI keys, etc.).\n`;
  await writeFile(path.join(appDir, "REGISTRY_EXPORT.md"), content, "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const collection = await readJsonFile<CollectionFile>(path.resolve(options.collectionPath));
  const registryRoot = process.env.REGISTRY_ROOT
    ? path.resolve(process.env.REGISTRY_ROOT)
    : path.resolve(process.cwd(), "..", "ui-registry", "registry");

  const distDir = path.resolve(process.cwd(), "dist");
  const appDir = path.join(distDir, "app");
  await ensureCleanDirectory(distDir, options.force ?? false);

  await scaffoldTemplate(appDir, options.template, options.packageManager);

  await initShadcn(appDir);
  await installBaseDependencies(appDir, options.packageManager);
  await addComponents(appDir, options.registryUrl, collection.items);
  await validateFiles(appDir, registryRoot, collection.items);
  await generateLicenseSummary(appDir, registryRoot, collection.items);
  await writeSummaryReadme(appDir, collection, options.registryUrl, options);

  console.log(`\n✔ Export completed successfully in ${appDir}`);
}

main().catch((error) => {
  console.error("Export failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
