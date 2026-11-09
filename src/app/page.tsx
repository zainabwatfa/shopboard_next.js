import { ShopView } from "@/features/products/components/ShopView";
import { parseFilters } from "@/features/products/products.logic.ts";
import { loadProducts } from "@/features/products/products.server.ts";

// ?q=tote gives "tote", ?q=a&q=b gives "a", and a missing key gives ""
function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

// The shop (/). A Server Component: it reads the products and the URL's
// filters on the server, so the HTML already holds the filtered list, then
// hands both to the interactive ShopView.
export default async function ShopPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const products = await loadProducts();
  const initialFilters = parseFilters({
    query: firstValue(params.q).trim(),
    category: firstValue(params.category),
    sortKey: firstValue(params.sort),
  });

  return <ShopView products={products} initialFilters={initialFilters} />;
}
