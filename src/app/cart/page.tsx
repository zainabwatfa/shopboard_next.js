import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/CartView";
import { loadProducts } from "@/features/products/products.server.ts";

export const metadata: Metadata = {
  title: "Cart",
};

// The cart (/cart). The saved cart lives in the browser's localStorage, so
// the server can only prepare the products (for names and prices) and the
// empty shell; CartView fills in the rows after mounting.
export default async function CartPage() {
  const products = await loadProducts();
  return <CartView products={products} />;
}
