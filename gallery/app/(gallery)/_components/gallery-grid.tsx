"use client";

import { useMemo } from "react";

import type { GalleryItem } from "@/lib/catalog";
import { resolvePreviewComponent } from "@/lib/preview-map";

import { useSelection } from "./selection-context";

export interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const { selected, toggle } = useSelection();

  const countByCategory = useMemo(() => items.length, [items.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Components</h1>
        <span className="text-sm text-muted-foreground">
          Showing {items.length} item{items.length === 1 ? "" : "s"} · {selected.length} selected
        </span>
      </div>
      {countByCategory === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Adjust your filters to find components.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const Preview = resolvePreviewComponent(item.id);
            const isSelected = selected.includes(item.id);

            return (
              <article key={item.id} className="flex flex-col overflow-hidden rounded-3xl border bg-background shadow-sm">
                <div className="relative border-b bg-muted/40 p-4">
                  {Preview ? (
                    <div className="rounded-2xl border bg-background p-4">
                      <Preview />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                      Preview unavailable
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                  <header className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
                      >
                        {isSelected ? "Remove" : "Select"}
                      </button>
                    </div>
                    {item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}
                  </header>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(item.categories ?? []).map((category) => (
                      <span key={category} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                        {category}
                      </span>
                    ))}
                  </div>
                  <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="space-x-3">
                      {item.dependencies && item.dependencies.length > 0 ? (
                        <span>Deps: {item.dependencies.join(", ")}</span>
                      ) : (
                        <span>No runtime deps</span>
                      )}
                    </div>
                    <span>License: {item.license?.type ?? "Custom"}</span>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GalleryGrid;
