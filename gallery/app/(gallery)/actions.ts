"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { CollectionDefinition } from "@/lib/catalog";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export interface SaveCollectionInput {
  name: string;
  description?: string;
  items: string[];
  id?: string;
}

export async function saveCollectionAction(payload: SaveCollectionInput) {
  const name = payload.name.trim();
  if (!name) {
    throw new Error("Collection name is required.");
  }
  const items = Array.from(new Set(payload.items));
  if (items.length === 0) {
    throw new Error("Select at least one component before saving.");
  }

  const id = payload.id ? slugify(payload.id) : slugify(name);
  if (!id) {
    throw new Error("Collection identifier could not be generated.");
  }

  const definition: CollectionDefinition = {
    id,
    name,
    description: payload.description?.trim() || undefined,
    items,
  };

  const targetPath = path.resolve(process.cwd(), "collections", `${id}.json`);
  await fs.writeFile(targetPath, JSON.stringify(definition, null, 2));

  return definition;
}

export interface RunExportInput {
  items: string[];
  name: string;
  description?: string;
  registryUrl: string;
  template: "empty" | "starter";
  packageManager: "pnpm" | "npm" | "yarn";
}

export interface RunExportResult {
  outputDir: string;
  log: string;
  archivePath?: string;
}

export async function runExportAction(options: RunExportInput): Promise<RunExportResult> {
  const { spawn } = await import("node:child_process");
  const { once } = await import("node:events");
  const cwd = path.resolve(process.cwd());
  const tempCollection = {
    id: "export-preview",
    name: options.name,
    description: options.description,
    items: options.items,
  } satisfies CollectionDefinition;
  const tempPath = path.join(cwd, "collections", "__export-temp.json");
  await fs.writeFile(tempPath, JSON.stringify(tempCollection, null, 2));
  const args = [
    "tools/export-cli.ts",
    "--collection",
    tempPath,
    "--registry",
    options.registryUrl,
    "--template",
    options.template,
    "--pm",
    options.packageManager,
    "--force",
  ];

  const child = spawn("pnpm", ["tsx", ...args], {
    cwd,
    env: {
      ...process.env,
      REGISTRY_ROOT: process.env.REGISTRY_ROOT ?? path.resolve(cwd, "..", "ui-registry", "registry"),
    },
  });

  let output = "";
  child.stdout?.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr?.on("data", (chunk) => {
    output += chunk.toString();
  });

  const [code] = (await once(child, "exit")) as [number | null];
  await fs.rm(tempPath, { force: true });
  if (code !== 0) {
    throw new Error(output || "Export failed");
  }

  const outputDir = path.resolve(cwd, "dist", "app");
  const archivePath = path.join(path.resolve(cwd, "dist"), "app.zip");
  try {
    await fs.rm(archivePath, { force: true });
    await new Promise<void>((resolve, reject) => {
      const zip = spawn("zip", ["-r", archivePath, "app"], { cwd: path.join(cwd, "dist") });
      zip.on("exit", (zipCode) => {
        if (zipCode === 0) resolve();
        else reject(new Error(`zip exited with code ${zipCode}`));
      });
      zip.on("error", reject);
    });
  } catch (error) {
    console.warn("Unable to generate ZIP archive", error);
  }

  return { outputDir, log: output, archivePath };
}
