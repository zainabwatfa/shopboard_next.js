"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/messages.ts";

// The button under the line: "Try again" after a load error, "Clear filters"
// when nothing matches
export type StatusAction = {
  label: string;
  onClick: () => void;
};

export interface StatusMessageProps {
  id: string;
  tone: StatusTone;
  message: string;
  action?: StatusAction;
}

const errorCard =
  "border-solid border-down bg-[color-mix(in_srgb,var(--color-st-pink)_22%,var(--color-card))]";
const emptyCard = "border-dashed border-hairline-2 bg-surface";

// A page's status line: "Loading…", the result count, an empty state or an
// error. It is a polite live region, always in the page, so screen readers
// read every new text. "empty" and "error" draw the line as a card; with an
// action, the line and the button box below are drawn as one card.
export function StatusMessage({
  id,
  tone,
  message,
  action,
}: StatusMessageProps) {
  const lineRef = useRef<HTMLParagraphElement>(null);
  const isCard = tone !== "normal" || action !== undefined;

  // The line only has keyboard focus after its button was used (see below).
  // Emptied, it has nothing left to say, so focus moves on to the page's
  // heading ("Your cart" after "Try again" worked).
  useEffect(() => {
    const line = lineRef.current;
    if (message !== "" || !line || document.activeElement !== line) return;
    const heading = line.closest("main")?.querySelector("h1");
    if (heading instanceof HTMLElement) heading.focus();
  }, [message]);

  // The button disappears once it did its job, and focus would be lost with
  // it, so focus first moves to the line, which says what happens next
  // ("Loading products…")
  function handleAction(onClick: () => void): void {
    lineRef.current?.focus();
    onClick();
  }

  return (
    <>
      <p
        ref={lineRef}
        id={id}
        aria-live="polite"
        tabIndex={-1}
        className={cn(
          "mb-5",
          isCard
            ? cn(
                "rounded-st-sm border-2 px-6 py-8 text-center font-sans text-[1.0625rem] font-bold leading-[1.45] text-ink",
                tone === "error" ? errorCard : emptyCard,
              )
            : "font-mono text-[0.8125rem] leading-normal tracking-wide text-smoke",
          action && "mb-0 rounded-b-none border-b-0 pb-2",
        )}
      >
        {message}
      </p>
      {action ? (
        <div
          className={cn(
            "mb-5 flex justify-center rounded-b-st-sm border-2 border-t-0 px-6 pb-8 pt-2",
            tone === "error" ? errorCard : emptyCard,
          )}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction(action.onClick)}
          >
            {action.label}
          </Button>
        </div>
      ) : null}
    </>
  );
}
