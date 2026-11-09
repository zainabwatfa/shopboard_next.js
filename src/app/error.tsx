"use client";

import { Button } from "@/components/ui/button";
import { getLoadErrorMessage } from "@/lib/messages.ts";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  // Next.js gives this: it renders the page again, so a failed load can retry
  // without a full reload
  reset: () => void;
}

// Shown by Next.js when a page throws while rendering (e.g. the products
// could not be read). The header and footer stay on screen; only the page's
// content is replaced by this card.
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="my-10 flex flex-col items-center gap-5 rounded-st-sm border-2 border-down bg-[color-mix(in_srgb,var(--color-st-pink)_22%,var(--color-card))] px-6 py-8 text-center">
      <p
        aria-live="polite"
        className="m-0 font-sans text-[1.0625rem] font-bold leading-[1.45] text-ink"
      >
        {getLoadErrorMessage(error)}
      </p>
      <Button variant="secondary" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
