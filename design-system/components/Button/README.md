# Button

Button runs one action; `primary` is ink, the one most important action in a view.

## Usage

- Provide `children` (a verb, sentence case: "Deploy", "New project"), `variant`, `size`, and `onClick`; an optional leading or trailing 16px icon goes inside.
- `primary` — ink (`ds-color-neutral-surface-solid-*` under `ds-color-neutral-text-contrast-*`). One per view; black in light mode, white in dark mode.
- `secondary` — a raised key: raised fill, `ds-color-neutral-border-default-default` ring, a 1px contact shadow. Every other action.
- `ghost` — no fill at rest; toolbars, dense rows, dialog dismissals.
- `danger` — `ds-color-danger-surface-solid-*`; only for the confirming action of something destructive, never as the trigger in a list.
- Sizes: `small` 28px (radius element 8, label-small), `medium` 36px (radius control 12), `large` 44px (radius control 12, 16px label, 20px icons). Inline padding is half the height minus 6.
- Pressed controls move 1px into the page (`translate: 0 1px`) unless reduced motion is requested.
- Blue is never a button fill. Blue means focus, selection, location and live state (see the brand book).
- Don't: two primaries side by side; icon-only buttons (use IconButton); a link styled as a button for navigation inside text.

## Delta from the current build

- `primary` moves from Scnx Blue (`primary` scheme solid) to ink (`neutral` solid); the blue primary fill is retired from buttons.
- `secondary` moves from a tonal fill to the raised key with a ring.
- New `ghost` and `danger` variants; new `size` prop (small 28, medium 36, large 44); heights become fixed tokens instead of padding plus line-height.
- Radius `control` changes from 6px to 12px; small buttons use `element` (8px).
