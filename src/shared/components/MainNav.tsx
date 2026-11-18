"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { HeartIcon } from "@/features/wishlist/components/HeartIcon";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist.ts";
import { NavLink } from "./NavLink";

// Which main-nav link matches the open page. In the React version App.tsx
// knew this; here the URL itself says it (usePathname).
function getCurrentPage(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/faq")) return "faq";
  if (pathname.startsWith("/wishlist")) return "wishlist";
  if (pathname.startsWith("/cart")) return "cart";
  return "other";
}

// Navigation links for the site: Shop, About, FAQ, then Wishlist and Cart,
// each with a live count badge
export function MainNav() {
  const pathname = usePathname();
  const { state } = useCart();
  const wishlist = useWishlist();
  const current = getCurrentPage(pathname);

  return (
    <nav aria-label="Main">
      {/* flex-wrap: on the narrowest phones (320px) the last link moves to a
          second row instead of pushing the page sideways */}
      <ul className="flex list-none flex-wrap items-center font-sans text-sm font-bold sm:gap-1">
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
          <NavLink href="/wishlist" isCurrent={current === "wishlist"}>
            {/* Five links don't fit a phone's width in words, so below sm
                the word is only read out and a heart stands for it */}
            <span className="sr-only sm:not-sr-only">Wishlist</span>
            <HeartIcon filled={false} className="size-[1.125rem] sm:hidden" />
            <Badge id="wishlist-count" tint="pink">
              {wishlist.count}
            </Badge>
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
