import type { Metadata } from "next";
import { loadProducts } from "@/features/products/products.server.ts";
import { WishlistView } from "@/features/wishlist/components/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
};

// The wishlist (/wishlist). Like the cart, the saved list lives in the
// browser's localStorage, so the server can only prepare the products (for
// names, prices and pictures); WishlistView picks the marked ones after
// mounting.
export default async function WishlistPage() {
  const products = await loadProducts();
  return <WishlistView products={products} />;
}
