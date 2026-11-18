# Data Model: Wishlist

## The saved value

| Where          | Key                  | Shape                    | Example   |
| -------------- | -------------------- | ------------------------ | --------- |
| `localStorage` | `shopboard-wishlist` | JSON list of product ids | `[3, 11]` |

Only `src/features/wishlist/wishlist.state.ts` reads or writes this key.

### Rules

- An entry is a whole number (`Number.isInteger`). Anything else is ignored on load.
- A product id appears at most once. If the stored list repeats an id, the first
  occurrence is kept.
- The order is the order of adding: a newly added id goes to the end. The wishlist page
  shows the list reversed (newest first).
- Nothing saved, text that is not JSON, or JSON that is not a list all mean an empty
  wishlist.
- An id with no matching product is skipped when the list is shown, and removed from the
  saved value by the cleanup once the catalogue is known.

### State changes

| Action               | Before    | After        |
| -------------------- | --------- | ------------ |
| toggle 5 (not saved) | `[3, 11]` | `[3, 11, 5]` |
| toggle 3 (saved)     | `[3, 11]` | `[11]`       |
| keep only `[11, 12]` | `[3, 11]` | `[11]`       |

Every change first re-reads the saved value, so a change made in another tab is built on
rather than overwritten. If a save fails (storage blocked or full), the copy in memory is
kept and used until the page is closed.

## In the program

| Name         | Type                               | Meaning                                    |
| ------------ | ---------------------------------- | ------------------------------------------ |
| wishlist ids | `readonly number[]`                | The saved value, validated                 |
| `Product`    | existing, from `products.types.ts` | Where names, prices and pictures come from |

There is no stored "wishlist item" object: an entry carries nothing but its id.
