# TextField

TextField is a labelled single-line input with optional description and error.

## Usage

- Provide `label` (always visible; never placeholder-only), `description` for format hints, `error` when invalid, plus the input's own props (`value`, `onChange`, `type`, `placeholder`).
- The input is 36px, radius control 12, raised fill, 1px `ds-color-neutral-border-strong-default` boundary (≥3:1, WCAG 1.4.11). Focus turns the border Scnx Blue and draws the 2px focus ring flush (offset 0).
- Errors: the border turns `ds-color-danger-border-strong-default` AND the error line carries an icon and text; color is never the only cue.
- Labels: label-default at medium weight. Descriptions and errors: body-small.

## Delta from the current build

- Input height fixed at 36px (`ds-dimension-size-control-medium`) with 12px inline padding; radius 6 → 12.
- Focus changes the border to blue and uses the focus outline at offset 0; the error line gains an icon.
