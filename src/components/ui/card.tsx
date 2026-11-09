import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* A sticker card: 2px ink outline, flat offset shadow in the card's shade.
   The tint decides the colour pair (--st-tint / --st-shade), which children
   can use too (image wells, icon circles, shadows). "ink" keeps the neutral
   ink shadow used by the filters panel and the cart summary. */

export type CardTint = "lav" | "pink" | "green" | "yellow" | "ink";
export type CardSize = "sm" | "lg";

const tints: Record<CardTint, string> = {
  lav: "[--st-tint:var(--color-st-lav)] [--st-shade:var(--color-st-lav-shade)]",
  pink: "[--st-tint:var(--color-st-pink)] [--st-shade:var(--color-st-pink-shade)]",
  green:
    "[--st-tint:var(--color-st-green)] [--st-shade:var(--color-st-green-shade)]",
  yellow:
    "[--st-tint:var(--color-st-yellow)] [--st-shade:var(--color-st-yellow-shade)]",
  ink: "[--st-tint:var(--color-st-lav)] [--st-shade:var(--shadow-ink)]",
};

const sizes: Record<CardSize, string> = {
  sm: "rounded-st-sm shadow-st-md",
  lg: "rounded-st shadow-st-lg",
};

type CardProps = ComponentProps<"div"> & {
  tint?: CardTint;
  size?: CardSize;
  /* filled: the tint is the background (hero tiles, CTA card); otherwise the
     card is paper with the tint kept for shadows and accents. */
  filled?: boolean;
};

export function Card({
  tint = "lav",
  size = "sm",
  filled = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border-2 border-line",
        tints[tint],
        sizes[size],
        filled ? "bg-(--st-tint) text-on-fill" : "bg-card text-ink",
        className,
      )}
      {...props}
    />
  );
}
