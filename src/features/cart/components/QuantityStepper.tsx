import { Button } from "@/components/ui/button";

export interface QuantityStepperProps {
  // The product's name, for the buttons' accessible names
  name: string;
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

// − 2 +. Screen readers ignore aria-label on a plain <span>, so "Quantity" is
// real text, only hidden on screen: they read "Quantity 2", sighted users see "2".
export function QuantityStepper({
  name,
  qty,
  onDecrease,
  onIncrease,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2 [grid-area:qty] mt-2">
      <Button
        variant="secondary"
        size="icon"
        aria-label={`Decrease quantity of ${name}`}
        onClick={onDecrease}
      >
        −
      </Button>
      <span className="min-w-7 text-center font-mono text-base font-bold tabular-nums">
        <span className="sr-only">Quantity </span>
        {qty}
      </span>
      <Button
        variant="secondary"
        size="icon"
        aria-label={`Increase quantity of ${name}`}
        onClick={onIncrease}
      >
        +
      </Button>
    </div>
  );
}
