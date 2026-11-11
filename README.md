# ShopBoard (Next.js)

The Next.js version of ShopBoard, a demo shop built for a front-end course (task 3:
"ShopBoard in Next.js"). Nothing is really sold: no real orders and no real payments —
checkout is simulated (it validates a form, clears the cart and shows a confirmation).

Earlier versions: [shopboard](https://github.com/zainabwatfa/shopboard) (plain TypeScript)
and the React + Vite version this one is ported from.

Deployed on Vercel (link added after the first deploy).

## Scripts

```bash
npm run dev           # http://localhost:3000
npm run lint          # eslint
npm run build         # production build, includes type checking
npm run format        # prettier --write (the copied files are in .prettierignore)
npm run format:check  # prettier --check
npm run test          # vitest: tests/unit + tests/component (jsdom)
npm run test:watch    # vitest, rerunning on every save
npm run test:e2e      # playwright: tests/e2e (starts the dev server itself)
npm run start         # serve the production build
```

`.gitattributes` keeps every text file LF on every machine, so `format:check`
passes on a fresh Windows checkout too.

Optional: set `NEXT_PUBLIC_API_BASE_URL` (see `.env.example`) to load the products from
another server. Without it, the site reads its own `public/api/products.json`.

## Routes

| Route            | File                         | What it shows                                                        |
| ---------------- | ---------------------------- | -------------------------------------------------------------------- |
| `/`              | `app/page.tsx`               | Hero, search, category filter, sort (kept in the URL), product cards |
| `/products/[id]` | `app/products/[id]/page.tsx` | One product and related items; unknown id → "Product not found"      |
| `/cart`          | `app/cart/page.tsx`          | Cart rows (+ / − / Remove), summary, Clear cart behind the Modal     |
| `/checkout`      | `app/checkout/page.tsx`      | Simulated checkout (react-hook-form + Zod), order summary            |
| `/about`         | `app/about/page.tsx`         | About the demo                                                       |
| `/faq`           | `app/faq/page.tsx`           | Frequently asked questions                                           |
| anything else    | `app/not-found.tsx`          | 404                                                                  |

Every page is a Server Component; `loading.tsx` files show the loading lines,
`error.tsx` files show the error card with **Try again**, and `/product/:id` (the old
singular route) redirects to `/products/:id`. All 13 product pages are prerendered at
build time (`generateStaticParams`).

## How the requirements are met

- **App Router** — the `app/` folder above; the layout holds the skip link, header,
  nav, theme switch and footer.
- **Same feature modules** — `src/features/{cart,products,theme,checkout}`: the Day 3
  files (`*.types.ts`, `*.logic.ts`, `*.state.ts`, `*.api.ts`, `checkout.schema.ts`)
  are copied from the React version byte-identical. One agreed change: the API client
  reads `process.env.NEXT_PUBLIC_API_BASE_URL` instead of `import.meta.env`.
- **One shared API client** — `src/shared/api/client.ts` (`fetchJson`, `ApiError`,
  `resolveApiUrl`). On the server, `products.server.ts` imports the bundled JSON when
  no API base is set (fetch has no page to resolve a relative URL against there) and
  goes through the client when one is; validation is Day 3's `isProduct` either way.
- **Tailwind only** — `src/app/globals.css` is the only CSS file: the design tokens
  (colors, radius, fonts, sticker shadows) live in `@theme` / `@theme inline`, and the
  theme-following colors flip with `<html data-theme>`, so components never write `dark:`.
- **Dark mode** — the System / Light / Dark switch in the header; a pre-paint script in
  the layout applies the saved choice before the first paint (no flash).
- **components/ui** — Button (+ ButtonLink), Input, Card, Badge, Modal: union-typed
  variant props backed by `Record` maps, used everywhere, never copied.
- **UI rules** — in [CLAUDE.md](CLAUDE.md).

## Component tree

Who renders whom, and who owns which state. ui primitives (`Button`, `ButtonLink`,
`Input`, `Card`, `Badge`, `Modal`) appear where they are used but live in
`src/components/ui/`.

```
RootLayout (app/layout.tsx)                    theme pre-paint <script>
└─ CartProvider                                owns: cart items (useSyncExternalStore
   │                                           over cart.state.ts + localStorage)
   ├─ skip link <a>
   ├─ Header
   │  ├─ MainNav                               reads: pathname, cart count
   │  │  └─ NavLink ×4 (Cart has Badge)
   │  └─ ThemeSwitch                           owns: theme choice (useTheme →
   │                                           useSyncExternalStore over theme.state.ts)
   ├─ <main> … the page …
   └─ Footer (groups = FOOTER_GROUPS)

ShopPage (app/page.tsx, server: products + URL filters)
└─ ShopView                                    owns: filters (synced to the URL), toast
   ├─ Hero (tiles, productCount, onPick)
   ├─ Eyebrow
   ├─ ShopFilters (filters, onChange, searchRef)
   │  ├─ SearchField → Input
   │  └─ SelectField ×2
   ├─ StatusMessage (id, tone, message, action?)
   ├─ ProductGrid (products, onAdd)
   │  └─ ProductCard (product, position, onAdd) → Card, ProductImage, Button
   └─ Toast (toast, onDismiss) → ButtonLink, Button

ProductPage (app/products/[id]/page.tsx, server: product + related, notFound())
├─ ButtonLink (back to shop)
└─ ProductView (product, related)              owns: toast
   ├─ ProductDetail (product, onAdd) → Eyebrow, ProductImage, Button
   ├─ ProductGrid → ProductCard …
   └─ Toast

CartPage (app/cart/page.tsx, server: products)
└─ CartView (products)                         owns: confirm-modal open, announcer
   ├─ Eyebrow, announcer <p role=status>
   ├─ CartItemRow (line, position, onChangeQty, onRemove) ×n
   │  → Card, ProductImage, QuantityStepper (Button ×2), Button (Remove)
   ├─ CartSummary (count, total, onClear) → Card, ButtonLink ×2, Button
   └─ Modal (open, onClose, title) → Button ×2

CheckoutPage (app/checkout/page.tsx, server: products + demo notice)
└─ CheckoutView (products)                     owns: form values/errors (react-hook-form),
   │                                           confirmedOrder, orderCounter
   ├─ TextField (label, error, registration) ×7 → Input        (CheckoutFields)
   ├─ SelectInput (label, description, registration, options) ×2 (CheckoutFields)
   ├─ Card (the form), Button (submit), ButtonLink (empty state)
   ├─ CheckoutSummary (lines, count, subtotal, shippingCost, grandTotal)
   │  → Card, ProductImage
   └─ OrderConfirmation (order, headingRef) → Card, ButtonLink
      └─ ConfirmationRow (label, value) ×6

ShopView, CartView and CheckoutView all call useCartCleanup(products): once the
products are known, saved cart items whose product no longer exists are dropped.

AboutPage / FaqPage (server, static) → Eyebrow, TextLink, InlineCode, FaqItem (FAQ only)
not-found.tsx, products/[id]/not-found.tsx → Eyebrow / ButtonLink
error.tsx, cart/error.tsx → StatusMessage; loading.tsx per segment
```

## Who owns which state

| State                     | Owner                          | Saved where                                                         |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------- |
| Cart items `[{id, qty}]`  | CartProvider (store glue)      | `localStorage` `shopboard-cart` — written only by `cart.state.ts`   |
| Theme choice              | useTheme (store glue)          | `localStorage` `shopboard-theme` — written only by `theme.state.ts` |
| Shop filters (q/cat/sort) | ShopView                       | the URL query string (`history.replaceState`)                       |
| Toast message             | ShopView / ProductView         | memory (useToast)                                                   |
| Cart announcer text       | CartView                       | memory (useAnnouncer)                                               |
| Clear-cart modal open     | CartView                       | memory                                                              |
| Form values and errors    | CheckoutView (react-hook-form) | memory                                                              |
| Confirmed order           | CheckoutView                   | memory                                                              |

Prices always come from the product data; the saved cart holds only ids and quantities.

## Pictures

Product pictures are from Pexels under Creative Commons; credits are in the first
repo's [CREDITS.md](https://github.com/zainabwatfa/shopboard_react/blob/main/CREDITS.md).
