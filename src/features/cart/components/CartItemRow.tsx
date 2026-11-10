import { Button } from "@/components/ui/button";
import { Card, type CardTint } from "@/components/ui/card";
import { formatMoney } from "@/lib/format.ts";
import { ProductImage } from "@/features/products/components/ProductImage";
import type { Product } from "@/features/products/products.types.ts";
import type { CartLine } from "../cart.types.ts";
import { QuantityStepper } from "./QuantityStepper";

export interface CartItemRowProps {
  line: CartLine;
  // Position in the list: drives the sticker colour cycle, like the shop grid
  position: number;
  onChangeQty: (product: Product, delta: 1 | -1) => void;
  onRemove: (product: Product) => void;
}

const TINT_CYCLE: readonly CardTint[] = ["lav", "pink", "green", "yellow"];

// One cart row: picture, name, unit price, − qty +, line total, Remove.
// On phones the total goes under the name and the controls get their own
// row; from sm the total moves up next to the name.
export function CartItemRow({
  line,
  position,
  onChangeQty,
  onRemove,
}: CartItemRowProps) {
  const { product, qty, lineTotal } = line;
  return (
    <li className="list-none">
      <Card
        tint={TINT_CYCLE[position % TINT_CYCLE.length]}
        data-category={product.category}
        className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1 p-3.5 [grid-template-areas:'thumb_name_name'_'thumb_unit_unit'_'thumb_line_line'_'qty_qty_remove'] sm:[grid-template-areas:'thumb_name_line'_'thumb_unit_unit'_'thumb_qty_remove']"
      >
        <ProductImage
          src={product.image}
          size={96}
          sizes="4.5rem"
          className="aspect-square size-[4.5rem] self-start rounded-st-xs border-[1.5px] border-hairline-2 bg-[color-mix(in_srgb,var(--st-tint)_45%,var(--color-st-paper))] object-cover [grid-area:thumb]"
        />
        <span className="text-[1.0625rem] font-semibold leading-tight [grid-area:name] [overflow-wrap:anywhere]">
          {product.name}
        </span>
        <span className="font-mono text-[0.8125rem] leading-normal text-smoke [grid-area:unit]">
          {`${formatMoney(product.price)} each`}
        </span>
        <QuantityStepper
          name={product.name}
          qty={qty}
          onDecrease={() => onChangeQty(product, -1)}
          onIncrease={() => onChangeQty(product, 1)}
        />
        <span className="mt-1 font-poster text-xl font-black leading-none tabular-nums [grid-area:line] [overflow-wrap:anywhere] sm:mt-0 sm:text-right">
          {formatMoney(lineTotal)}
        </span>
        <Button
          variant="quiet"
          className="mt-2 justify-self-end [grid-area:remove]"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onRemove(product)}
        >
          Remove
        </Button>
      </Card>
    </li>
  );
}
