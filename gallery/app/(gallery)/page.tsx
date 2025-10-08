import { Suspense } from "react";

import { buildFacets, filterItems, listCollections, loadRegistryItems } from "@/lib/catalog";

import { GalleryGrid } from "./_components/gallery-grid";
import { SidebarCategories } from "./_components/sidebar-categories";
import { SelectionProvider } from "./_components/selection-context";
import { Toolbar } from "./_components/toolbar";

interface GalleryPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function toUrlSearchParams(searchParams: GalleryPageProps["searchParams"]) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else if (typeof value === "string") {
      params.set(key, value);
    }
  }
  return params;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const items = await loadRegistryItems();
  const params = toUrlSearchParams(searchParams);
  const activeType = params.get("type") ?? undefined;
  const activeCategory = params.get("cat") ?? undefined;
  const search = params.get("q") ?? undefined;

  const filteredItems = filterItems(items, {
    type: activeType,
    category: activeCategory,
    search,
  });
  const facets = buildFacets(items);
  const collections = await listCollections();

  return (
    <SelectionProvider>
      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-12">
        <div className="hidden shrink-0 md:block">
          <SidebarCategories facets={facets} searchParams={params} />
        </div>
        <div className="flex-1 space-y-10">
          <Toolbar collections={collections} />
          <Suspense fallback={<div>Loading components…</div>}>
            <GalleryGrid items={filteredItems} />
          </Suspense>
        </div>
      </div>
    </SelectionProvider>
  );
}
