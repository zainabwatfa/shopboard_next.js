"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ToastMessage } from "../hooks/useToast.ts";

export interface ToastProps {
  // null until the first message
  toast: ToastMessage | null;
  onDismiss: () => void;
  // How long it stays, in milliseconds (paused while the mouse or keyboard is on it)
  duration?: number;
}

// A short message at the bottom of the screen, with an optional link button.
// It is always in the page (invisible while closed), so it stays a live
// region (role="status") that screen readers watch.
export function Toast({ toast, onDismiss, duration = 6000 }: ToastProps) {
  const [text, setText] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  // The animation frame that will show the text (so it can be cancelled)
  const frame = useRef(0);
  const open = toast?.open ?? false;
  const id = toast?.id;
  const message = toast?.message ?? "";

  // A new message: the toast opens now and its text arrives two frames later
  // (the fade-in starts from visibility: hidden for one frame), so the region
  // is already visible when its text changes and the change is announced.
  // Then it hides itself after `duration`, unless the mouse or keyboard is
  // already on it.
  useEffect(() => {
    if (!open) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => setText(message));
    });
    const root = rootRef.current;
    const inUse =
      root !== null &&
      (root.matches(":hover") || root.contains(document.activeElement));
    if (!inUse) timer.current = window.setTimeout(onDismiss, duration);
    return () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(timer.current);
    };
  }, [id, open, message, duration, onDismiss]);

  // The timer stops while the mouse or keyboard is on the toast (reading it or
  // reaching "View cart" can take longer than a few seconds) and starts again
  // only when both have left
  function stopTimer(): void {
    window.clearTimeout(timer.current);
  }

  function startTimer(): void {
    window.clearTimeout(timer.current);
    if (open) timer.current = window.setTimeout(onDismiss, duration);
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>): void {
    if (!event.currentTarget.contains(document.activeElement)) startTimer();
  }

  // relatedTarget is where focus goes next: still inside means still in use
  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    const root = event.currentTarget;
    if (!root.contains(event.relatedTarget) && !root.matches(":hover")) {
      startTimer();
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "fixed inset-x-4 bottom-4 z-20 flex items-center gap-3 rounded-st-sm border-2 border-line bg-card p-3 pl-[1.125rem] text-ink shadow-ink-md sm:left-auto sm:max-w-md",
        "motion-safe:transition-[opacity,translate,visibility] motion-safe:duration-300",
        !open && "invisible opacity-0 motion-safe:translate-y-4",
      )}
      role="status"
      onMouseEnter={stopTimer}
      onFocus={stopTimer}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <p className="m-0 flex-1 text-[0.9375rem] leading-snug">{text}</p>
      {toast?.action ? (
        <ButtonLink
          href={toast.action.href}
          size="sm"
          arrow="none"
          className="flex-none"
        >
          {toast.action.label}
        </ButtonLink>
      ) : null}
      <Button
        variant="secondary"
        size="icon"
        aria-label="Dismiss message"
        onClick={onDismiss}
      >
        ×
      </Button>
    </div>
  );
}
