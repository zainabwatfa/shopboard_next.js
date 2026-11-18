# ShopBoard design

How ShopBoard looks and why. The rules for writing the code are in
[CLAUDE.md](CLAUDE.md); the values themselves live in
[src/app/globals.css](src/app/globals.css), which is the source of truth. If this file
and `globals.css` disagree, `globals.css` is right and this file needs an update.

## The look: stickers on paper

Every surface is drawn like a sticker stuck on a sheet of paper:

- a **2px ink outline** (`border-2 border-line`),
- a **flat offset shadow with no blur** (`shadow-st-md`: 5px right, 5px down),
- a **pastel fill** paired with a darker shade of the same colour for the shadow,
- **rounded corners**, large on cards and fully round on buttons and badges,
- **poster headings** in a serif face over plain sans body text.

Nothing is glossy: no gradients, no blurred shadows, no transparency effects.

## Colour

### Sticker pairs

Four pairs. The tint fills, the shade is only ever the shadow under it. They are the
same in both themes, and text on a tint is always `text-on-fill` (ink), in both themes.

| Pair     | Tint (`bg-st-*`) | Shade (`*-shade`) | Used for                       |
| -------- | ---------------- | ----------------- | ------------------------------ |
| lavender | `st-lav`         | `st-lav-shade`    | default card, focus on fields  |
| pink     | `st-pink`        | `st-pink-shade`   | primary button, text selection |
| green    | `st-green`       | `st-green-shade`  | card and badge variant         |
| yellow   | `st-yellow`      | `st-yellow-shade` | cart count badge, card variant |

A card sets its pair once through two CSS variables, `--st-tint` and `--st-shade`, and
everything inside it (image well, shadow, accents) reads them. That is why a card needs
only `tint="pink"` and no other colour class.

### Neutrals and meaning (follow the theme)

| Token                    | Role                                              |
| ------------------------ | ------------------------------------------------- |
| `surface`, `paper`       | page background; quieter boxes inside a card      |
| `card`                   | the fill of cards, fields and secondary buttons   |
| `ink`                    | main text                                         |
| `smoke`, `ash`           | secondary text, placeholders                      |
| `line`                   | the sticker outline                               |
| `hairline`, `hairline-2` | thin dividers inside a card                       |
| `panel`, `on-panel`      | dark fills (footer, eyebrow label) and their text |
| `accent`                 | links and the focus ring                          |
| `down`                   | errors, invalid fields, destructive hover         |

### Dark mode

The theme is `data-theme` on `<html>`: `light`, `dark`, or absent for System (follows the
device). The raw values on `:root` flip; `@theme inline` maps them to Tailwind tokens, so
`bg-surface` or `text-ink` change on their own and no component writes `dark:`.

In dark mode the outline becomes a muted purple and the neutral shadow becomes lavender,
so stickers still read as raised. Product pictures sit in a well that mixes the card's
tint with `st-paper`, a light base that does not flip, so dark products stay visible.

## Type

| Token         | Face           | Used for                   |
| ------------- | -------------- | -------------------------- |
| `font-poster` | Fraunces       | headings                   |
| `font-sans`   | Inter          | body text, buttons, fields |
| `font-mono`   | JetBrains Mono | prices, counts, code       |

The fonts are loaded with `next/font` in [layout.tsx](src/app/layout.tsx). Body text is
1rem with a 1.55 line height. Numbers that change (cart count, quantities) use
`tabular-nums` so they do not jump.

## Shape and depth

| Radius          | Size | Used for                |
| --------------- | ---- | ----------------------- |
| `rounded-st-lg` | 32px | the footer panel        |
| `rounded-st`    | 28px | large cards             |
| `rounded-st-sm` | 18px | small cards             |
| `rounded-st-xs` | 12px | thumbnails, inner boxes |
| `rounded-input` | 14px | fields                  |
| `rounded-well`  | 10px | product card image well |
| `rounded-full`  | —    | buttons, badges         |

| Shadow                | Offset | Colour                              |
| --------------------- | ------ | ----------------------------------- |
| `shadow-st-sm/md/lg`  | 3/5/8  | the element's own `--st-shade`      |
| `shadow-ink-sm/md/lg` | 3/5/8  | neutral ink (lavender in dark mode) |

Depth means size: a bigger sticker sits further off the page.

## Motion

One movement, the press. On hover a button lifts up and left and its shadow grows by 2px;
on press it moves down and right and the shadow shrinks to 2px. It lasts 150ms with
`ease-st`. All of it is behind `motion-safe:`, so people who ask for reduced motion get
none.

## The five primitives

They live in [src/components/ui/](src/components/ui/) and are the only way to draw their
thing. A new look is a new variant here, never classes copied into a page.

| Primitive              | Props                                                             | Notes                                                        |
| ---------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `Button`, `ButtonLink` | `variant`: primary, secondary, quiet · `size`: md, sm, icon       | quiet is the underlined link style (Remove, Clear cart)      |
| `Input`                | the native input props                                            | turns red when `aria-invalid`; `SelectField` shares its look |
| `Card`                 | `tint`: lav, pink, green, yellow, ink · `size`: sm, lg · `filled` | filled puts the tint in the background                       |
| `Badge`                | `tint`: yellow, lav, pink, green                                  | a small round count sticker                                  |
| `Modal`                | `open`, `onClose`, `title`                                        | on the native `<dialog>`: focus trap and Escape come free    |

`ButtonLink` adds an arrow that screen readers skip: → inside the site, ↗ to another site.

## Layout

Mobile first. Pages are a single column on a phone and open into two columns at `md` or
`lg` (product detail, cart, checkout, hero). The product grid uses `auto-fill`, so the
number of columns follows the width without a breakpoint per count. Main buttons and
fields are 48px tall (`min-h-12`); the small and icon buttons are 36px.

## Accessibility is part of the design

- Focus is always visible: a 3px `accent` outline, 3px away from the element.
- Colour is never the only signal: an invalid field also shows its error text, and the
  wishlist heart is outlined when off and filled when on (as well as turning pink).
- Status lines and the toast are polite live regions.
- Clear cart asks first, in the Modal.
