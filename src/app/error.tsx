"use client";

import { StatusMessage } from "@/shared/components/StatusMessage";
import { getLoadErrorMessage } from "@/lib/messages.ts";

export interface ErrorPageProps {
  // An error thrown in a Server Component arrives here serialized as a plain
  // Error (and redacted in production), so getLoadErrorMessage's ApiError
  // branches can't fire across this boundary: the generic message shows.
  error: Error & { digest?: string };
  // Next.js gives this: it renders the page again, so a failed load can retry
  // without a full reload
  reset: () => void;
}

// Shown by Next.js when a page throws while rendering (e.g. the products
// could not be read). The header and footer stay on screen; only the page's
// content is replaced by the error card — the same StatusMessage card the
// pages use for their own error states.
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="pt-10">
      <StatusMessage
        id="page-error"
        tone="error"
        message={getLoadErrorMessage(error)}
        action={{ label: "Try again", onClick: reset }}
      />
    </div>
  );
}
