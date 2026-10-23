# Breadcrumb

Breadcrumb shows where the page sits in the hierarchy and links each ancestor.

## Usage

- Provide items (`href`, `label`); the last item is the current page (`aria-current="page"`, no link).
- body-small; ancestors in subtle text, the current page in default text at medium weight; the separator is a mono "/" in `ds-color-neutral-border-strong-default`.
- Truncate the middle with an ellipsis Menu past four levels.

## Status

Planned (intentional addition). Build it to this card: a `Breadcrumb` (an ordered list in a labelled nav).
