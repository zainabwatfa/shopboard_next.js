# Research: Wishlist

The decisions behind [plan.md](plan.md). Nothing here needed outside research: every
question was answered by how the existing cart and theme features already work.

## 1. Where the wishlist is kept

**Decision**: `localStorage`, under its own key `shopboard-wishlist`.

**Rationale**: The spec asks for "no account, kept on the device", which is exactly what
the cart does. A separate key means a damaged wishlist can never damage the cart.

**Alternatives considered**: A cookie (would let the server render pressed hearts, but
sends the list with every request and makes every page dynamic). One shared key for cart
and wishlist (would mean editing the copied `cart.state.ts`).

## 2. What is saved

**Decision**: a JSON list of product ids, in the order they were added, e.g. `[3, 11]`.

**Rationale**: The constitution says a saved value holds the least it can and product data
comes from the catalogue. A wishlist entry has no quantity, so the id alone is the whole
entry. Keeping the order in the list gives "most recently added first" for free.

**Alternatives considered**: `[{ id, addedAt }]` (a date nobody is shown). A set stored as
an object `{ "3": true }` (loses the order).

## 3. How React reads it

**Decision**: a `useWishlist` hook on `useSyncExternalStore`, with the store at module
level and no context provider.

**Rationale**: The wishlist lives outside React, so `useSyncExternalStore` is the tool
React provides for it; it also handles the server snapshot. `useTheme` already uses this
provider-less form. No provider means no change to `app/layout.tsx`.

**Alternatives considered**: A `WishlistProvider` like `CartProvider` (one more wrapper in
the layout for no gain: the store is already shared at module level). `useState` plus an
effect that reads storage (a visible second render and a state copy per component).

## 4. How the heart says its state

**Decision**: one toggle button with a fixed name, "Add to wishlist: {name}", and
`aria-pressed`. The icon switches between an outlined and a filled heart, and the button
between the `secondary` and `primary` variants.

**Rationale**: A fixed name with `aria-pressed` is the standard toggle pattern: screen
readers announce the new state by themselves, and voice-control users can always say the
same words. The shape change means colour is not the only signal.

**Alternatives considered**: Swapping the label between "Add to wishlist" and "Remove from
wishlist" (the change of name on a focused button is not announced reliably). A toast on
every press (interrupts someone marking several products; the cart toast exists because
"Add to cart" changes nothing visible on the button itself).

## 5. Where the heart goes on a card

**Decision**: over the top-right corner of the product picture, as a 36px icon button.

**Rationale**: At phone width a card can be 152px wide; a second button beside "Add to
cart" does not fit there without wrapping the label. The picture's corner is free space
and the usual place for this control. 36px is above the 24px minimum target size.

**Alternatives considered**: A row with "Add to cart" (does not fit). A text link under
the price (makes every card taller).

## 6. Reusing the product grid

**Decision**: the wishlist page renders the existing `ProductGrid`; `ProductGrid` and
`ProductCard` get one optional `onWishlistChange` prop.

**Rationale**: Wishlisted products should look and behave like products everywhere else,
and one optional prop is less code than a second kind of card.

**Alternatives considered**: A separate list row like the cart's (a second layout to keep
in step). Letting `WishlistView` work out removals by comparing lists between renders
(cannot tell "the shopper removed it here", which needs focus moved and an announcement,
from "another tab removed it").

## 7. Cleaning out products that no longer exist

**Decision**: a `useWishlistCleanup(products)` hook, called by the shop and the wishlist
page, the two places that have the full product list and show wishlist state.

**Rationale**: Same reasoning as `useCartCleanup`: bringing saved data in line with the
catalogue is a side effect on an external system, which is what an effect is for.

**Alternatives considered**: Filtering only at display time (the header count would
include products that can never be shown).
