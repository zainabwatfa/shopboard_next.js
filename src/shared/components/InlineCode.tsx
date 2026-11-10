import type { ReactNode } from "react";

// A code word inside running text, as a small paper chip
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border-[1.5px] border-hairline-2 bg-paper px-1.5 py-0.5 font-mono text-[0.875em] leading-[1.4]">
      {children}
    </code>
  );
}
