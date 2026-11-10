import Link from "next/link";
import type { LinkGroup } from "@/lib/siteLinks.ts";

export interface FooterProps {
  // One column per group (Shop, About), see FOOTER_GROUPS in lib/siteLinks.ts
  groups: readonly LinkGroup[];
}

// The site footer: a dark panel card with the name, link groups and the demo line
export function Footer({ groups }: FooterProps) {
  return (
    <footer className="py-12 pb-10">
      <div className="mx-auto w-full max-w-7xl px-5">
        <div className="grid gap-8 rounded-st-lg border-2 border-line bg-panel p-7 text-on-panel shadow-[8px_8px_0_var(--color-st-lav-shade)] [&_:focus-visible]:outline-st-lav lg:grid-cols-[1fr_2fr]">
          <p className="m-0 font-poster text-4xl font-black tracking-tight">
            ShopBoard
          </p>
          <nav className="grid gap-7 sm:grid-cols-2" aria-label="Footer">
            {groups.map((group) => (
              <div key={group.heading}>
                <h2 className="mb-2 font-mono text-xs font-normal uppercase tracking-[0.08em] text-st-lav">
                  {group.heading}
                </h2>
                <ul className="m-0 grid list-none gap-0.5 p-0">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-9 items-center text-[0.9375rem] text-on-panel no-underline underline-offset-2 hover:text-st-lav hover:underline hover:decoration-2"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-flex min-h-9 items-center text-[0.9375rem] text-on-panel no-underline underline-offset-2 hover:text-st-lav hover:underline hover:decoration-2"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <p className="m-0 flex flex-wrap gap-2 gap-x-6 border-t border-panel-line pt-5 font-mono text-xs uppercase tracking-[0.06em] text-on-panel-muted lg:col-span-full">
            <span>© 2026 ShopBoard</span>
            <span>Demo shop for a course: no real orders or payments.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
