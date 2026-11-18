# ShopBoard (Next.js) Constitution

The principles every spec, plan and task in this repository is checked against. They
restate the rules in [CLAUDE.md](../../CLAUDE.md), which stays the day-to-day guide; the
look is described in [DESIGN.md](../../DESIGN.md).

## Core Principles

### I. The copied files are never edited

The Day 3 files (`*.types.ts`, `*.logic.ts`, `*.state.ts`, `*.api.ts` of the cart, products
and theme features, `checkout.schema.ts`, `src/shared/api/client.ts`, `src/lib/messages.ts`,
`src/lib/format.ts`) come from the earlier repositories byte-identical and are listed in
`.prettierignore`. New code calls them and never copies their logic. A new feature brings
its own module files in the same shape; it does not grow a copied file.

### II. Strict types, no escape hatches

No `any`, no `as` (not even `as const`), no non-null `!`. Data from outside the program
(storage, the network, the URL) arrives as `unknown` and is narrowed with `typeof`,
`instanceof` or a type guard before it is used.

### III. One design system

Tailwind only: `src/app/globals.css` is the only CSS file, with no `style` objects.
Colours, radii, fonts and shadows come from the tokens, never raw values, and components
never write `dark:`. A button, field, sticker card, count sticker or dialog is drawn with
its primitive from `src/components/ui/`; a new look is a new typed variant there, and
`className` on a primitive is for layout only.

### IV. Server first, one owner per saved value

Pages are Server Components and products are read on the server. `"use client"` appears
only where there is state, an effect or a browser API. Every value saved in the browser
has exactly one state module that reads and writes it, and saves the least it can (ids
and quantities, never prices or names): product data always comes from the catalogue.

### V. Accessible and honest

Every control has a name, every status line and toast is a polite live region, nothing
destructive happens without a confirmation, and keyboard focus is moved on purpose when
the element holding it disappears. Colour is never the only signal. Every state shows its
own message (loading, error with retry, empty, not found). List keys come from the data.
The content stays true: this is a course demo, with no invented company, people or
policies.

## Quality gates

A change is done when all of these pass: `npm run typecheck`, `npm run lint`,
`npm run format:check`, `npm run test`, `npm run build`, and `npm run test:e2e` after a
change to a page or a flow. CI runs the same checks on every push and pull request. The
browser console shows no React warnings.

Test files (`tests/`) are written and changed by the human author only. An AI agent may
run the tests and propose cases in a task list, and never creates or edits a test file.

## Workflow

A new feature goes through Spec Kit: a specification (`spec.md`: what and why, no
technology), a plan (`plan.md`: how, checked against this constitution) and a task list
(`tasks.md`), all in `specs/<number>-<name>/`, written before the code.

## Governance

This constitution and CLAUDE.md must agree; when a rule changes, both change in the same
commit. A plan that breaks a principle says so in its Complexity Tracking table, with the
reason and the simpler alternative that was rejected.

**Version**: 1.0.0 | **Ratified**: 2026-11-18 | **Last Amended**: 2026-11-18
