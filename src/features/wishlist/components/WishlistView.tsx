"use client";

import { useLayoutEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { Eyebrow } from "@/shared/components/Eyebrow";
import { Toast } from "@/shared/components/Toast";
import { useAnnouncer } from "@/shared/hooks/useAnnouncer.ts";
import { useToast } from "@/shared/hooks/useToast.ts";
import { getItemQty } from "@/features/cart/cart.logic.ts";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import type { Product } from "@/features/products/products.types.ts";
import { getAddedMessage } from "@/lib/messages.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import { useWishlistCleanup } from "../hooks/useWishlistCleanup.ts";
import { getWishlistProducts } from "../wishlist.logic.ts";
import {
  describeWishlistRemoval,
  getWishlistStatus,
} from "../wishlist.messages.ts";

export interface WishlistViewProps {
  // The server read these (app/wishlist/page.tsx); names, prices and pictures
  // always come from the product data — the saved wishlist only has ids
  products: readonly Product[];
}

// The wishlist page: the marked products as the same cards the shop shows
// (so "Add to cart" and the heart work here too), newest first.
export function WishlistView({ products }: WishlistViewProps) {
  const { ids, ready } = useWishlist();
  useWishlistCleanup(products);
  const { actions } = useCart();
  const { toast, showToast, dismissToast } = useToast();
  const { announcement, announce } = useAnnouncer();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const shown = getWishlistProducts(ids, products);

  // Another tab can take off the card that holds keyboard focus; the browser
  // then drops focus on <body>. When cards just disappeared and focus ended
  // up there, move it to the heading instead of losing it.
  const prevShownCount = useRef(shown.length);
  useLayoutEffect(() => {
    const previous = prevShownCount.current;
    prevShownCount.current = shown.length;
    if (shown.length < previous && document.activeElement === document.body) {
      headingRef.current?.focus();
    }
  });

  // Exactly what the shop does: add, then the toast with "View cart". The
  // product stays on the wishlist.
  function handleAdd(product: Product): void {
    const cart = actions.add(product.id);
    showToast(getAddedMessage(product.name, getItemQty(cart, product.id)), {
      label: "View cart",
      href: "/cart",
    });
  }

  // A heart was pressed on this page. Only "taken off" needs anything: the
  // card (and the button that had focus) is about to disappear, so say what
  // happened and give focus to the heading first.
  function handleWishlistChange(product: Product, onWishlist: boolean): void {
    if (onWishlist) return;
    announce(describeWishlistRemoval(product.name, shown.length - 1));
    headingRef.current?.focus();
  }

  return (
    <>
      <div className="pb-2 pt-10">
        <Eyebrow>Saved for later</Eyebrow>
        <h1
          id="wishlist-title"
          ref={headingRef}
          tabIndex={-1}
          className="mb-4 font-poster text-[clamp(2.875rem,6vw,5.5rem)] font-black leading-[0.94] tracking-tight"
        >
          Your <em className="not-italic text-accent">wishlist</em>
        </h1>
      </div>

      <p className="sr-only" role="status">
        {announcement}
      </p>

      {/* Before the saved wishlist has been read (the server's HTML, the
          first moment in the browser) an empty list means "not known yet",
          so the page says it is loading, not that the wishlist is empty */}
      {!ready ? (
        <p className="mb-16 font-mono text-[0.8125rem] leading-normal tracking-wide text-smoke">
          Loading your wishlist…
        </p>
      ) : shown.length === 0 ? (
        <EmptyState message="Your wishlist is empty.">
          <ButtonLink href="/">Browse the shop</ButtonLink>
        </EmptyState>
      ) : (
        <section aria-labelledby="wishlist-title" className="pb-16">
          <p className="mb-5 font-mono text-[0.8125rem] leading-normal tracking-wide text-smoke">
            {getWishlistStatus(shown.length)}
          </p>
          <ProductGrid
            products={shown}
            onAdd={handleAdd}
            onWishlistChange={handleWishlistChange}
          />
        </section>
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
