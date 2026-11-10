"use client";

import { Toast } from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast.ts";
import { getItemQty } from "@/features/cart/cart.logic.ts";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { getAddedMessage } from "@/lib/messages.ts";
import type { Product } from "../products.types.ts";
import { ProductDetail } from "./ProductDetail";
import { ProductGrid } from "./ProductGrid";

export interface ProductViewProps {
  // The server found these (app/products/[id]/page.tsx) and sent them with
  // the HTML; an unknown id never reaches this component (notFound())
  product: Product;
  related: readonly Product[];
}

// The interactive part of the product page: Add to cart (here and on the
// "More in …" cards) with the toast.
export function ProductView({ product, related }: ProductViewProps) {
  const { actions } = useCart();
  const { toast, showToast, dismissToast } = useToast();

  function handleAdd(added: Product): void {
    const items = actions.add(added.id);
    showToast(getAddedMessage(added.name, getItemQty(items, added.id)), {
      label: "View cart",
      href: "/cart",
    });
  }

  return (
    <>
      <ProductDetail product={product} onAdd={handleAdd} />
      {related.length > 0 ? (
        <section
          aria-label={`More in ${product.category}`}
          className="pb-16 pt-12"
        >
          <h2 className="mb-6 font-poster text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-tight">
            More in {product.category}
          </h2>
          <ProductGrid products={related} onAdd={handleAdd} />
        </section>
      ) : null}
      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
