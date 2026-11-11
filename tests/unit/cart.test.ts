// Three unit tests for the real cart logic: addToCart / the quantity rule
// live in cart.state.ts, the total in cart.logic.ts (pure). No components
// and no DOM are involved; the saved cart sits in jsdom's localStorage,
// which beforeEach wipes so every test starts from an empty cart.
import { beforeEach, describe, expect, it } from "vitest";
import { getCartTotal } from "@/features/cart/cart.logic.ts";
import { addToCart, getCart, reloadCart } from "@/features/cart/cart.state.ts";
import type { Product } from "@/features/products/products.types.ts";

// Realistic data: three items as they appear in public/api/products.json
const products: readonly Product[] = [
  {
    id: 1,
    name: "Leather Tote Bag",
    category: "Bags",
    price: 89,
    image: "products/leather-tote-bag.webp",
  },
  {
    id: 4,
    name: "White Sneakers",
    category: "Shoes",
    price: 75,
    image: "products/white-sneakers.webp",
  },
  {
    id: 8,
    name: "Silver Watch",
    category: "Accessories",
    price: 150,
    image: "products/silver-watch.webp",
  },
];

beforeEach(() => {
  // The cart module keeps its state across tests (it is a singleton by
  // design); wiping the storage and reloading gives each test a fresh cart
  localStorage.clear();
  reloadCart();
});

describe("cart", () => {
  it("adds a product to the cart", () => {
    addToCart(1);

    expect(getCart()).toEqual([{ id: 1, qty: 1 }]);
  });

  it("adding the same product again raises its quantity, never a second line", () => {
    addToCart(1);
    addToCart(1);
    addToCart(4);

    const cart = getCart();
    // Two lines, not three: the repeated product became qty 2
    expect(cart).toEqual([
      { id: 1, qty: 2 },
      { id: 4, qty: 1 },
    ]);
  });

  it("calculates the total from product prices and quantities", () => {
    // 2 × $89.00 + 1 × $150.00
    const cart = [
      { id: 1, qty: 2 },
      { id: 8, qty: 1 },
    ];
    expect(getCartTotal(cart, products)).toBe(328);

    // Edge cases: an empty cart costs nothing, and a saved id whose product
    // no longer exists is skipped instead of crashing the total
    expect(getCartTotal([], products)).toBe(0);
    expect(getCartTotal([{ id: 999, qty: 3 }], products)).toBe(0);
  });
});
