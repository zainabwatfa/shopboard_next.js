import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format.ts";
import { formatItemCount } from "@/lib/messages.ts";

export interface CartSummaryProps {
  count: number;
  total: number;
  // Asking "are you sure?" first is the page's job (the Modal)
  onClear: () => void;
}

// Item count, total, the demo note, checkout button, and next steps
export function CartSummary({ count, total, onClear }: CartSummaryProps) {
  return (
    <aside aria-labelledby="summary-title">
      <Card tint="ink" size="lg" className="flex flex-col gap-4 p-6">
        <h2
          id="summary-title"
          className="m-0 font-poster text-3xl font-black tracking-tight"
        >
          Summary
        </h2>
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          Items{" "}
          <span className="font-mono text-[0.9375rem]">
            {formatItemCount(count)}
          </span>
        </p>
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-dashed border-hairline-2 pt-4 font-bold">
          Total{" "}
          <strong className="font-poster text-3xl font-black tabular-nums [overflow-wrap:anywhere]">
            {formatMoney(total)}
          </strong>
        </p>
        <p className="m-0 rounded-st-xs border-[1.5px] border-hairline-2 bg-paper px-3.5 py-2.5 text-[0.8125rem] leading-[1.45] text-smoke">
          Demo shop for a course: test checkout with simulated orders.
        </p>
        <ButtonLink href="/checkout">Proceed to checkout</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Continue shopping
        </ButtonLink>
        <Button variant="quiet" className="self-center" onClick={onClear}>
          Clear cart
        </Button>
      </Card>
    </aside>
  );
}
