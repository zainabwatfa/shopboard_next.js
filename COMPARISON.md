# ShopBoard: my project compared with the reference

Reference: [yaman3bd/shopboard-reference](https://github.com/yaman3bd/shopboard-reference)
(commit `e2693e7`). Mine: this repository.

## How I compared

I ran the reference before reading it: `npm install`, `npm run dev`, every page, then the
API switches from its README.

| What I tried                                           | What happened                                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Home, `/products`, a filtered URL, a product, the cart | All render. Filters, search and sort are in the URL.                                                |
| `/products/999` and `/nope`                            | "This product doesn't exist" and "Page not found", each with a link back.                           |
| Checkout: empty submit, then the demo card             | Nine clear messages ("Enter your city."), then a success page with the total the API charged.       |
| A review containing "spam"                             | Shown at once as "Posting…", removed when the API refused it, and my text was put back in the form. |
| `/api/delay/3000`                                      | Every page waited for the API before its content appeared.                                          |
| `/api/fail/500`                                        | Every page showed its own error card with "Try again"; the navbar stayed.                           |
| `/api/empty`                                           | `/products` showed "0 products" and "No products match … Clear filters".                            |
| Dark mode at 320px                                     | Nothing scrolls sideways.                                                                           |

Then I read it in the README's order: the docs, `package.json`, the structure, the cart
from button to store, the review form to the API and back, and `git log`.

## 1. Structure

**What I did.** `src/app` for routes, `src/features/<name>` for cart, products, theme,
checkout and wishlist, `src/components/ui` for the five primitives, `src/shared` for the
API client and shared components, `src/lib` for helpers. Files carry the feature's name
(`cart.logic.ts`, `cart.state.ts`), because they were copied unchanged from my first
ShopBoard.

**What the reference does.** `app/` holds thin routes only, `modules/<name>` holds one
feature each, and files are named for their job (`types.ts`, `store.ts`, `api.ts`).
Its CLAUDE.md states which folder may import which: `components/ui` never imports a
module, `app/api` never imports a module, and module imports go one way.

**What I will take, and why.** The written import rules. My features import each other
freely (products → cart, products → wishlist, wishlist → products), and nothing says which
direction is allowed, so the next feature could create a cycle without anyone noticing. I
will keep my file names: renaming would break the "copied, not edited" rule my project is
built on.

## 2. API client

**What I did.** One client, `fetchJson<T>()`, with an `ApiError` that keeps the status,
the URL and the cause, and a separate error for a body that is not JSON. On the server,
the products come from an imported JSON file unless `NEXT_PUBLIC_API_BASE_URL` is set. It
only ever does GET: my checkout sends nothing.

**What the reference does.** One client, `api<T>()`, with GET, POST and DELETE, an error
message read from the response body, and its own API in `app/api` that the app talks to
over HTTP. The API has demo switches (`delay`, `fail`, `empty`) in the URL, and
`modules/products/api.ts` is marked `server-only`.

**What I will take, and why.** The demo switches, first of everything in this document. I
cannot see my own loading and error states without breaking my code on purpose, which
means I have not really tested them. I will also take a real API route, so the server and
the browser read products the same way instead of my two paths (import on the server,
HTTP in the browser).

## 3. Types and schemas

**What I did.** Plain types per feature, and hand-written type guards for everything that
comes from outside: `isProduct` for the API, `sanitizeCart` and `sanitizeWishlist` for
`localStorage`, `parseProductId` and `parseFilters` for the URL. Zod only for the checkout
form. Prices are decimal numbers (`89.00`).

**What the reference does.** Plain types for API data and no check on what the API
returns: `const data: T = JSON.parse(text)`. Zod for the forms, and Zod again inside the
API for what the browser sends. Prices are integers in cents.

**What I will take, and why.** Integer cents in my next project: adding decimals is where
money bugs start, and I cannot change it here without editing the copied data. I will also
take validating on the server side what the browser sends, once I have an API that
receives something.

## 4. State

**What I did.** Each saved value has one hand-written state module, read in React with
`useSyncExternalStore`. Tabs stay in step through the `storage` event, a page restored by
Back/Forward re-reads its data, a failed save keeps the newer copy in memory, and saved
ids whose product is gone are removed. Filters are client state mirrored into the URL.

**What the reference does.** A Zustand store with `persist`, `partialize` and a `version`,
selectors so a button does not re-render when the cart changes, and `useHydrated()` with a
`Skeleton` wherever the cart is shown. Filters live only in the URL and are applied on the
server. Reviews use `useOptimistic` with a pure reducer.

**What I will take, and why.** `useHydrated`. My cart page says "Your cart is empty." for
a moment before the saved cart is read, and the header count shows 0 first; the
reference's CLAUDE.md lists exactly this as a mistake they fixed. I already did it right on
the wishlist page (`ready`) but not on the cart. I will also take the `version` idea: if I
change the shape of what I save, I have no plan for old data. I want to learn
`useOptimistic`, but I have no server-owned data to use it on yet.

## 5. Forms

**What I did.** react-hook-form with one Zod schema, nine fields, a simulated order, and a
confirmation that takes keyboard focus. No card fields, on purpose: the shop is a demo.

**What the reference does.** The same libraries, with fields grouped in `fieldset`s with
legends, `autoComplete` and `inputMode` on every input, messages that say what to do
("Enter your city."), a submit button that shows "Placing your order…", and an API that
works out the total itself and can answer "sold out".

**What I will take, and why.** `autoComplete` on every field and `fieldset` + `legend`
groups: my form has neither, so a browser cannot fill in an address and a screen reader
user hears nine fields with no grouping. And the message style: "City name must be at
least 2 characters" describes my rule, "Enter your city." tells the person what to do.

## 6. Loading, error, not-found

**What I did.** `loading.tsx` at the root and for cart, checkout and wishlist (a line of
text with `role="status"`), `error.tsx` at the root and for cart and wishlist, a root
`not-found.tsx` and one for products. All 13 product pages are prerendered. My error pages
call `reset()`.

**What the reference does.** Every route that fetches has its own `loading.tsx` built from
`Skeleton`s shaped like the page, and its own `error.tsx` through one shared
`ErrorMessage`. The product page uses parallel routes, so reviews and related products
load and fail on their own. Its error pages call `retry()`.

**What I will take, and why.** `retry()` instead of `reset()`. The Next.js 16 docs say
`retry()` fetches again, while `reset()` only re-renders, so my "Try again" may show the
same failure. This is a real bug risk I found only by comparing. I will also take
skeletons shaped like the content, which stop the page from jumping when the data arrives.

## 7. UI kit and tokens

**What I did.** Five primitives I wrote myself (Button, Input, Card, Badge, Modal) with
union-typed variants, no UI library, and my own "sticker" design. Tokens are in `@theme`,
the theme flips through `data-theme`, and no component writes `dark:`. A small script
applies the saved theme before the first paint.

**What the reference does.** shadcn/ui on Base UI with `cva` and `tailwind-merge`, 16
components, `next-themes`, and a design taken from an analysis of another company's site.
Its rule "no arbitrary values" holds everywhere outside `components/ui`.

**What I will take, and why.** The "no arbitrary values" discipline. I counted 102
arbitrary values in my components (`text-[0.8125rem]`, `px-[0.4375rem]`,
`text-[clamp(…)]`): the same sizes are typed again and again instead of being tokens, so
my rule "tokens, never raw values" is only true for colours. I will move the repeated ones
(the mono status text, the heading clamps) into `@theme`. I will not take shadcn: writing
the primitives taught me how variants and focus styles work.

## 8. Tooling

**What I did.** ESLint with the Next.js defaults, Prettier, `typecheck`, 9 Vitest tests, 4
Playwright tests, and GitHub Actions running all of it on every push. `.gitattributes`
keeps line endings the same on every machine.

**What the reference does.** ESLint rules that fail on `any`, `as` and `!`, a pre-commit
hook (husky + lint-staged), and `prettier-plugin-tailwindcss` to sort classes. No tests
and no CI.

**What I will take, and why.** The three ESLint rules. My CLAUDE.md forbids `any`, `as`
and `!`, but nothing checks it: the rule holds only as long as everyone remembers it. A
rule a tool enforces is worth more than a rule in a document. The pre-commit hook comes
second, since my CI already catches the same things a little later.

## 9. CLAUDE.md

**What I did.** UI rules, the rules carried over from the React version, the scripts, and
the Spec Kit workflow with a constitution that restates the rules.

**What the reference does.** The stack, the structure with import rules, data rules, an
"Adding a module" recipe, and a section called "Rules from mistakes we fixed", where each
rule comes with the bug that caused it.

**What I will take, and why.** "Rules from mistakes we fixed". My rules say what to do but
not what went wrong without them, and a rule with its reason is easier to follow and
harder to delete by accident. I have material already: the typecheck that failed in CI on
a fresh checkout, and the header that overflowed at 320px.

## What I did better

- **Tests and CI.** The reference has none and lists tests under "ideas to build next".
  Mine has unit, component and end-to-end tests, and CI that runs them on every push.
- **Data from outside is checked.** The reference trusts its API (`JSON.parse` straight
  into `T`) and whatever is in `localStorage`. Mine checks both, so a damaged saved cart
  or a wrong API answer cannot break a page.
- **The empty state tells the truth.** With `/api/empty`, the reference's `/products` says
  "No products match … Clear filters" although no filter is set. Mine separates "No
  products are available right now." from "No products match your search."
- **Two tabs agree.** My cart, wishlist and theme follow a change made in another tab. The
  reference has no `storage` listener, so two tabs can show different carts.
- **Accessibility details.** Mine has a skip link, and moves keyboard focus to the heading
  when the row holding it disappears. The reference has no skip link, and its code never
  moves focus: when a cart line is removed, the button that had focus is gone and nothing
  takes its place. Its error pages also have no `h1`, although its own rule says one per
  page. (It does announce changes: the quantity is a live region and its toasts are read
  out.)
- **The reference breaks its own import rule.** Its CLAUDE.md says "products knows nothing
  about the cart", but `modules/products/components/product-card.tsx` imports the cart's
  `AddToCartButton`.
- **Theming.** Mine needs no `dark:` class anywhere and no theme library.
- **Search.** Mine matches several words in any order and singular with plural ("bags"
  finds "Bag"); the reference matches one substring.
- **Spec-driven feature.** The wishlist has a spec, a plan and a task list in `specs/`.
- **An honest design.** My look is my own; the reference's DESIGN.md describes another
  company's brand.

## My grade: 7.5 / 10

**What earns it.** The things a reviewer cannot see in a screenshot are solid: every
outside value is validated, state has one owner each, the rules are written down, and
tests and CI prove the main journey works. In several places my project is more careful
than the reference.

**What costs it.**

- It is not deployed. There is no live link and no Lighthouse score, and both were asked
  for.
- It never writes to a server. There is no POST, no optimistic update and no real API, so
  a whole part of what the reference teaches is missing from my project.
- Some of my rules are not enforced or not fully true: `any`/`as`/`!` are not checked by
  ESLint, and "tokens, never raw values" has 102 exceptions.
- Known defects: the cart flashes "empty" before it loads, "Try again" uses `reset()`,
  the checkout form has no `autoComplete` or field groups, and the dev console shows a
  Next.js error on product pages, against my own "no warnings" rule.
- The wishlist has no tests yet.

**What I will do first.** The API route with demo switches, `retry()`, `useHydrated` on
the cart, and the three ESLint rules: four changes that fix real weaknesses rather than
add features.
