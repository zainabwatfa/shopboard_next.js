"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/products.types.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import { isOnWishlist } from "../wishlist.logic.ts";
import { HeartIcon } from "./HeartIcon";

// "icon": the round heart over a product card's picture.
// "labelled": the full button with words, on the product page.
export type WishlistButtonDisplay = "icon" | "labelled";

export interface WishlistButtonProps {
  product: Product;
  display: WishlistButtonDisplay;
  // Layout only (position, width), as on every primitive
  className?: string;
  // Called after a press with the new state, for a page that has to react
  // (the wishlist page announces a removal and moves focus)
  onChange?: (product: Product, onWishlist: boolean) => void;
}

// The heart: puts a product on the wishlist, or takes it off. It is a toggle
// button — the name stays the same and aria-pressed carries the state, so
// screen readers say "pressed" / "not pressed" by themselves and voice
// control always hears the same words. The heart is outlined when off and
// filled when on, so colour is not the only signal.
export function WishlistButton({
  product,
  display,
  className,
  onChange,
}: WishlistButtonProps) {
  const { ids, toggle } = useWishlist();
  const onWishlist = isOnWishlist(ids, product.id);

  function handleClick(): void {
    const next = toggle(product.id);
    onChange?.(product, isOnWishlist(next, product.id));
  }

  return (
    <Button
      variant={onWishlist ? "primary" : "secondary"}
      size={display === "icon" ? "icon" : "md"}
      aria-pressed={onWishlist}
      aria-label={`Add to wishlist: ${product.name}`}
      className={className}
      onClick={handleClick}
    >
      <HeartIcon filled={onWishlist} className="size-5" />
      {display === "labelled" ? "Add to wishlist" : null}
    </Button>
  );
}
