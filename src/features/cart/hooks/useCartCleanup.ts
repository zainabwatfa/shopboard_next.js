"use client";

import { useEffect } from "react";
import type { Product } from "@/features/products/products.types.ts";
import { useCart } from "./useCart.ts";

// Once the products are known, drop saved cart items whose product no longer
// exists. This belongs in an effect on purpose: the saved cart (localStorage,
// an external system) is being brought in line with the catalog — effects are
// for exactly that, not for deriving render values. One shared hook, so the
// shop, cart and checkout pages all do it the same way, once.
export function useCartCleanup(products: readonly Product[]): void {
  const { actions } = useCart();

  useEffect(() => {
    actions.keepOnly(products.map((product) => product.id));
  }, [products, actions]);
}
