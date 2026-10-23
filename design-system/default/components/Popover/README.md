# Popover

Popover holds a small interactive task anchored to its trigger: a share link, a filter, a quick edit.

## Usage

- Provide a trigger, `title`, content and actions; it is a non-modal dialog with focus moved inside on open and back to the trigger on close.
- Menu material: floating fill, radius container 16, 16px padding, 320px wide, `ds-effect-material-menu`, 4px from the trigger, no stem.
- Controls inside follow the concentric rule: 16 − 16 padding is flat, so inputs keep their own radius control.
- A list of commands is a Menu; a blocking task is a Dialog.

## Status

Planned (intentional addition). Build it to this card: a `Popover` on the floating primitive (APG dialog, non-modal).
