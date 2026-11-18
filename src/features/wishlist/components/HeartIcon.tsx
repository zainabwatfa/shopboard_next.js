import { cn } from "@/lib/cn";

export interface HeartIconProps {
  // Filled: on the wishlist. Outlined: not on it. The shape carries the
  // state, so colour is never the only signal.
  filled: boolean;
  // Layout only (size, when it is shown)
  className?: string;
}

// The wishlist's heart, drawn in the text colour. Decorative: the control
// around it has the name, so screen readers skip the picture.
// The outline is from Feather Icons (MIT).
export function HeartIcon({ filled, className }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(
        "flex-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]",
        filled ? "fill-current" : "fill-none",
        className,
      )}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
