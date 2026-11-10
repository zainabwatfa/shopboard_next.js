// Shown by Next.js while the checkout page's Server Component reads the products
export default function LoadingCheckout() {
  return (
    <p
      role="status"
      className="mb-5 pt-10 font-mono text-[0.8125rem] leading-normal tracking-wide text-smoke"
    >
      Loading order details…
    </p>
  );
}
