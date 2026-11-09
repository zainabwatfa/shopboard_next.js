import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* A small round sticker, like the cart count in the header: mono digits,
   ink outline, a tiny flat shadow. */

export type BadgeTint = "yellow" | "lav" | "pink" | "green";

const tints: Record<BadgeTint, string> = {
  yellow: "bg-st-yellow",
  lav: "bg-st-lav",
  pink: "bg-st-pink",
  green: "bg-st-green",
};

type BadgeProps = ComponentProps<"span"> & {
  tint?: BadgeTint;
};

export function Badge({ tint = "yellow", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-grid h-6 min-w-6 place-items-center rounded-full border-2 border-line px-1.5 font-mono text-xs font-bold text-on-fill tabular-nums shadow-[2px_2px_0_var(--color-line)]",
        tints[tint],
        className,
      )}
      {...props}
    />
  );
}
