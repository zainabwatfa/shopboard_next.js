// The wishlist: a list of product ids, in the order they were added. This
// file owns it, changes it and saves it; nothing else touches the key.
// localStorage only stores text, so JSON.stringify to save and JSON.parse to load.
import { sanitizeWishlist, toggleWishlistId } from "./wishlist.logic.ts";

const WISHLIST_KEY = "shopboard-wishlist";

let wishlist: number[] = loadWishlist();

// True when the last save failed. The copy in memory is then newer than the
// saved one, so it is kept instead of being replaced by older saved data.
let lastSaveFailed = false;

function loadWishlist(): number[] {
  try {
    // getItem returns null when nothing is saved; JSON.parse only accepts text
    const saved: unknown = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) ?? "null",
    );
    return sanitizeWishlist(saved);
  } catch {
    return []; // storage blocked, or the saved text is not valid JSON
  }
}

function saveWishlist(): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    lastSaveFailed = false;
  } catch {
    // storage full or blocked: the wishlist still works until the page is closed
    lastSaveFailed = true;
  }
}

// Reads the saved wishlist again, so changes made in another tab are picked
// up. Every change below calls it first, so a save never overwrites newer data.
export function reloadWishlist(): void {
  if (lastSaveFailed) return;
  wishlist = loadWishlist();
}

// Returns a copy, so nothing outside this file can change the wishlist by accident
export function getWishlist(): number[] {
  return [...wishlist];
}

// Adds the product, or takes it off if it is already there
export function toggleWishlist(id: number): void {
  reloadWishlist();
  wishlist = toggleWishlistId(wishlist, id);
  saveWishlist();
}

// Drops saved ids whose product no longer exists (called once the product
// list is known). Saves only if something was removed, and says whether it did.
export function keepOnlyWishlist(validIds: readonly number[]): boolean {
  reloadWishlist();
  const kept = wishlist.filter((id) => validIds.includes(id));
  if (kept.length === wishlist.length) return false;
  wishlist = kept;
  saveWishlist();
  return true;
}
