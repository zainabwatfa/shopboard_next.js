import Link from "next/link";
import type { ReactNode } from "react";

export interface NavLinkProps {
  href: string;
  // True on the link to the page that is open: screen readers say "current page"
  isCurrent: boolean;
  children: ReactNode;
}

// A main-nav pill. The open page's link is a lavender sticker (plus a dot
// from sm), drawn from aria-current, so the style can never disagree with
// what screen readers hear.
export function NavLink({ href, isCurrent, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-transparent px-[0.4375rem] text-ink no-underline hover:bg-[color-mix(in_srgb,var(--color-st-lav)_30%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:border-line aria-[current=page]:bg-st-lav aria-[current=page]:text-on-fill sm:px-3 sm:aria-[current=page]:before:size-1.5 sm:aria-[current=page]:before:flex-none sm:aria-[current=page]:before:rounded-full sm:aria-[current=page]:before:bg-current sm:aria-[current=page]:before:content-['']"
    >
      {children}
    </Link>
  );
}
