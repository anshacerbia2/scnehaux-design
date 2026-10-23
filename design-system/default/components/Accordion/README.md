# Accordion

Accordion discloses sections one at a time to keep a long page scannable.

## Usage

- Provide items (`title`, `content`, optional `defaultOpen`), `type` (`single` or `multiple`) and `variant` (separate items, or `stacked` in one group).
- Each item (or the stacked group) is the flat material, radius container 16. Triggers are 44px, label-default medium; the chevron rotates in `ds-motion-disclosure-duration`. Content is body-small in subtle text.
- Focus draws the focus ring inside the item (offset −2px) instead of recoloring the border.

## Delta from the current build

- Items become the flat material (ring instead of border), radius 8 → 16; the trigger loses its tonal fill.
- `:focus-within` border recolor and the inset focus shadow are replaced by the focus outline.
