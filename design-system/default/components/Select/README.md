# Select

Select picks one value from a list in a menu-material listbox.

## Usage

- Provide `label`, `options` (value, label, optional group and disabled), `value` and `onValueChange`.
- The trigger is an input-shaped control (36px, radius control, strong boundary) with the up-down chevron; `size="small"` is 28px, radius element.
- The listbox is the menu material: radius container 16, 8px padding, rows 32px with radius element 8 (16 − 8 = 8, concentric). The selected option carries a blue check; the highlighted row takes `ds-color-neutral-surface-default-hover`.
- Group labels are eyebrows. More than ~12 options: add a search field at the top (Combobox).

## Status

Planned (intentional addition). Build it to this card: a `Select` on the listbox primitive (WAI-ARIA APG select-only combobox).
