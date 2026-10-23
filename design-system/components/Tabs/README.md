# Tabs

Tabs switch between sibling panels of one page; the selected tab carries a 2px Scnx Blue indicator and a heavier weight.

## Usage

- Provide `value`, `onValueChange`, a list of tabs (label, optional small Badge count, `disabled`) and one panel per tab; `orientation` `horizontal` (default) or `vertical`.
- Tabs are 36px tall with 12px padding, label-default medium in subtle text; selected text default semibold with the blue indicator (`ds-color-primary-surface-solid-default`) inset by the tab padding. Hover is a radius-element pill behind the label.
- The list sits on a hairline (`ds-color-neutral-border-subtle-default`). Arrow keys move between tabs (APG tabs).
- Switching values in place without panels is a SegmentedControl.

## Delta from the current build

- Indicator inset to the label width and rounded; hover becomes an inset radius-element pill instead of a full-height fill.
- Fixed 36px height; counts use the small Badge.
