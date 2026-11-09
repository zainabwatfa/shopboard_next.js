"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { getCartCount } from "../cart.logic.ts";
import {
  addToCart,
  changeQty,
  clearCart,
  getCart,
  keepOnly,
  reloadCart,
  removeFromCart,
} from "../cart.state.ts";
import type { CartItem } from "../cart.types.ts";
import { CartContext } from "../hooks/useCart.ts";
import type { CartActions, CartContextValue } from "../hooks/useCart.ts";

// The cart lives outside React, in cart.state.ts and localStorage, so the
// provider reads it with useSyncExternalStore: React subscribes to the store
// and redraws when it reports a change.

const listeners = new Set<() => void>();
let cached: readonly CartItem[] | null = null;

// An action ran, or another tab / the Back-Forward cache changed the saved
// cart: drop the cached copy and tell React to read the snapshot again
function emitChange(): void {
  cached = null;
  for (const listener of listeners) {
    listener();
  }
}

function handleStorage(): void {
  reloadCart();
  emitChange();
}

function handlePageShow(event: PageTransitionEvent): void {
  if (event.persisted) {
    reloadCart();
    emitChange();
  }
}

// - "storage": the browser fires it in the other open tabs of this site when
//   saved data changes (a cart change made in another tab);
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
// (getCart() alone would build a fresh copy on every call)
function getSnapshot(): readonly CartItem[] {
  if (cached === null) {
    cached = getCart();
  }
  return cached;
}

// On the server, and during the hydration render that must match the server's
// HTML, the saved cart is unknowable: it is empty there. Right after mounting
// React compares with getSnapshot() and redraws with the real one.
const EMPTY_CART: readonly CartItem[] = [];

function getServerSnapshot(): readonly CartItem[] {
  return EMPTY_CART;
}

export interface CartProviderProps {
  children: ReactNode;
}

// Gives the whole page one cart (header badge and page share it). The cart
// itself stays in cart.state.ts, which saves it in localStorage, so it
// survives a reload.
export function CartProvider({ children }: CartProviderProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Every action: change the cart in cart.state.ts (which reads the saved cart
  // first, so another tab's change is kept), then report the change
  const actions = useMemo<CartActions>(() => {
    const apply = (change: () => void): readonly CartItem[] => {
      change();
      emitChange();
      return getSnapshot();
    };
    return {
      add: (id) => apply(() => addToCart(id)),
      changeQty: (id, delta) => apply(() => changeQty(id, delta)),
      remove: (id) => apply(() => removeFromCart(id)),
      clear: () => apply(clearCart),
      keepOnly: (validIds) => apply(() => keepOnly(validIds)),
    };
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({ state: { items, count: getCartCount(items) }, actions }),
    [items, actions],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
