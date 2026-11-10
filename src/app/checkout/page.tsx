import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/components/CheckoutView";
import { loadProducts } from "@/features/products/products.server.ts";
import { Eyebrow } from "@/shared/components/Eyebrow";

export const metadata: Metadata = {
  title: "Checkout",
};

// The simulated checkout (/checkout). The server prepares the products (the
// order summary needs their prices); the form itself is CheckoutView.
export default async function CheckoutPage() {
  const products = await loadProducts();

  return (
    <>
      <div className="pb-2 pt-10">
        <Eyebrow>Checkout</Eyebrow>
        <h1 className="mb-4 font-poster text-[clamp(2.875rem,6vw,5.5rem)] font-black leading-[0.94] tracking-tight">
          Complete your <em className="not-italic text-accent">order</em>
        </h1>
      </div>

      <p className="relative mb-8 max-w-2xl rounded-st-sm border-2 border-line bg-[color-mix(in_srgb,var(--color-st-yellow)_22%,var(--color-card))] py-4 pl-14 pr-5 leading-[1.5] shadow-[3px_3px_0_var(--color-st-yellow-shade)] before:absolute before:left-4 before:top-4 before:grid before:size-7 before:place-items-center before:rounded-full before:border-2 before:border-line before:bg-st-yellow before:font-mono before:text-sm before:font-bold before:text-on-fill before:content-['!']">
        <strong>Demo notice:</strong> ShopBoard is a course demonstration. No
        real payments, charges, or physical shipments occur.
      </p>

      <CheckoutView products={products} />
    </>
  );
}
