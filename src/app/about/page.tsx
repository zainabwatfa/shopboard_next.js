import type { Metadata } from "next";
import { Eyebrow } from "@/shared/components/Eyebrow";
import { InlineCode } from "@/shared/components/InlineCode";
import { TextLink } from "@/shared/components/TextLink";

export const metadata: Metadata = {
  title: "About",
};

// About page: explains the goals, architecture, and educational context of
// ShopBoard — updated to describe this Next.js version truthfully.
export default function AboutPage() {
  return (
    <>
      <section className="pb-6 pt-10" aria-labelledby="about-title">
        <Eyebrow>Our Story</Eyebrow>
        <h1
          id="about-title"
          className="mb-4 font-poster text-[clamp(2.875rem,6vw,5.5rem)] font-black leading-[0.94] tracking-tight"
        >
          About <em className="not-italic text-accent">ShopBoard</em>
        </h1>
        <p className="max-w-2xl text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.45] text-smoke">
          ShopBoard is a craftsmanship-first demo storefront designed to
          illustrate production-quality React patterns, strict TypeScript, and
          accessible interfaces.
        </p>
      </section>

      <section
        className="max-w-2xl pb-16 text-[1.0625rem] leading-[1.65]"
        aria-label="About details"
      >
        <h2 className="mb-4 font-poster text-[clamp(1.875rem,3.4vw,2.625rem)] font-black leading-none tracking-tight">
          Engineering Principles
        </h2>
        <p className="mb-5">
          ShopBoard was developed as part of a front-end engineering course.
          This version is built with Next.js and demonstrates how to build
          server-rendered React applications without shortcuts:
        </p>
        <ul className="mb-5 list-disc pl-6 marker:text-accent [&_li+li]:mt-2">
          <li>
            <strong>Strict Type Safety:</strong> Zero{" "}
            <InlineCode>any</InlineCode>, zero type assertions (
            <InlineCode>as</InlineCode>), and zero non-null assertions (
            <InlineCode>!</InlineCode>). All external data is guarded with
            runtime type guards.
          </li>
          <li>
            <strong>Shared Layout &amp; Unified Cart:</strong> A single,
            persisted cart state that coordinates smoothly across every page and
            survives browser reloads and multi-tab synchronization.
          </li>
          <li>
            <strong>Server Components First:</strong> Product data is read on
            the server and arrives as ready HTML; each route ships only the
            JavaScript its interactive parts need.
          </li>
          <li>
            <strong>Resilient Accessibility:</strong> Semantic landmarks, polite
            ARIA live regions for cart mutations and search results, and
            predictable keyboard focus management.
          </li>
        </ul>

        <h2 className="mb-4 mt-12 font-poster text-[clamp(1.875rem,3.4vw,2.625rem)] font-black leading-none tracking-tight">
          Demo Scope
        </h2>
        <p className="mb-5">
          Nothing is sold: there are no real transactions, payment processing,
          or physical inventory. All product imagery is sourced under Creative
          Commons from Pexels.
        </p>

        <p className="mb-5">
          Ready to explore? <TextLink href="/">Browse the collection</TextLink>{" "}
          or view the{" "}
          <TextLink href="/faq">Frequently Asked Questions</TextLink>.
        </p>
      </section>
    </>
  );
}
