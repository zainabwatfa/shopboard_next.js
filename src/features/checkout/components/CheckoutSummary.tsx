import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format.ts";
import { ProductImage } from "@/features/products/components/ProductImage";
import type { CartLine } from "@/features/cart/cart.types.ts";

export interface CheckoutSummaryProps {
  lines: readonly CartLine[];
  count: number;
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
}

// The order summary beside the form: the cart lines, subtotal, shipping and
// the grand total. Prices always come from the product data.
export function CheckoutSummary({
  lines,
  count,
  subtotal,
  shippingCost,
  grandTotal,
}: CheckoutSummaryProps) {
  return (
    <aside aria-label="Order summary">
      <Card tint="ink" size="lg" className="flex flex-col gap-4 p-6">
        <h2 className="m-0 font-poster text-2xl font-black tracking-tight">
          Order summary ({count} items)
        </h2>
        <ul className="m-0 grid list-none gap-3 p-0">
          {lines.map((line) => (
            <li
              key={line.product.id}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] items-center gap-x-3"
            >
              <ProductImage
                src={line.product.image}
                size={60}
                sizes="2.5rem"
                className="aspect-square size-10 rounded-st-xs border-[1.5px] border-hairline-2 bg-[color-mix(in_srgb,var(--st-tint)_45%,var(--color-st-paper))] object-cover"
              />
              <span className="text-sm font-semibold leading-tight [overflow-wrap:anywhere]">
                {line.product.name}
              </span>
              <span className="font-mono text-xs text-smoke">
                Qty {line.qty}
              </span>
              <span className="text-right font-mono text-sm tabular-nums">
                {formatMoney(line.product.price * line.qty)}
              </span>
            </li>
          ))}
        </ul>
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4 border-t-2 border-dashed border-hairline-2 pt-4">
          Subtotal{" "}
          <strong className="font-mono text-[0.9375rem] tabular-nums">
            {formatMoney(subtotal)}
          </strong>
        </p>
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4">
          Shipping{" "}
          <strong className="font-mono text-[0.9375rem] tabular-nums">
            {shippingCost === 0 ? "Free" : formatMoney(shippingCost)}
          </strong>
        </p>
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4 border-t-2 border-line pt-4 font-bold">
          Total{" "}
          <strong className="font-poster text-2xl font-black tabular-nums">
            {formatMoney(grandTotal)}
          </strong>
        </p>
      </Card>
    </aside>
  );
}
