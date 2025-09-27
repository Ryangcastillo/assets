"use client";

import { useState, useTransition } from "react";

import { runExportAction } from "../actions";

export interface ExportDialogProps {
  selected: string[];
}

export function ExportDialog({ selected }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<"empty" | "starter">("empty");
  const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "yarn">("pnpm");
  const [registryUrl, setRegistryUrl] = useState("http://localhost:3000/registry/index.json");
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<{ outputDir: string; archivePath?: string; log: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected.length === 0) {
      setError("Select at least one component to export.");
      return;
    }
    setError(null);
    setStatus("Starting export...");
    startTransition(async () => {
      try {
        const response = await runExportAction({
          items: selected,
          name: "Custom export",
          registryUrl,
          template,
          packageManager,
        });
        setResult(response);
        setStatus("Export completed");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Export failed");
      }
    });
  }

  async function handleCopy(value: string | undefined) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setStatus(`Copied path to clipboard: ${value}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        disabled={selected.length === 0}
      >
        Export selection
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl space-y-4 rounded-3xl border bg-background p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Export components</h2>
                <p className="text-sm text-muted-foreground">
                  We will scaffold a fresh Next.js app and install {selected.length} component{selected.length === 1 ? "" : "s"}.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Base template</span>
                  <select
                    value={template}
                    onChange={(event) => setTemplate(event.target.value as typeof template)}
                    className="rounded-lg border px-3 py-2"
                  >
                    <option value="empty">Empty Next.js app</option>
                    <option value="starter">Starter template</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Package manager</span>
                  <select
                    value={packageManager}
                    onChange={(event) => setPackageManager(event.target.value as typeof packageManager)}
                    className="rounded-lg border px-3 py-2"
                  >
                    <option value="pnpm">pnpm</option>
                    <option value="npm">npm</option>
                    <option value="yarn">yarn</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm md:col-span-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Registry URL</span>
                  <input
                    value={registryUrl}
                    onChange={(event) => setRegistryUrl(event.target.value)}
                    required
                    className="rounded-lg border px-3 py-2"
                    placeholder="https://example.com/registry/index.json"
                  />
                </label>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
                <p className="mb-2 font-medium">Selected components</p>
                <ul className="grid gap-1 text-muted-foreground">
                  {selected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-2 text-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? "Exporting…" : "Run export"}
                </button>
              </div>
            </form>
            {result ? (
              <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
                <h3 className="mb-2 font-semibold">Export ready</h3>
                <p className="text-muted-foreground">
                  Output directory: <code className="rounded bg-muted px-2 py-1">{result.outputDir}</code>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(result.outputDir)}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                  >
                    Copy folder path
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.archivePath)}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                    disabled={!result.archivePath}
                  >
                    Copy ZIP path
                  </button>
                  <a
                    href="/api/export/zip"
                    target="_blank"
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                  >
                    Download ZIP
                  </a>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-muted-foreground">View logs</summary>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-black/80 p-3 text-xs text-white">
{result.log}
                  </pre>
                </details>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
