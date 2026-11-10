import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, type CardTint } from "@/components/ui/card";
import { formatMoney } from "@/lib/format.ts";
import type { Product } from "../products.types.ts";
import { ProductImage } from "./ProductImage";

export interface ProductCardProps {
  product: Product;
  // Position in the grid: drives the sticker colour cycle lav → pink → green → yellow
  position: number;
  onAdd: (product: Product) => void;
}

// In the React version a CSS nth-child rule cycled the colours; here the
// position picks the Card tint in code.
const TINT_CYCLE: readonly CardTint[] = ["lav", "pink", "green", "yellow"];

// One product: picture, category, name, price and "Add to cart".
// The image and name link to the product details page.
export function ProductCard({ product, position, onAdd }: ProductCardProps) {
  return (
    <Card
      tint={TINT_CYCLE[position % TINT_CYCLE.length]}
      className="group flex flex-col p-2 sm:p-3"
      data-category={product.category}
    >
      <Link
        href={`/products/${product.id}`}
        aria-label={product.name}
        className="block aspect-square overflow-hidden rounded-well border-[1.5px] border-hairline-2 bg-[color-mix(in_srgb,var(--st-tint)_45%,var(--color-st-paper))]"
      >
        <ProductImage
          src={product.image}
          size={200}
          sizes="(min-width: 640px) 18rem, 50vw"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-400 motion-safe:group-hover:scale-105"
        />
      </Link>
      <div className="flex grow flex-col gap-1 px-1 pb-1 pt-3">
        <p className="m-0 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-smoke">
          {product.category}
        </p>
        <h3 className="m-0 text-base font-semibold leading-tight">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mb-3.5 mt-1 grow font-poster text-2xl font-black tracking-tight tabular-nums">
          {formatMoney(product.price)}
        </p>
        {/* The name starts with the visible words, so "click Add to cart"
            works in voice control, and screen readers hear which product */}
        <Button
          size="sm"
          className="w-full"
          aria-label={`Add to cart: ${product.name}`}
          onClick={() => onAdd(product)}
        >
          Add to cart
        </Button>
      </div>
    </Card>
  );
}
