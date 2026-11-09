import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* The sticker field: card fill, ink outline, lavender focus shadow.
   Invalid fields (aria-invalid, set by the form) turn red. ref arrives
   through props (React 19), so react-hook-form's register just works. */

type InputProps = ComponentProps<"input">;

/* The field look, shared with SelectField so the <select> matches without
   copying classes. */
export const fieldControlClasses =
  "min-h-12 w-full appearance-none rounded-input border-2 border-line bg-card px-4 py-3 font-sans text-base text-ink";

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        fieldControlClasses,
        "placeholder:text-ash placeholder:opacity-100",
        "focus-visible:shadow-[4px_4px_0_var(--color-st-lav-shade)] focus-visible:outline-3 focus-visible:outline-transparent",
        "aria-invalid:border-down aria-invalid:shadow-[3px_3px_0_var(--color-down)]",
        "motion-safe:transition-[transform,box-shadow] motion-safe:duration-150 motion-safe:ease-st motion-safe:focus-visible:-translate-x-px motion-safe:focus-visible:-translate-y-px",
        className,
      )}
      {...props}
    />
  );
}
