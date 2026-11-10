"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Eyebrow } from "@/shared/components/Eyebrow";
import { useAnnouncer } from "@/shared/hooks/useAnnouncer.ts";
import { describeCartChange } from "@/lib/messages.ts";
import type { Product } from "@/features/products/products.types.ts";
import {
  getCartCount,
  getCartLines,
  getCartTotal,
  getItemQty,
} from "../cart.logic.ts";
import type { CartChange, CartItem } from "../cart.types.ts";
import { useCart } from "../hooks/useCart.ts";
import { useCartCleanup } from "../hooks/useCartCleanup";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

export interface CartViewProps {
  // The server read these (app/cart/page.tsx); prices always come from the
  // product data — the saved cart only has { id, qty }
  products: readonly Product[];
}

// The rows (+ / − / Remove), the summary, and Clear cart behind the Modal.
export function CartView({ products }: CartViewProps) {
  const { state: cart, actions } = useCart();
  useCartCleanup(products);
  const { announcement, announce } = useAnnouncer();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const lines = getCartLines(cart.items, products);
  const total = getCartTotal(cart.items, products);

  // Another tab can remove the row that holds keyboard focus; the browser
  // then drops focus on <body>. When rows just disappeared and focus ended up
  // there, move it to the heading instead of losing it.
  const prevLineCount = useRef(lines.length);
  useLayoutEffect(() => {
    const previous = prevLineCount.current;
    prevLineCount.current = lines.length;
    if (lines.length < previous && document.activeElement === document.body) {
      headingRef.current?.focus();
    }
  });

  // Says what changed (items is the cart after the change), for screen reader users
  function announceChange(
    change: CartChange,
    items: readonly CartItem[],
  ): void {
    announce(
      describeCartChange(change, {
        count: getCartCount(items),
        total: getCartTotal(items, products),
      }),
    );
  }

  // + and −. A quantity never reaches 0: − on 1 removes the product (cart.state).
  function handleChangeQty(product: Product, delta: 1 | -1): void {
    const items = actions.changeQty(product.id, delta);
    const qty = getItemQty(items, product.id);
    if (qty > 0) {
      announceChange({ type: "quantity", name: product.name, qty }, items);
      return;
    }
    announceChange({ type: "removed", name: product.name }, items);
    headingRef.current?.focus();
  }

  function handleRemove(product: Product): void {
    const items = actions.remove(product.id);
    announceChange({ type: "removed", name: product.name }, items);
    headingRef.current?.focus();
  }

  // The Modal's "Clear cart": the row that opened it disappears with the rest
  // of the summary, so once the dialog has closed (and tried to give focus
  // back to that gone button), the heading takes it.
  function handleConfirmClear(): void {
    const items = actions.clear();
    announceChange({ type: "cleared" }, items);
    setConfirmOpen(false);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  return (
    <>
      <div className="pb-2 pt-10">
        <Eyebrow>Your bag</Eyebrow>
        <h1
          id="cart-title"
          ref={headingRef}
          tabIndex={-1}
          className="mb-4 font-poster text-[clamp(2.875rem,6vw,5.5rem)] font-black leading-[0.94] tracking-tight"
        >
          Your <em className="not-italic text-accent">cart</em>
        </h1>
      </div>

      <p className="sr-only" role="status">
        {announcement}
      </p>

      {lines.length === 0 ? (
        <div className="mb-16 mt-6 flex flex-col items-center gap-3 rounded-st-sm border-2 border-dashed border-hairline-2 bg-surface px-6 py-10 text-center text-smoke">
          <p className="m-0 text-lg font-bold text-ink">Your cart is empty.</p>
          <ButtonLink href="/">Browse the shop</ButtonLink>
        </div>
      ) : (
        <div className="mb-16 mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
          <ul className="m-0 grid gap-5 p-0" aria-labelledby="cart-title">
            {lines.map((line, position) => (
              <CartItemRow
                key={line.product.id}
                line={line}
                position={position}
                onChangeQty={handleChangeQty}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <CartSummary
            count={cart.count}
            total={total}
            onClear={() => setConfirmOpen(true)}
          />
        </div>
      )}

      {/* Clearing removes every row at once and can't be undone, so ask first */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear the cart?"
      >
        <p className="mb-5 mt-0 text-smoke">
          This removes all items from your cart.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Keep items
          </Button>
          <Button onClick={handleConfirmClear}>Clear cart</Button>
        </div>
      </Modal>
    </>
  );
}
