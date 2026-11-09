"use client";

import { useEffect, useId, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* A modal on top of the native <dialog>: the browser traps focus, handles
   Escape and draws the backdrop. The parent owns the open state; Escape
   fires the dialog's close event, which calls onClose so the state follows. */

type ModalProps = Omit<ComponentProps<"dialog">, "open" | "title"> & {
  open: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({
  open,
  onClose,
  title,
  className,
  children,
  ...props
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      className={cn(
        "m-auto w-[min(100%-2.5rem,26rem)] rounded-st-sm border-2 border-line bg-card p-6 text-ink shadow-ink-md",
        "backdrop:bg-ink/60",
        className,
      )}
      {...props}
    >
      <h2 id={titleId} className="mb-3 font-poster text-2xl font-black">
        {title}
      </h2>
      {children}
    </dialog>
  );
}
