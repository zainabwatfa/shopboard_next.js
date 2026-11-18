"use client";

import { useSyncExternalStore } from "react";
import {
  getWishlist,
  keepOnlyWishlist,
  reloadWishlist,
  toggleWishlist,
} from "../wishlist.state.ts";

// The wishlist lives outside React (wishlist.state.ts + localStorage), so it
// is read with useSyncExternalStore, like the cart and the theme. The store
// is at module level: every component that calls useWishlist() shares it, so
// no provider is needed.

const listeners = new Set<() => void>();
let cached: readonly number[] | null = null;

// Something changed (an action here, another tab, the Back-Forward cache):
// drop the cached copy and tell React to read the snapshot again
function emitChange(): void {
  cached = null;
  for (const listener of listeners) {
    listener();
  }
}

function handleStorage(): void {
  reloadWishlist();
  emitChange();
}

function handlePageShow(event: PageTransitionEvent): void {
  if (event.persisted) {
    reloadWishlist();
    emitChange();
  }
}

// - "storage": the browser fires it in the other open tabs of this site when
//   saved data changes (a wishlist change made in another tab);
// - "pageshow" with persisted: Back or Forward showed this page from the
//   browser's cache, exactly as it was when the user left it.
function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePageShow);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePageShow);
    }
  };
}

// The same array again until something changes, so React can skip redraws
// (getWishlist() alone would build a fresh copy on every call)
function getSnapshot(): readonly number[] {
  if (cached === null) {
    cached = getWishlist();
  }
  return cached;
}

// On the server, and during the hydration render that must match the server's
// HTML, the saved wishlist is unknowable: it is empty there. Right after
// mounting React compares with getSnapshot() and redraws with the real one.
const EMPTY_WISHLIST: readonly number[] = [];

function getServerSnapshot(): readonly number[] {
  return EMPTY_WISHLIST;
}

// "Has the saved wishlist been read yet?" False on the server and during
// hydration, true from then on. Nothing ever changes it, so nothing subscribes.
function subscribeToNothing(): () => void {
  return () => {};
}

function getReady(): boolean {
  return true;
}

function getServerReady(): boolean {
  return false;
}

// Adds the product or takes it off, and returns the wishlist as it is now,
// so the caller can tell right away which of the two happened
function toggle(id: number): readonly number[] {
  toggleWishlist(id);
  emitChange();
  return getSnapshot();
}

// Drops ids whose product no longer exists; only a real change is reported
function keepOnly(validIds: readonly number[]): void {
  if (keepOnlyWishlist(validIds)) {
    emitChange();
  }
}

export interface WishlistControl {
  // The saved product ids, in the order they were added
  ids: readonly number[];
  count: number;
  // False until the saved wishlist has been read in the browser: an empty
  // list then means "not known yet", not "nothing on the wishlist"
  ready: boolean;
  toggle: (id: number) => readonly number[];
  keepOnly: (validIds: readonly number[]) => void;
}

// What any client component can read about the wishlist, and the only ways
// to change it (each runs the wishlist.state function behind it)
export function useWishlist(): WishlistControl {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribeToNothing,
    getReady,
    getServerReady,
  );
  return { ids, count: ids.length, ready, toggle, keepOnly };
}
