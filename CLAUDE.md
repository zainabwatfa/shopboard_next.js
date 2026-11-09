# ShopBoard (Next.js)

The Next.js version of ShopBoard, a demo shop built for a course (task 3: "ShopBoard in Next.js").
Nothing is really sold: no real orders and no real payments. The earlier versions are
[zainabwatfa/shopboard](https://github.com/zainabwatfa/shopboard) (plain TypeScript) and
`../shopboard_react` (React + Vite), which stays on disk read-only as the copy source.

Task requirements: App Router; same feature modules; one shared API client; list, `[id]`,
`loading`, `not-found` routes; Tailwind only (no CSS files but `globals.css`); fully
responsive; dark mode; `components/ui` (Button, Input, Card, Badge, Modal) with variants
and typed props, used everywhere and never copied; tokens in `@theme`; deployed on Vercel.

## UI rules

1. **Tailwind only.** `src/app/globals.css` is the only CSS file. No new `.css` files, no
   `style={{ … }}` objects. A CSS variable on an element is set with a Tailwind arbitrary
   property (`[--st-tint:var(--color-st-lav)]`), not inline style.
2. **Tokens, never raw values.** Colours, radii, fonts and shadows come from the tokens in
   `globals.css` (`bg-surface`, `text-ink`, `border-line`, `rounded-st-sm`, `shadow-st-md`,
   `font-poster`, …). No hex colours, no `rounded-[28px]`, no font names in components.
   Theme-following colours live in `@theme inline` and flip with `data-theme` on their own:
   components never write `dark:`.
3. **The five primitives are the only way to draw their thing.** A button is `<Button>` or
   `<ButtonLink>`, a field is `<Input>`, a sticker card is `<Card>`, a count sticker is
   `<Badge>`, a dialog is `<Modal>` (`src/components/ui/`). Never copy their classes into a
   page; a new look is a new variant on the component.
4. **Variants are typed props** (`variant="secondary"`, `tint="pink"`, `size="sm"`), defined
   as union types and `Record` maps — not boolean props, not free-form class soup at the
   call site. `className` on a primitive is for layout (margins, width, grid placement),
   never to restyle it.
5. **Sticker pairs.** A card's tint decides its shade: `--st-tint` fills, `--st-shade` is
   only used for the flat offset shadow. Text on a tint fill is always `text-on-fill`, in
   both themes.
6. **Server Components by default.** `"use client"` only where there is state, effects or a
   browser API (cart, theme, forms, modal). Products are read on the server.

## Rules carried over from the React version

1. **Day 3 files are copied, not edited.** The `*.types.ts`, `*.logic.ts`, `*.state.ts` and
   `*.api.ts` files in `src/features/*/`, and the shared API client, come from the first
   repo unchanged (only `import type` is allowed). React/Next code calls them; it never
   copies their logic.
2. **No `any`, no `as` (not even `as const`), no non-null `!`.** Check with `instanceof`,
   `typeof` or a type guard instead.
3. **List keys come from the data** (`product.id`, `option.value`), never the array index.
4. **Every state shows the right message**: loading, error with retry, "No products are
   available right now.", "No products match your search." with Clear filters, the empty
   cart with a link to the shop, "Product not found".
5. **No React warnings in the Console.** Check in the browser after a change.
6. Only the cart state module writes the cart (localStorage, `[{ id, qty }]`); prices always
   come from the product data. Only the theme state module saves the theme choice.
7. Keep the accessibility the first site had: labelled controls, polite live regions for
   status lines and the toast, a confirm (the Modal) before Clear cart, focus management
   when a cart row disappears, visually hidden "Quantity" text.
8. Content stays true: it is a demo for a course. No invented company, address, people or
   policies.

## Scripts

`npm run dev` (http://localhost:3000), `npm run lint`, `npm run build` (includes type
checking). Run lint and build after every change.
