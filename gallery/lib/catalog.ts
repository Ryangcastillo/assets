import { promises as fs } from "node:fs";
import path from "node:path";

export interface RegistryIndexItem {
  id: string;
  name: string;
  type: string;
  categories?: string[];
  meta: string;
}

export interface RegistryIndex {
  registry: string;
  version: number;
  items: RegistryIndexItem[];
}

export interface RegistryFileDescriptor {
  src: string;
  dest: string;
  type: string;
}

export interface RegistryMeta {
  id: string;
  name: string;
  type: string;
  description?: string;
  categories?: string[];
  files: RegistryFileDescriptor[];
  preview?: {
    src: string;
  };
  dependencies?: string[];
  peerDependencies?: Record<string, string>;
  license?: {
    type: string;
    url?: string;
  };
}

export interface GalleryItem extends RegistryMeta {
  previewPath?: string;
}

const REGISTRY_ROOT = process.env.REGISTRY_ROOT
  ? path.resolve(process.env.REGISTRY_ROOT)
  : path.resolve(process.cwd(), "..", "ui-registry", "registry");

async function readJsonFile<T>(filePath: string): Promise<T> {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data) as T;
}

export async function loadRegistryIndex(): Promise<RegistryIndex> {
  const indexPath = path.join(REGISTRY_ROOT, "index.json");
  return readJsonFile<RegistryIndex>(indexPath);
}

export async function loadRegistryItems(): Promise<GalleryItem[]> {
  const index = await loadRegistryIndex();
  const items = await Promise.all(
    index.items.map(async (item) => {
      const metaPath = path.resolve(REGISTRY_ROOT, item.meta);
      const meta = await readJsonFile<RegistryMeta>(metaPath);
      return {
        ...meta,
        previewPath: meta.preview ? path.resolve(path.dirname(metaPath), meta.preview.src) : undefined,
      } satisfies GalleryItem;
    })
  );
  return items;
}

export interface FilterOptions {
  type?: string;
  category?: string;
  search?: string;
}

export function filterItems(items: GalleryItem[], options: FilterOptions): GalleryItem[] {
  const { type, category, search } = options;
  return items.filter((item) => {
    if (type && item.type !== type) {
      return false;
    }
    if (category && !(item.categories ?? []).includes(category)) {
      return false;
    }
    if (search) {
      const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) {
        return false;
      }
    }
    return true;
  });
}

export interface FacetCount {
  label: string;
  value: string;
  count: number;
}

export interface CatalogFacets {
  types: FacetCount[];
  categories: FacetCount[];
}

export function buildFacets(items: GalleryItem[]): CatalogFacets {
  const typeMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  for (const item of items) {
    typeMap.set(item.type, (typeMap.get(item.type) ?? 0) + 1);
    for (const category of item.categories ?? []) {
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
    }
  }

  return {
    types: Array.from(typeMap.entries()).map(([value, count]) => ({
      label: value.replace(/^[a-z]/, (letter) => letter.toUpperCase()),
      value,
      count,
    })),
    categories: Array.from(categoryMap.entries())
      .map(([value, count]) => ({
        label: value.replace(/(^|\s)([a-z])/g, (_, space, letter) => `${space}${letter.toUpperCase()}`),
        value,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}

export interface CollectionDefinition {
  id: string;
  name: string;
  description?: string;
  items: string[];
}

export async function listCollections(): Promise<CollectionDefinition[]> {
  const collectionsDir = path.resolve(process.cwd(), "collections");
  let files: string[] = [];
  try {
    files = await fs.readdir(collectionsDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const collections = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(collectionsDir, file);
      return readJsonFile<CollectionDefinition>(filePath);
    })
  );
  return collections;
}

export async function loadCollectionById(id: string): Promise<CollectionDefinition | undefined> {
  const collections = await listCollections();
  return collections.find((collection) => collection.id === id);
}
