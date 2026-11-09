import type { Product } from "../products.types.ts";
import { ProductCard } from "./ProductCard";

export interface ProductGridProps {
  products: readonly Product[];
  onAdd: (product: Product) => void;
}

// The cards, in the order given. The key is the product id, so a card keeps
// its place (and its focused button) when the list is filtered or sorted.
export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-5 gap-x-4 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] sm:gap-8 sm:gap-x-6">
      {products.map((product, position) => (
        <ProductCard
          key={product.id}
          product={product}
          position={position}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
