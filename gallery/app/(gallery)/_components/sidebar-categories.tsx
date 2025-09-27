import Link from "next/link";

import type { CatalogFacets } from "@/lib/catalog";

function buildQuery(searchParams: URLSearchParams, key: string, value?: string) {
  const next = new URLSearchParams(searchParams);
  if (value) {
    next.set(key, value);
  } else {
    next.delete(key);
  }
  next.delete("page");
  const query = next.toString();
  return query ? `?${query}` : "?";
}

export interface SidebarCategoriesProps {
  facets: CatalogFacets;
  searchParams: URLSearchParams;
}

export function SidebarCategories({ facets, searchParams }: SidebarCategoriesProps) {
  const currentType = searchParams.get("type") ?? undefined;
  const currentCategory = searchParams.get("cat") ?? undefined;

  return (
    <aside className="w-full max-w-xs space-y-8">
      <section className="space-y-3">
        <header>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Types</h2>
        </header>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href={buildQuery(searchParams, "type")}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-muted ${!currentType ? "bg-muted" : ""}`}
            >
              <span>All</span>
              <span className="text-xs text-muted-foreground">{facets.types.reduce((sum, item) => sum + item.count, 0)}</span>
            </Link>
          </li>
          {facets.types.map((type) => (
            <li key={type.value}>
              <Link
                href={buildQuery(searchParams, "type", type.value)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-muted ${currentType === type.value ? "bg-muted" : ""}`}
              >
                <span>{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-3">
        <header>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</h2>
        </header>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href={buildQuery(searchParams, "cat")}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-muted ${!currentCategory ? "bg-muted" : ""}`}
            >
              <span>All</span>
              <span className="text-xs text-muted-foreground">{facets.categories.reduce((sum, item) => sum + item.count, 0)}</span>
            </Link>
          </li>
          {facets.categories.map((category) => (
            <li key={category.value}>
              <Link
                href={buildQuery(searchParams, "cat", category.value)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-muted ${currentCategory === category.value ? "bg-muted" : ""}`}
              >
                <span>{category.label}</span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export default SidebarCategories;
