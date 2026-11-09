import type { ReactNode } from "react";

// Dark mono pill above headings, with a small pink dot
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border-2 border-line bg-panel px-4 py-2 font-mono text-[0.8125rem] leading-tight uppercase tracking-[0.08em] text-on-panel before:size-2 before:flex-none before:rounded-full before:bg-st-pink before:content-['']">
      {children}
    </p>
  );
}
