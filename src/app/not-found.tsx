import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/shared/components/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
};

// 404 Not Found page: rendered by Next.js for any URL that matches no route
export default function NotFound() {
  return (
    <section className="pb-16 pt-10" aria-labelledby="not-found-title">
      <Eyebrow>Error 404</Eyebrow>
      <h1
        id="not-found-title"
        className="mb-4 font-poster text-[clamp(2.875rem,6vw,5.5rem)] font-black leading-[0.94] tracking-tight"
      >
        Page not <em className="not-italic text-accent">found</em>
      </h1>
      <p className="max-w-xl text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.45] text-smoke">
        We couldn&rsquo;t find the page you were looking for. The link may be
        mistyped or the resource has been relocated.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to shop</ButtonLink>
      </div>
    </section>
  );
}
