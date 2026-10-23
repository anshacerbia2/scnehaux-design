# Link

Link navigates; it is Scnx Blue text with a 1px underline, so it reads as a link without relying on color.

## Usage

- Provide `href` and `children`; add the `external` icon for links that leave the product (and `target` only when the user expects a new tab).
- Default: `ds-color-primary-text-subtle-default` with a `ds-color-primary-border-default-default` underline at 0.22em offset; on hover the underline becomes `currentColor`.
- `variant="neutral"` inherits the surrounding color for links in dense UI copy (footers, table cells).
- Links never carry a background or button padding; an action that does not navigate is a Button.

## Status

Planned (intentional addition). Build it to this card: a `Link` component in @scnx/system on an anchor primitive.
