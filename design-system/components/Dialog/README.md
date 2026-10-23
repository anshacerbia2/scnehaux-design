# Dialog

Dialog blocks the page for one task or decision that must be finished or dismissed.

## Usage

- Provide `title`, `description`, content, and actions (dismiss first, the confirming action last at the end edge); a ghost close IconButton sits top-end.
- Modal material: floating fill, radius panel 24, 24px padding, `ds-effect-material-modal`; 512px wide; the scrim is `ds-color-neutral-shadow-strong-default`. Enters with the 4px rise in `ds-motion-enter-duration`.
- Native `<dialog>` in the top layer; focus moves to the first field (or the dismiss action for confirmations) and returns to the trigger.
- Destructive confirmations use the `danger` Button and, for irreversible work, a typed confirmation.

## Delta from the current build

- Radius `container` 8px → `panel` 24px; the border and `ds-effect-shadow-overlay` become `ds-effect-material-modal`.
- New `actions` and `close` parts; the scrim becomes a token instead of a `color-mix()`.
