# Quickstart: checking the wishlist by hand

Start the site with `npm run dev` and open http://localhost:3000. Keep the browser's
Console open: it should stay free of React warnings.

## User Story 1: mark a product

1. On the shop, press the heart on "Leather Tote Bag". The heart fills in, the button
   turns pink and the header's Wishlist link shows 1.
2. Reload the page. The heart is still filled and the header still shows 1.
3. Open the product's page. Its "Add to wishlist" button is shown as pressed. Press it:
   the header count goes back to 0.

## User Story 2: the wishlist page

4. Mark two products, then press "Wishlist" in the header. Both are listed, the one marked
   last first, under the line "2 items on your wishlist".
5. Press "Add to cart" on one. The toast appears, the cart count goes up, and the product
   stays on the page.
6. Press the heart of one product. It leaves the page, the line says "1 item on your
   wishlist", and keyboard focus is on the "Your wishlist" heading. Press the other heart:
   "Your wishlist is empty." appears with a "Browse the shop" link.

## User Story 3: staying correct

7. Open the shop in a second tab. Mark a product in one tab: the other tab's heart and
   header count follow without a reload.
8. In DevTools → Application → Local Storage, set `shopboard-wishlist` to `[1, 999]` and
   reload the shop. The header shows 1, and the saved value becomes `[1]`.
9. Set `shopboard-wishlist` to `oops` and reload. The site works and the count is 0.

## Everywhere

10. Repeat steps 1 and 4 with the keyboard only (Tab, Enter or Space).
11. Switch the theme to Dark, and narrow the window to 320px: the hearts, the header link
    (a heart with the count at this width) and the wishlist page stay readable and nothing
    scrolls sideways.
