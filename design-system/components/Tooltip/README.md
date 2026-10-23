# Tooltip

Tooltip names or explains a control on hover and focus; it is the ink material, the only floating material in ink.

## Usage

- Provide `content` (a few words, or one sentence at most) and one focusable trigger as `children`; add a Kbd for the shortcut.
- Ink fill `ds-color-neutral-surface-solid-default`, label `ds-color-neutral-text-contrast-default`, label-small, radius element 8, `ds-effect-material-tooltip`, 4px from its anchor, no stem.
- Opens after 400ms hover or immediately on keyboard focus, closes on Escape; never holds interactive content (that is a Popover).

## Status

Planned (intentional addition). Build it to this card: a `Tooltip` on the floating primitive (APG tooltip).
