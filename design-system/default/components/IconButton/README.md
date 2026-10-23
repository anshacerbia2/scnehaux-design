# IconButton

IconButton is a square Button with one icon and a required accessible name.

## Usage

- Provide `aria-label` or `aria-labelledby` (the type requires exactly one), one icon as `children`, `variant` and `size`.
- Same variants as Button (`primary` ink, `secondary` raised key, `ghost`, `danger`); `ghost` is the default in toolbars and the close button of floating materials.
- Squares: small 28, medium 36, large 44, matching Button heights so a row of mixed controls aligns. Icons 16px (20px at large).
- Pair a tooltip with any icon-only control whose meaning is not universal (close, copy and more are universal).

## Delta from the current build

- Squares grow from 24/32 to 28/36 and gain `large` 44 so they match Button heights.
- New `danger` variant; radius follows the ladder (element at small, control otherwise).
