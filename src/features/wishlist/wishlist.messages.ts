// The sentences the wishlist shows or announces, built from data. Pure
// functions: everything comes in as arguments, a string goes out.
import { formatItemCount } from "../../lib/messages.ts";

// The line above the wishlist's cards: "1 item on your wishlist"
export function getWishlistStatus(count: number): string {
  return `${formatItemCount(count)} on your wishlist`;
}

// Said to screen reader users when a card leaves the wishlist page (they
// don't see it go). left is how many products are still on the wishlist.
export function describeWishlistRemoval(name: string, left: number): string {
  const rest =
    left === 0 ? "Your wishlist is empty." : `${formatItemCount(left)} left.`;
  return `${name} removed from your wishlist. ${rest}`;
}

// Wishlist page, when the products didn't load: the cards can't be shown, but
// the ids are still saved and the header still counts them. Saying so keeps
// the message and the count telling the same story.
export function withWishlistKept(message: string, count: number): string {
  if (count <= 0) return message;
  const items = count === 1 ? "1 item is" : `${count} items are`;
  return `${message} Your ${items} still on your wishlist.`;
}
