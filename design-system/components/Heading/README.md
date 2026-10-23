# Heading

Heading titles a page or section; its visual size is independent of its level.

## Usage

- Provide `as` (h1–h6, by document outline) and `size` (`xxlarge` 48 … `xsmall` 16, default `medium` 24), `weight` (default bold).
- Product headings are Inter bold with −0.02em tracking from `large` up. Display (docs and marketing only) is Inter semibold, tight: −0.055em at display-1, line height 0.95, sized with `clamp()`.
- One display headline per page; never display type inside product views.

## Delta from the current build

- Display levels 1–3 move from the docs site's Sass into a shared type scale, so marketing and docs share one scale. `typography.display.*` is a proposal: it needs a STD-UIP-TKN-001 revision before it is a token.
