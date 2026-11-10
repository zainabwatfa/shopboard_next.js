import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { ProductView } from "@/features/products/components/ProductView";
import {
  getRelatedProducts,
  parseProductId,
} from "@/features/products/products.logic.ts";
import {
  loadProduct,
  loadProducts,
} from "@/features/products/products.server.ts";

// At build time Next.js calls this and prerenders one page per product id,
// so /products/3 is ready HTML before anyone asks for it
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const products = await loadProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

// The browser tab shows the product's name (the layout adds "· ShopBoard")
export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const productId = parseProductId(id);
  const product = productId === null ? null : await loadProduct(productId);
  return { title: product === null ? "Product not found" : product.name };
}

// One product (/products/3). The [id] folder name makes the route dynamic:
// whatever stands in that spot of the URL arrives here as params.id, as text
// anyone can type — parseProductId (Day 3) checks it, and an unknown or
// invalid id renders the not-found.tsx next to this file via notFound().
export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const productId = parseProductId(id);
  if (productId === null) {
    notFound();
  }

  const product = await loadProduct(productId);
  if (product === null) {
    notFound();
  }

  const products = await loadProducts();
  const related = getRelatedProducts(products, product);

  return (
    <>
      <ButtonLink
        href="/"
        variant="secondary"
        size="sm"
        arrow="none"
        className="mb-5 mt-6"
      >
        <span aria-hidden="true">←</span> Back to shop
      </ButtonLink>
      <ProductView product={product} related={related} />
    </>
  );
}
