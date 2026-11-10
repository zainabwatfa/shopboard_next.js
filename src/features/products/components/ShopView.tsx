"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eyebrow } from "@/shared/components/Eyebrow";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { Toast } from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast.ts";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { getItemQty } from "@/features/cart/cart.logic.ts";
import { getAddedMessage, getResultsStatus } from "@/lib/messages.ts";
import { HERO_TILES } from "../hero.ts";
import type { HeroTile } from "../hero.ts";
import {
  DEFAULT_FILTERS,
  filterProducts,
  sortProducts,
  toFilterQuery,
} from "../products.logic.ts";
import type { Filters, Product } from "../products.types.ts";
import { Hero } from "./Hero";
import { ProductGrid } from "./ProductGrid";
import { ShopFilters } from "./ShopFilters";

export interface ShopViewProps {
  // The server read these (products.server.ts) and sent them with the HTML
  products: readonly Product[];
  // The filters the URL asked for (?q=tote&category=Bags&sort=price-asc),
  // parsed on the server, so the first drawing is already filtered
  initialFilters: Filters;
}

// The interactive shop: search, category filter, sort, the product cards and
// the add-to-cart toast. The products themselves arrive as a prop from the
// Server Component in app/page.tsx.
export function ShopView({ products, initialFilters }: ShopViewProps) {
  const { actions } = useCart();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const { toast, showToast, dismissToast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  // useState reads initialFilters only on the first render; after that the
  // two live apart on purpose (typing must not wait for the server). But a
  // NAVIGATION to the shop (the Shop nav link, a hero link) brings new
  // initialFilters from the server, and the list must follow them — this is
  // React's "adjusting state when a prop changes" pattern: compare during
  // render, set state, and React restarts the render before touching the DOM.
  const [syncedWith, setSyncedWith] = useState<Filters>(initialFilters);
  if (syncedWith !== initialFilters) {
    setSyncedWith(initialFilters);
    setFilters(initialFilters);
  }

  // Once the products are known, drop cart items whose product no longer exists
  useEffect(() => {
    actions.keepOnly(products.map((product) => product.id));
  }, [products, actions]);

  // Keeps the address bar in step with the filters, without a reload and
  // without adding Back steps, so a link, a bookmark or a reload shows the
  // same list (the server parses the query back into initialFilters)
  useEffect(() => {
    const query = toFilterQuery(filters);
    window.history.replaceState(
      null,
      "",
      query === "" ? window.location.pathname : query,
    );
  }, [filters]);

  // Filter first, then sort a copy (sortProducts never changes its input)
  const shown = useMemo(
    () =>
      sortProducts(
        filterProducts(products, filters.query, filters.category),
        filters.sortKey,
      ),
    [products, filters],
  );

  function handleAdd(product: Product): void {
    const cart = actions.add(product.id);
    showToast(getAddedMessage(product.name, getItemQty(cart, product.id)), {
      label: "View cart",
      href: "/cart",
    });
  }

  // "Clear filters" (shown when nothing matches): everything again, and
  // keyboard focus in the search box, ready for a new search
  function handleClearFilters(): void {
    setFilters(DEFAULT_FILTERS);
    searchRef.current?.focus();
  }

  // A hero tile: search for that product (other filters reset) and move
  // focus to the search box, which also scrolls the list into view
  function handlePickTile(tile: HeroTile): void {
    setFilters({ ...DEFAULT_FILTERS, query: tile.name });
    searchRef.current?.focus();
  }

  const results = getResultsStatus(shown.length, products.length);

  return (
    <>
      <Hero
        tiles={HERO_TILES}
        productCount={products.length}
        onPick={handlePickTile}
      />

      <div className="pb-2 pt-10">
        <Eyebrow>The collection</Eyebrow>
        <h2
          id="products-title"
          className="mb-4 font-poster text-[clamp(2.25rem,4.5vw,3.75rem)] font-black leading-[0.94] tracking-tight [text-wrap:balance]"
        >
          Find your next <em className="not-italic text-accent">favourite</em>
        </h2>
        <p className="max-w-xl text-lg leading-[1.45] text-smoke">
          Search by name, filter by category or sort by price. Everything you
          add waits in your cart.
        </p>
      </div>

      <section aria-labelledby="products-title" className="pb-16">
        <ShopFilters
          filters={filters}
          onChange={setFilters}
          searchRef={searchRef}
        />
        <StatusMessage
          id="product-status"
          tone={results.tone}
          message={results.message}
          action={
            results.offerClear
              ? { label: "Clear filters", onClick: handleClearFilters }
              : undefined
          }
        />
        <ProductGrid products={shown} onAdd={handleAdd} />
      </section>

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
