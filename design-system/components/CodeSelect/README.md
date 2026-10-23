# CodeSelect

CodeSelect switches the language of a CodeShowcase; it is the small Select with a leading code icon.

## Usage

- Provide `options` (languages), `value` and `onValueChange`; it lives in the CodeShowcase nav row.
- Anatomy and tokens are Select's at `size="small"` (28px, radius element 8); the open list is the menu material.

## Delta from the current build

- Trigger and list adopt Select's anatomy: the list moves from `ds-effect-shadow-overlay` with radius control to the menu material (radius container 16, 8px padding, 32px rows).
- The selected option shows a blue check instead of blue text.
