import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format.ts";
import { Eyebrow } from "@/shared/components/Eyebrow";
import type { Product } from "../products.types.ts";
import { ProductImage } from "./ProductImage";

export interface ProductDetailProps {
  product: Product;
  onAdd: (product: Product) => void;
}

// Product detail view: large media sticker, category eyebrow, title,
// formatted price, and Add to cart. Picture first on phones, side by side
// from md.
export function ProductDetail({ product, onAdd }: ProductDetailProps) {
  return (
    <article className="grid items-center gap-8 pb-4 pt-2 md:grid-cols-2">
      <div className="aspect-square w-full max-w-[34rem] rounded-st border-2 border-line bg-[color-mix(in_srgb,var(--st-tint)_45%,var(--color-st-paper))] p-[12%] shadow-st-lg">
        <ProductImage
          src={product.image}
          size={400}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Eyebrow className="mb-2">{product.category}</Eyebrow>
        <h1 className="m-0 font-poster text-[clamp(2.5rem,6vw,4.75rem)] font-black leading-[0.94] tracking-tight [overflow-wrap:anywhere]">
          {product.name}
        </h1>
        <p className="mb-5 mt-3 font-poster text-[2.5rem] font-black leading-none tracking-tight tabular-nums">
          {formatMoney(product.price)}
        </p>
        {/* The name starts with the visible words, so "click Add to cart"
            works in voice control, and screen readers hear which product */}
        <Button
          className="w-full"
          aria-label={`Add to cart: ${product.name}`}
          onClick={() => onAdd(product)}
        >
          Add to cart
        </Button>
      </div>
    </article>
  );
}
