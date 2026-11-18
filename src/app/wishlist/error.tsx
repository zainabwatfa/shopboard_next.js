"use client";

import { StatusMessage } from "@/shared/components/StatusMessage";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist.ts";
import { withWishlistKept } from "@/features/wishlist/wishlist.messages.ts";
import { getLoadErrorMessage } from "@/lib/messages.ts";

export interface WishlistErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// The wishlist page threw (the products could not be read): the cards can't
// be shown, but the saved ids are untouched and the header still counts them
// — the message says so, so both tell the same story.
export default function WishlistError({ error, reset }: WishlistErrorProps) {
  const { count } = useWishlist();
  return (
    <div className="pt-10">
      <StatusMessage
        id="wishlist-error"
        tone="error"
        message={withWishlistKept(getLoadErrorMessage(error), count)}
        action={{ label: "Try again", onClick: reset }}
      />
    </div>
  );
}
