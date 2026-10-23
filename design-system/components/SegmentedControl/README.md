# SegmentedControl

SegmentedControl switches between 2–5 peer views or values in place; the selected segment is a raised thumb in a well.

## Usage

- Provide `aria-label`, `value`, `onValueChange` and items (text, or an icon with an `aria-label`).
- The track is a 36px tonal well (`ds-color-neutral-surface-default-default`, radius control 12, 4px padding); segments are 28px with radius element 8 (12 − 4 = 8). The selected segment is the raised material: `ds-color-neutral-surface-raised-default` with `ds-effect-material-raised`.
- Selection among peers is raised, never blue. Blue marks location (tabs, nav) and checked state.
- Switching content panels with their own focus order is Tabs.

## Status

Planned (intentional addition). Build it to this card: a `SegmentedControl` on the radio-group primitive (the docs site's theme switch adopts it).
