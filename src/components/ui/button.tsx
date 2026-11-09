import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* The sticker button. Variants only change colour and shade; sizes only
   change box and shadow depth, exactly like the CSS custom properties in the
   first ShopBoard. "quiet" is the link-style button used for Remove and
   Clear cart: no fill, a pink underline, red on hover. */

export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "md" | "sm" | "icon";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-2 text-center font-sans font-bold";

const variants: Record<Exclude<ButtonVariant, "quiet">, string> = {
  primary:
    "border-line bg-st-pink text-on-fill [--st-shade:var(--color-st-pink-shade)]",
  secondary:
    "border-line bg-card text-ink [--st-shade:var(--color-st-lav-shade)]",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 py-3.5 text-base",
  sm: "min-h-9 min-w-9 px-4 py-2 text-sm",
  icon: "size-9 p-0 text-lg",
};

/* Flat offset shadows: resting depth per size, +2px on hover, pressed to 2px */
const shadows: Record<ButtonSize, string> = {
  md: "shadow-st-md hover:shadow-[7px_7px_0_var(--st-shade)] active:shadow-[2px_2px_0_var(--st-shade)]",
  sm: "shadow-st-sm hover:shadow-[5px_5px_0_var(--st-shade)] active:shadow-[2px_2px_0_var(--st-shade)]",
  icon: "shadow-none hover:shadow-[2px_2px_0_var(--st-shade)] active:shadow-none",
};

/* Press model (only for people who haven't asked for less motion):
   hover lifts up-left, active presses down-right */
const motion =
  "motion-safe:transition-[transform,box-shadow] motion-safe:duration-150 motion-safe:ease-st motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px]";

const quiet =
  "min-h-12 border-transparent bg-transparent px-1 py-2 text-base text-ink underline decoration-st-pink-shade decoration-2 underline-offset-[5px] hover:text-down active:text-down";

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string | undefined,
): string {
  if (variant === "quiet") {
    return cn(base, quiet, className);
  }
  return cn(
    base,
    variants[variant],
    sizes[size],
    shadows[size],
    motion,
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

/* A link drawn as a button. Links that take you somewhere get an arrow
   (hidden from screen readers): → inside the site, ↗ to another site. */
type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: "go" | "external" | "none";
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = "go",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {arrow !== "none" && (
        <span aria-hidden="true">{arrow === "external" ? "↗" : "→"}</span>
      )}
    </Link>
  );
}
