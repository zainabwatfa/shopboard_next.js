"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { NavLink } from "./NavLink";

// Which main-nav link matches the open page. In the React version App.tsx
// knew this; here the URL itself says it (usePathname).
function getCurrentPage(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/faq")) return "faq";
  if (pathname.startsWith("/cart")) return "cart";
  return "other";
}

// Navigation links for the site: Shop, About, FAQ, and Cart with live count badge
export function MainNav() {
  const pathname = usePathname();
  const { state } = useCart();
  const current = getCurrentPage(pathname);

  return (
    <nav aria-label="Main">
      <ul className="flex list-none items-center font-sans text-sm font-bold sm:gap-1">
        <li>
          <NavLink href="/" isCurrent={current === "shop"}>
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink href="/about" isCurrent={current === "about"}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink href="/faq" isCurrent={current === "faq"}>
            FAQ
          </NavLink>
        </li>
        <li>
          <NavLink href="/cart" isCurrent={current === "cart"}>
            Cart <Badge id="cart-count">{state.count}</Badge>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
