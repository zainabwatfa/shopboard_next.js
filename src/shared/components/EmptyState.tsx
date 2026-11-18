import type { ReactNode } from "react";

export interface EmptyStateProps {
  // "Your cart is empty."
  message: string;
  // What to do about it: a link back to the shop
  children: ReactNode;
}

// The dashed card a page shows instead of its list when there is nothing to
// list (the cart, the wishlist), with a way out underneath.
export function EmptyState({ message, children }: EmptyStateProps) {
  return (
    <div className="mb-16 mt-6 flex flex-col items-center gap-3 rounded-st-sm border-2 border-dashed border-hairline-2 bg-surface px-6 py-10 text-center text-smoke">
      <p className="m-0 text-lg font-bold text-ink">{message}</p>
      {children}
    </div>
  );
}
