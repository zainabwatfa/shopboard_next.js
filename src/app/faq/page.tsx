import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Eyebrow } from "@/shared/components/Eyebrow";
import { InlineCode } from "@/shared/components/InlineCode";
import { TextLink } from "@/shared/components/TextLink";

export const metadata: Metadata = {
  title: "FAQ",
};

// One question card: native <details>, the ▸ turns when the answer is open
function FaqItem({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <details className="group mb-4 rounded-st-xs border-2 border-line bg-card shadow-ink-sm">
      <summary className="relative block cursor-pointer list-none rounded-[calc(var(--radius-st-xs)-2px)] py-3.5 pl-9 pr-4 font-mono text-sm font-bold uppercase leading-[1.45] tracking-[0.04em] before:absolute before:left-4 before:top-3.5 before:text-accent before:content-['▸'] hover:bg-[color-mix(in_srgb,var(--color-st-lav)_22%,transparent)] group-open:rounded-b-none group-open:border-b-[1.5px] group-open:border-dashed group-open:border-hairline-2 group-open:before:rotate-90 motion-safe:before:transition-transform [&::-webkit-details-marker]:hidden">
        {question}
      </summary>
      <div className="px-4 pb-1 pt-4 [&_p]:mb-3.5">{children}</div>
    </details>
  );
}

// FAQ page: accessible collapsible answers for questions about the shop —
// the "how is it built" answers describe this Next.js version.
export default function FaqPage() {
  return (
    <>
      <section className="pb-6 pt-10" aria-labelledby="faq-title">
        <Eyebrow>Help &amp; Questions</Eyebrow>
        <h1
          id="faq-title"
          className="mb-4 font-poster text-[clamp(2.875rem,6vw,5.5rem)] font-black leading-[0.94] tracking-tight"
        >
          Frequently Asked <em className="not-italic text-accent">Questions</em>
        </h1>
        <p className="max-w-2xl text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.45] text-smoke">
          Clear answers about how ShopBoard handles routing, data loading, cart
          persistence, and themes.
        </p>
      </section>

      <section
        className="max-w-2xl pb-16 text-[1.0625rem] leading-[1.65]"
        aria-label="FAQ answers"
      >
        <FaqItem question="Can I place real orders or make payments?">
          <p>
            No. ShopBoard is purely an educational showcase. No financial
            transactions occur and no credit card information is collected.
          </p>
        </FaqItem>

        <FaqItem question="How does the cart work across pages and survive a refresh?">
          <p>
            The cart is managed by a top-level <InlineCode>CartProvider</InlineCode>{" "}
            that persists item identifiers and quantities to{" "}
            <InlineCode>localStorage</InlineCode>. When you reload the page or
            navigate between routes, the cart state is immediately restored.
            Multi-tab synchronization is handled via the browser&apos;s{" "}
            <InlineCode>storage</InlineCode> event.
          </p>
        </FaqItem>

        <FaqItem question="Where are the pages rendered?">
          <p>
            ShopBoard is built with the Next.js App Router. Each page is a
            Server Component: the product data is read on the server and the
            browser receives ready HTML, then only the interactive parts (the
            filters, the cart, the forms) run as JavaScript. Each route ships
            its own bundle, downloaded when you visit it.
          </p>
        </FaqItem>

        <FaqItem question="How does the product page load data by its id?">
          <p>
            The <InlineCode>/products/[id]</InlineCode> route receives the id
            from the URL, validates it, and the server looks the product up and
            renders its details along with related products in the same
            category. Every product page is prerendered at build time; an
            unknown id shows &ldquo;Product not found&rdquo;.
          </p>
        </FaqItem>

        <FaqItem question="How do themes work?">
          <p>
            You can toggle between System, Light, and Dark modes using the
            switch in the header. Your choice is stored in{" "}
            <InlineCode>localStorage</InlineCode> and applied by a small script
            before the page is drawn, to eliminate visual flashes.
          </p>
        </FaqItem>

        <p className="mt-8">
          Have more questions? Head back to the <TextLink href="/">shop</TextLink>{" "}
          or check out your <TextLink href="/cart">cart</TextLink>.
        </p>
      </section>
    </>
  );
}
