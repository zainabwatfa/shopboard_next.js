# Implementation Plan: Wishlist

**Branch**: `001-wishlist` | **Date**: 2026-11-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-wishlist/spec.md`

## Summary

Shoppers mark products with a heart button, see them on a `/wishlist` page and add them to
the cart from there. The wishlist is a new feature module, `src/features/wishlist/`, built
in the same shape as the cart: pure logic, one state module that owns a `localStorage`
key, and React glue on `useSyncExternalStore`. It stores product ids only. The page is a
Server Component that reads the products and hands them to one client view, which reuses
the existing `ProductGrid`.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19, Next.js 16 (App Router)

**Primary Dependencies**: none added. Tailwind 4 and the five `components/ui` primitives.

**Storage**: `localStorage`, key `shopboard-wishlist`, a JSON list of product ids

**Testing**: Vitest + Testing Library (unit, component), Playwright (E2E). Test files are
written by the human author; this plan lists the cases to cover.

**Target Platform**: modern browsers, phone width (320px) upward

**Project Type**: web application (one Next.js project)

**Performance Goals**: marking a product redraws only the components that read the
wishlist; no network request is made.

**Constraints**: no account, no server state, no new dependency, no edit to a copied file

**Scale/Scope**: 13 products; one new route, one new feature module, seven edited files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                             | How the plan keeps it                                                                                                                                                                                                                                                       | Result |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| I. The copied files are never edited  | All wishlist code is in new files. The wishlist's sentences go in `wishlist.messages.ts`, not in the copied `src/lib/messages.ts`; that file's `formatItemCount` and `getAddedMessage` are called, not copied.                                                              | Pass   |
| II. Strict types, no escape hatches   | Saved data is read as `unknown` and narrowed by `sanitizeWishlist`. No `any`, `as` or `!`.                                                                                                                                                                                  | Pass   |
| III. One design system                | The heart is a `Button` (`size="icon"` on a card, `size="md"` on the product page); "on the wishlist" is the existing `primary` variant, "not on it" is `secondary`. The header count is a `Badge` with the existing `pink` tint. No new token, no new variant, no `dark:`. | Pass   |
| IV. Server first, one owner per value | `app/wishlist/page.tsx` is a Server Component that reads the products. Only `wishlist.state.ts` touches the `shopboard-wishlist` key, and it saves ids only.                                                                                                                | Pass   |
| V. Accessible and honest              | The heart is a toggle button (`aria-pressed`) named after the product; its icon changes shape, not just colour. The wishlist page has a polite status line, an announcer for removals and moves focus to its heading. Empty, loading and error states each have a message.  | Pass   |
| Quality gates                         | typecheck, lint, format:check, test, build and test:e2e are run at the end (tasks T020–T021). No test file is created or edited by the AI agent; the cases are listed in tasks.md for the author.                                                                           | Pass   |

Re-checked after Phase 1 design: no change, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-wishlist/
├── spec.md              # What and why
├── plan.md              # This file
├── research.md          # Decisions and the alternatives they beat
├── data-model.md        # The saved value and its rules
├── quickstart.md        # How to check the feature by hand
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # The task list
```

There is no `contracts/` folder: the feature has no API. Its one external interface, the
saved value, is described in [data-model.md](data-model.md).

### Source Code (repository root)

```text
src/
├── app/
│   └── wishlist/
│       ├── page.tsx                 # NEW  Server Component: reads products
│       ├── loading.tsx              # NEW  "Loading your wishlist…"
│       └── error.tsx                # NEW  error + Try again
├── features/
│   ├── wishlist/                    # NEW  the feature module
│   │   ├── wishlist.logic.ts        #      pure: sanitize, toggle, pick products
│   │   ├── wishlist.messages.ts     #      pure: the sentences shown and announced
│   │   ├── wishlist.state.ts        #      owns the localStorage key
│   │   ├── hooks/
│   │   │   ├── useWishlist.ts       #      useSyncExternalStore glue + actions
│   │   │   └── useWishlistCleanup.ts#      drops products that left the catalogue
│   │   └── components/
│   │       ├── HeartIcon.tsx        #      the heart, outlined or filled
│   │       ├── WishlistButton.tsx   #      the heart toggle
│   │       └── WishlistView.tsx     #      the page's interactive part
│   └── products/components/
│       ├── ProductCard.tsx          # EDIT heart over the picture
│       ├── ProductGrid.tsx          # EDIT passes onWishlistChange through
│       ├── ProductDetail.tsx        # EDIT "Add to wishlist" under "Add to cart"
│       └── ShopView.tsx             # EDIT calls useWishlistCleanup
├── shared/components/
│   ├── MainNav.tsx                  # EDIT "Wishlist" link with a count Badge
│   └── EmptyState.tsx               # NEW  the dashed empty card, shared with the cart
├── features/cart/components/
│   └── CartView.tsx                 # EDIT uses EmptyState instead of its own copy
└── lib/
    └── siteLinks.ts                 # EDIT footer link to the wishlist
```

**Structure Decision**: one feature folder that mirrors `src/features/cart/` (types,
logic, state, hooks, components), plus one App Router segment with the same three files
the cart segment has. The product components only gain the button; they do not learn how
the wishlist is stored.

## Design

### Data flow

```text
WishlistButton ──toggle(id)──▶ useWishlist ──▶ wishlist.state.ts ──▶ localStorage
      ▲                            │                                      │
      └──── ids (snapshot) ────────┘◀──── "storage" / "pageshow" ─────────┘
MainNav (count) and WishlistView (list) read the same snapshot.
```

`useWishlist` has no provider: the store lives at module level, as `useTheme` does, so any
client component can call the hook and all of them share one snapshot. On the server and
during hydration the snapshot is an empty list (the saved value is unknowable there), so
hearts render unpressed and the count as 0, then update right after mounting. The cart
badge already behaves this way.

### The heart button

`WishlistButton` is a client component with two displays, chosen by a typed prop:
`display="icon"` (a 36px round button over the card's picture) and `display="labelled"`
(a full-width button with the words "Add to wishlist" on the product page). In both, the
accessible name is "Add to wishlist: {product name}" and `aria-pressed` carries the state,
so the name never changes and a screen reader announces "pressed" / "not pressed". The
icon is an inline SVG heart (`HeartIcon`): an outline when off, filled when on.

### The header link

Five links do not fit a phone's width in words. Below `sm` the word "Wishlist" is kept
for screen readers only and `HeartIcon` stands for it; the link's name is "Wishlist" plus
the count at every width. At 320px the list may wrap to a second row.

### The wishlist page

`WishlistView` gets the products from the server, picks the wishlisted ones (newest
first) and renders the existing `ProductGrid`, so cards look and behave exactly as in the
shop, including "Add to cart" and its toast. `ProductGrid` and `ProductCard` gain one
optional prop, `onWishlistChange`, which only this view uses: when a card's heart is
turned off it announces the removal and moves focus to the heading. A layout effect
covers the case where another tab removes the card that held focus, as the cart does.

## Complexity Tracking

No violations.

Two choices that add a little code, recorded here so they are not mistaken for accidents:

| Choice                                                 | Why                                                                                                | Simpler alternative rejected because                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `useWishlist` repeats the store glue of `CartProvider` | The cart's glue lives beside copied files and works; changing it is not part of this feature.      | A shared helper would mean rewriting working cart code to serve a second user.                  |
| `EmptyState` is extracted and `CartView` is changed    | The wishlist page needs the cart's dashed empty card; two copies of its classes would drift apart. | Copying the classes into `WishlistView` is the "class soup at the call site" CLAUDE.md forbids. |
