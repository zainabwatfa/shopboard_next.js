import Link from "next/link";
import type { ReactNode } from "react";

export interface HeaderProps {
  // What sits next to the logo: the main navigation (and later the theme switch)
  children: ReactNode;
}

// The site header. On phones it wraps to rows; from sm it is one row:
// logo on the left, nav in the middle.
export function Header({ children }: HeaderProps) {
  return (
    <header className="border-b-2 border-line bg-surface">
      <div className="mx-auto flex min-h-[3.75rem] w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-x-4">
        <Link
          className="inline-flex items-center gap-1.5 rounded-lg font-poster text-[1.0625rem] font-black tracking-tight text-ink no-underline sm:justify-self-start sm:gap-2 sm:text-xl"
          href="/"
          aria-label="ShopBoard home"
        >
          <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="size-7 flex-none overflow-visible text-st-pink [filter:drop-shadow(2px_2px_0_var(--color-line))] sm:size-8"
          >
            <path
              d="M4 9a5 5 0 0 1 5-5h9.6a3 3 0 0 1 2.1.9l7.4 7.4a3 3 0 0 1 0 4.2l-9.6 9.6a3 3 0 0 1-4.2 0L4.9 18.7A3 3 0 0 1 4 16.6z"
              fill="currentColor"
              className="stroke-on-fill stroke-[1.75] [stroke-linejoin:round]"
            />
            <circle
              cx="10.5"
              cy="10.5"
              r="2.6"
              className="fill-surface stroke-on-fill"
            />
            <path
              d="M13 20.5l6-6"
              strokeWidth="2"
              strokeLinecap="round"
              className="fill-surface stroke-on-fill"
            />
          </svg>
          ShopBoard
        </Link>
        {children}
      </div>
    </header>
  );
}
