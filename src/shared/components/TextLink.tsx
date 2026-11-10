import Link from "next/link";
import type { ReactNode } from "react";

// A link inside running text: ink text with a visible accent underline
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-ink underline decoration-accent decoration-2 underline-offset-[0.2em] hover:text-accent"
    >
      {children}
    </Link>
  );
}
