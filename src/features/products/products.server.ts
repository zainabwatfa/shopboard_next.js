// Reads the products on the server, for Server Components.
//
// Day 3's products.api.ts asks for "api/products.json" relative to the page:
// fine in a browser, but on the server fetch has no page to resolve a
// relative URL against. So without an API base, the server takes the same
// JSON as a direct import — the bundler packs the data with the code, so it
// is there wherever the server code runs (dev, build, Vercel). With
// NEXT_PUBLIC_API_BASE_URL set (a real API, absolute URL), the server goes
// through the shared API client like everyone else. Validation is Day 3's
// isProduct either way: an import is still data nothing has checked.

import productsJson from "../../../public/api/products.json";
import { getProduct, getProducts } from "./products.api.ts";
import { isProduct } from "./products.logic.ts";
import type { Product } from "./products.types.ts";

function readBundledProducts(): Product[] {
  const data: unknown = productsJson;
  if (!Array.isArray(data)) {
    throw new Error("public/api/products.json did not hold a list");
  }
  return data.filter(isProduct);
}

// "use cache": the list is read once and reused across pages and requests,
// instead of being rebuilt (or refetched) for every render.
export async function loadProducts(): Promise<Product[]> {
  "use cache";
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return getProducts();
  }
  return readBundledProducts();
}

export async function loadProduct(id: number): Promise<Product | null> {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return getProduct(id);
  }
  const products = await loadProducts();
  const match = products.find((product) => product.id === id);
  return match ?? null;
}
