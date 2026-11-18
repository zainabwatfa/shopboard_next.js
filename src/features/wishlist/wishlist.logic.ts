// Pure functions for the wishlist: everything comes in as arguments, a new
// value goes out. No page access, no saving, and inputs are never changed.
import type { Product } from "../products/products.types.ts";

// Keeps only whole-number ids, each one once (the first time it appears).
// `unknown` because what was loaded from storage may be old or edited by hand.
export function sanitizeWishlist(saved: unknown): number[] {
  if (!Array.isArray(saved)) return [];
  const entries: readonly unknown[] = saved;
  const ids: number[] = [];
  for (const entry of entries) {
    if (
      typeof entry === "number" &&
      Number.isInteger(entry) &&
      !ids.includes(entry)
    ) {
      ids.push(entry);
    }
  }
  return ids;
}

export function isOnWishlist(ids: readonly number[], id: number): boolean {
  return ids.includes(id);
}

// On the wishlist: taken off. Not on it: added at the end, so the list stays
// in the order things were added.
export function toggleWishlistId(ids: readonly number[], id: number): number[] {
  return isOnWishlist(ids, id)
    ? ids.filter((entry) => entry !== id)
    : [...ids, id];
}

// Turns the saved ids into the products the page shows, most recently added
// first. find() can return undefined, so an id with no product is skipped
// instead of crashing.
export function getWishlistProducts(
  ids: readonly number[],
  products: readonly Product[],
): Product[] {
  return [...ids].reverse().flatMap((id) => {
    const product = products.find((entry) => entry.id === id);
    return product ? [product] : [];
  });
}
