"use client";

import { StatusMessage } from "@/shared/components/StatusMessage";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { getLoadErrorMessage, withSavedItems } from "@/lib/messages.ts";

export interface CartErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// The cart page threw (the products could not be read): the rows can't be
// shown, but the saved items are untouched and the header badge still counts
// them — the message says so, so both tell the same story.
export default function CartError({ error, reset }: CartErrorProps) {
  const { state } = useCart();
  return (
    <div className="pt-10">
      <StatusMessage
        id="cart-error"
        tone="error"
        message={withSavedItems(getLoadErrorMessage(error), state.count)}
        action={{ label: "Try again", onClick: reset }}
      />
    </div>
  );
}
