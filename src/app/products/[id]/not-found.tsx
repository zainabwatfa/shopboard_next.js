import { ButtonLink } from "@/components/ui/button";

// Rendered by Next.js when page.tsx calls notFound(): an unknown or invalid
// product id. The header, nav and footer stay on screen around it.
export default function ProductNotFound() {
  return (
    <div className="my-10 flex flex-col items-center gap-3 rounded-st-sm border-2 border-dashed border-hairline-2 bg-surface px-6 py-10 text-center">
      <h1 className="m-0 font-poster text-[clamp(2rem,6vw,3rem)] font-black leading-none tracking-tight">
        Product not found
      </h1>
      <p className="m-0 mb-2 max-w-md text-smoke">
        We couldn&rsquo;t find the product you&rsquo;re looking for. It may
        have been removed or the link might be broken.
      </p>
      <ButtonLink href="/">Browse products</ButtonLink>
    </div>
  );
}
