"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { CollectionDefinition } from "@/lib/catalog";

import { saveCollectionAction } from "../actions";
import { useSelection } from "./selection-context";
import { ExportDialog } from "./export-dialog";

export interface ToolbarProps {
  collections: CollectionDefinition[];
}

export function Toolbar({ collections }: ToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { selected, setSelection } = useSelection();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [isSaving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  const collectionOptions = useMemo(() => collections, [collections]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (search) {
      next.set("q", search);
    } else {
      next.delete("q");
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  function handleCollectionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const id = event.target.value;
    if (!id) {
      setSelection([]);
      return;
    }
    const collection = collectionOptions.find((item) => item.id === id);
    if (collection) {
      setSelection(collection.items);
    }
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const description = String(formData.get("description") ?? "");
    setError(null);
    startSaving(async () => {
      try {
        await saveCollectionAction({ name, description, items: selected });
        setSaveOpen(false);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to save collection.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-background/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md items-center gap-2 rounded-full border px-4 py-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search components"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button type="submit" className="text-sm font-medium text-primary">
            Search
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <select
            defaultValue=""
            onChange={handleCollectionChange}
            className="rounded-full border px-3 py-2 text-sm text-muted-foreground"
          >
            <option value="">Load collection</option>
            {collectionOptions.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSaveOpen(true)}
            className="rounded-full border px-3 py-2 text-sm font-medium transition hover:bg-muted"
            disabled={selected.length === 0}
          >
            Save collection
          </button>
          <ExportDialog selected={selected} />
        </div>
      </div>
      {saveOpen ? (
        <form onSubmit={handleSave} className="grid gap-3 rounded-2xl border bg-muted/40 p-4 text-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Save current selection</h2>
            <button type="button" onClick={() => setSaveOpen(false)} className="text-xs text-muted-foreground">
              Close
            </button>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</span>
            <input
              name="name"
              required
              placeholder="New collection"
              className="rounded-lg border px-3 py-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</span>
            <textarea name="description" rows={3} className="rounded-lg border px-3 py-2" placeholder="Optional" />
          </label>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setSaveOpen(false)} className="rounded-full px-3 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              disabled={isSaving || selected.length === 0}
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
