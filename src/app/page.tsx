import { UiPreview } from "./ui-preview";

export default function ShopPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10">
      <h1 className="mb-2 font-poster text-5xl font-black text-ink">
        Shop<em className="not-italic text-accent">Board</em> UI kit
      </h1>
      <p className="mb-10 max-w-xl text-lg text-smoke">
        Temporary preview of the five ui primitives. This page becomes the
        shop: hero, filters and the product grid.
      </p>
      <UiPreview />
    </main>
  );
}
