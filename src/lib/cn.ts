/* Joins Tailwind class strings, skipping false/undefined parts, so components
   can write cn(base, isOpen && "block", className). */
export function cn(
  ...parts: ReadonlyArray<string | false | undefined>
): string {
  return parts
    .filter((part): part is string => typeof part === "string")
    .join(" ");
}
