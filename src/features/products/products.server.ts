// Reads the products on the server, for Server Components.
//
// Day 3's products.api.ts asks for "api/products.json" relative to the page:
// fine in a browser, but on the server fetch has no page to start from, and
// at build time there is no server to answer a URL at all. So without an API
// base, the server reads the same JSON straight from public/ — the file that
// would have answered the request anyway. With NEXT_PUBLIC_API_BASE_URL set
// (a real API, absolute URL), the server goes through the shared API client
// like everyone else. Validation is Day 3's isProduct either way.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getProduct, getProducts } from "./products.api.ts";
import { isProduct } from "./products.logic.ts";
import type { Product } from "./products.types.ts";

async function readProductsFile(): Promise<Product[]> {
  const path = join(process.cwd(), "public", "api", "products.json");
  const body = await readFile(path, "utf8");
  const data: unknown = JSON.parse(body);
  if (!Array.isArray(data)) {
    throw new Error("public/api/products.json did not hold a list");
  }
  return data.filter(isProduct);
}

// "use cache": the list is read once and reused across pages and requests,
// instead of hitting the disk (or the API) for every render.
export async function loadProducts(): Promise<Product[]> {
  "use cache";
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return getProducts();
  }
  return readProductsFile();
}

export async function loadProduct(id: number): Promise<Product | null> {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return getProduct(id);
  }
  const products = await loadProducts();
  const match = products.find((product) => product.id === id);
  return match ?? null;
}
