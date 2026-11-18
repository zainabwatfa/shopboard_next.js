"use client";

import { useEffect } from "react";
import type { Product } from "@/features/products/products.types.ts";
import { useWishlist } from "./useWishlist.ts";

// Once the products are known, drop wishlist ids whose product no longer
// exists, so the header count never includes something that can't be shown.
// An effect on purpose, like useCartCleanup: saved data (localStorage, an
// external system) is being brought in line with the catalogue. An empty
// product list is "nothing to compare with", not "every product is gone", so
// it leaves the wishlist alone.
export function useWishlistCleanup(products: readonly Product[]): void {
  const { keepOnly } = useWishlist();

  useEffect(() => {
    if (products.length === 0) return;
    keepOnly(products.map((product) => product.id));
  }, [products, keepOnly]);
}
