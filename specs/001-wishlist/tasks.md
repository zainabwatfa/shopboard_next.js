# Tasks: Wishlist

**Input**: Design documents from `/specs/001-wishlist/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md)

**Tests**: The constitution keeps test files in the author's hands, so the test tasks
below (marked 🧑) are for the human author and are not done by the AI agent. Each one
names the cases to cover.

**Organization**: Tasks are grouped by user story so each story can be built and checked
on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Spec Kit and the feature folder

- [x] T001 Initialise Spec Kit (`.specify/`, `.claude/skills/`) and keep its files out of Prettier in `.prettierignore`
- [x] T002 Write the constitution from CLAUDE.md in `.specify/memory/constitution.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The wishlist module every story reads from

- [x] T003 [P] Draw the heart (outlined or filled) in `src/features/wishlist/components/HeartIcon.tsx`
- [x] T004 [P] Write the pure functions `sanitizeWishlist`, `isOnWishlist`, `toggleWishlistId` and `getWishlistProducts` in `src/features/wishlist/wishlist.logic.ts`
- [x] T005 Write the state module (load, save, reload, `getWishlist`, `toggleWishlist`, `keepOnlyWishlist`) that owns the `shopboard-wishlist` key in `src/features/wishlist/wishlist.state.ts` (depends on T004)
- [x] T006 Write the `useWishlist` hook on `useSyncExternalStore`, with "storage" and "pageshow" listeners and an empty server snapshot, in `src/features/wishlist/hooks/useWishlist.ts` (depends on T005)

**Checkpoint**: any client component can read and change the wishlist

---

## Phase 3: User Story 1 - Mark a product for later (Priority: P1) 🎯 MVP

**Goal**: A heart on every product card and on the product page; the choice survives a reload.

**Independent Test**: Press the heart on a card, reload, and the heart is still pressed.

### Tests for User Story 1 🧑

- [ ] T007 [P] [US1] 🧑 Unit tests for `wishlist.logic.ts` in `tests/unit/wishlist.test.ts`: `sanitizeWishlist` returns `[]` for `null`, text and an object; drops non-integers; keeps the first of a repeated id; `toggleWishlistId` adds at the end and removes; `getWishlistProducts` returns newest first and skips unknown ids
- [ ] T008 [P] [US1] 🧑 Component test for `WishlistButton` in `tests/component/wishlist-button.test.tsx`: the name is "Add to wishlist: {name}"; `aria-pressed` goes false → true → false on two clicks

### Implementation for User Story 1

- [x] T009 [US1] Build `WishlistButton` (toggle with `aria-pressed`, outlined/filled heart, `display` "icon" or "labelled") in `src/features/wishlist/components/WishlistButton.tsx`
- [x] T010 [P] [US1] Put the icon button over the picture in `src/features/products/components/ProductCard.tsx`
- [x] T011 [P] [US1] Put the labelled button under "Add to cart" in `src/features/products/components/ProductDetail.tsx`

**Checkpoint**: products can be marked and unmarked from the shop and the product page

---

## Phase 4: User Story 2 - See the wishlist and buy from it (Priority: P2)

**Goal**: A `/wishlist` page listing the marked products, reachable from the header.

**Independent Test**: Mark two products, open `/wishlist`, add one to the cart, take the other off.

### Tests for User Story 2 🧑

- [ ] T012 [US2] 🧑 E2E journey in `tests/e2e/wishlist.spec.ts`: mark two products on the shop, the header link shows 2, the wishlist page lists both, "Add to cart" raises the cart count, turning a heart off leaves one card and moves focus to the heading; an empty wishlist shows "Your wishlist is empty."

### Implementation for User Story 2

- [x] T013 [P] [US2] Write the sentences (`getWishlistStatus`, `describeWishlistChange`, `withWishlistKept`) in `src/features/wishlist/wishlist.messages.ts`
- [x] T014 [P] [US2] Extract the dashed empty card into `src/shared/components/EmptyState.tsx` and use it in `src/features/cart/components/CartView.tsx`
- [x] T015 [US2] Pass an optional `onWishlistChange` through `src/features/products/components/ProductGrid.tsx` and `ProductCard.tsx` to the button
- [x] T016 [US2] Build `WishlistView` (status line, grid, add-to-cart toast, removal announcement, focus to the heading, empty state) in `src/features/wishlist/components/WishlistView.tsx` (depends on T013–T015)
- [x] T017 [US2] Add the route: `src/app/wishlist/page.tsx` (Server Component), `loading.tsx` and `error.tsx`
- [x] T018 [US2] Add the "Wishlist" link with its count `Badge` to `src/shared/components/MainNav.tsx` (a heart stands for the word below `sm`, and the list may wrap at 320px) and a footer link in `src/lib/siteLinks.ts`

**Checkpoint**: the wishlist can be opened, bought from and emptied

---

## Phase 5: User Story 3 - The wishlist stays correct (Priority: P3)

**Goal**: Two tabs agree, and products that left the catalogue disappear from the wishlist.

**Independent Test**: With two tabs open, mark a product in one; the other follows without a reload.

- [x] T019 [US3] Write `useWishlistCleanup` in `src/features/wishlist/hooks/useWishlistCleanup.ts` and call it from `WishlistView.tsx` and `src/features/products/components/ShopView.tsx`

Tab syncing and damaged data are already covered by T004–T006; this phase checks them by
hand with [quickstart.md](quickstart.md), steps 7 to 9.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T020 Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test`, `npm run build` and `npm run test:e2e`
- [x] T021 Walk through [quickstart.md](quickstart.md) in a browser: both themes, 320px width, keyboard only, no console warnings
- [x] T022 [P] Document the feature: route and state tables in `README.md`, the wishlist owner rule in `CLAUDE.md`

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6**, in that order.
- Phase 2 blocks every story: all of them read the wishlist through `useWishlist`.
- US2 needs the heart from US1 (the wishlist page is empty without a way to mark).
- US3 needs the page from US2 for the cleanup to have something to show.
- Inside a phase, tasks marked [P] touch different files and can be done in any order.

## Implementation Strategy

Stop after Phase 3 for the smallest useful version: hearts that remember. Phase 4 adds the
page that makes them worth pressing, and Phase 5 makes the result hold up in everyday use.
