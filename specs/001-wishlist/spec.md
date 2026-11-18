# Feature Specification: Wishlist

**Feature Branch**: `001-wishlist`

**Created**: 2026-11-18

**Status**: Implemented

**Input**: User description: "A wishlist: a shopper can mark products they like while
browsing, see them later on one page, and add them to the cart from there. It works like
the cart: no account, kept on the device."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Mark a product for later (Priority: P1)

A shopper browsing the shop sees a product they like but are not ready to buy. They press
a heart button on the product and it is added to their wishlist. Pressing it again takes
the product off the wishlist. The heart shows which products are already on the wishlist,
and the choice is still there after closing the browser and coming back.

**Why this priority**: Without marking there is nothing to list. On its own it already
gives value: the shopper can see at a glance which products they liked.

**Independent Test**: Press the heart on a product card, reload the page, and check that
the same heart is still shown as pressed.

**Acceptance Scenarios**:

1. **Given** a product that is not on the wishlist, **When** the shopper presses its heart
   button, **Then** the button shows as pressed and the wishlist count in the header goes
   up by one.
2. **Given** a product that is on the wishlist, **When** the shopper presses its heart
   button again, **Then** the button shows as not pressed and the count goes down by one.
3. **Given** a product on the wishlist, **When** the shopper reloads the page or returns
   another day on the same device, **Then** the product is still on the wishlist.
4. **Given** the product page of one product, **When** the shopper presses "Add to
   wishlist", **Then** the result is the same as pressing the heart on its card.
5. **Given** a screen reader user on a heart button, **When** they press it, **Then** they
   hear the product's name and whether the button is now pressed.

---

### User Story 2 - See the wishlist and buy from it (Priority: P2)

The shopper opens the wishlist from the header and sees every product they marked, most
recently added first, with its picture, name and price. From there they can add a product
to the cart, open its page, or take it off the wishlist.

**Why this priority**: This is what makes marking useful: one place to come back to.

**Independent Test**: Mark two products, open the wishlist page, and check that both are
listed, that "Add to cart" works, and that taking one off leaves the other.

**Acceptance Scenarios**:

1. **Given** two products on the wishlist, **When** the shopper opens the wishlist page,
   **Then** both are shown with the one added last first, and a line says how many items
   the wishlist holds.
2. **Given** an empty wishlist, **When** the shopper opens the wishlist page, **Then** it
   says "Your wishlist is empty." and offers a link to the shop.
3. **Given** a product on the wishlist page, **When** the shopper presses "Add to cart",
   **Then** it is added to the cart, the usual confirmation appears, and the product
   stays on the wishlist.
4. **Given** a product on the wishlist page, **When** the shopper presses its heart
   button, **Then** the product leaves the page, screen reader users hear which product
   was removed and how many are left, and keyboard focus moves to the page heading.
5. **Given** any page of the site, **When** the shopper looks at the header, **Then** a
   "Wishlist" link shows the number of items on the wishlist.

---

### User Story 3 - The wishlist stays correct (Priority: P3)

The wishlist keeps telling the truth when things change around it: the shopper has the
shop open in two tabs, a product is no longer in the catalogue, or the saved data is
damaged.

**Why this priority**: These cases are rare, but a wishlist that shows a wrong count or
breaks the page would lose the shopper's trust in the whole shop.

**Independent Test**: Open the shop in two tabs, mark a product in one, and check that the
other tab's heart and header count follow without a reload.

**Acceptance Scenarios**:

1. **Given** the shop open in two tabs, **When** the shopper marks a product in one tab,
   **Then** the other tab shows the same heart state and count without a reload.
2. **Given** a wishlist that holds a product which is no longer in the catalogue, **When**
   the shopper opens the shop or the wishlist page, **Then** that product is dropped and
   the count matches what is shown.
3. **Given** saved wishlist data that is damaged or not a list, **When** any page loads,
   **Then** the page works normally and the wishlist is treated as empty.

---

### Edge Cases

- The browser refuses to save (storage blocked or full): the wishlist still works until
  the page is closed, and nothing crashes.
- The same product is saved twice in the stored data: it is counted and shown once.
- The products cannot be loaded on the wishlist page: an error with "Try again" is shown,
  and it says that the saved items are still there.
- The shopper takes the last product off the wishlist page: the empty message appears.
- A product is both in the cart and on the wishlist: the two are independent; adding to
  the cart does not take it off the wishlist.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Shoppers MUST be able to add a product to the wishlist and take it off again
  with one control, from every product card and from the product page.
- **FR-002**: That control MUST show whether the product is on the wishlist, by shape as
  well as colour, and MUST tell assistive technology its state and the product's name.
- **FR-003**: The wishlist MUST be kept on the shopper's device without an account, and
  MUST still be there after a reload and after the browser is closed.
- **FR-004**: The wishlist MUST store only which products are on it. Names, pictures and
  prices MUST always come from the current product catalogue.
- **FR-005**: The header MUST show a link to the wishlist with the number of items on it,
  on every page.
- **FR-006**: The wishlist page MUST list the wishlist's products, most recently added
  first, each with its picture, category, name and price, a link to its product page, an
  "Add to cart" control and the wishlist control.
- **FR-007**: The wishlist page MUST state how many items it holds, and MUST show "Your
  wishlist is empty." with a link to the shop when it holds none.
- **FR-008**: Adding a product to the cart from the wishlist page MUST behave exactly like
  adding it from the shop, and MUST leave it on the wishlist.
- **FR-009**: When a product is taken off on the wishlist page, the page MUST announce the
  removal and the remaining count to screen reader users and MUST move keyboard focus to
  the page heading.
- **FR-010**: A change to the wishlist in one browser tab MUST appear in the site's other
  open tabs without a reload.
- **FR-011**: Products that are no longer in the catalogue MUST be dropped from the
  wishlist once the catalogue is known.
- **FR-012**: Damaged or unexpected saved data MUST never break a page; entries that are
  not valid MUST be ignored and duplicates counted once.
- **FR-013**: When the wishlist page cannot load the products, it MUST show an error with
  a retry control and say that the saved items are kept.

### Key Entities

- **Wishlist**: the ordered set of products one shopper marked on one device. Each product
  appears at most once; the order is the order of adding.
- **Product**: the existing catalogue item (name, category, price, picture). The wishlist
  refers to products and never copies their details.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A shopper can put a product on the wishlist with one press, from the shop or
  the product page, without leaving the page they are on.
- **SC-002**: A shopper can go from any page to their wishlist in one press, and from a
  wishlisted product to having it in the cart in one more.
- **SC-003**: After a reload, 100% of the wishlisted products are still shown as
  wishlisted.
- **SC-004**: The header count, the pressed hearts and the wishlist page agree on every
  page and in every open tab.
- **SC-005**: Every wishlist action can be done with the keyboard alone, and every result
  is conveyed to a screen reader.
- **SC-006**: The shop, product and wishlist pages keep working at phone width (320px) and
  in both themes with the new controls in place.

## Assumptions

- The wishlist is per device and per browser, like the cart. Accounts, sharing a wishlist
  and syncing between devices are out of scope.
- There is no limit on the number of wishlisted products; the catalogue itself is small.
- Taking a product off the wishlist needs no confirmation: it is one item, and pressing
  the heart again puts it back. (Clearing the whole cart keeps its confirmation.)
- There is no "clear wishlist" and no "move to cart" control; "Add to cart" plus the heart
  cover both.
- Marking a product gives no toast: the button's own pressed state and the header count
  are the feedback, so a shopper marking several products in a row is not interrupted.
- The site stays a course demo: nothing is sent to a server.
