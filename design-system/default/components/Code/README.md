# Code

Code marks a short piece of code, a path or a value inside text.

## Usage

- Provide `children` and optional `intent` (`primary`, `info`, `success`, `warning`, `danger`) for values that carry status.
- Mono at 0.9em, medium; subtle fill with a hairline; radius mark 4 so it sits in the line without looking like a pill. Never wraps.
- A block of code is a CodeShowcase.

## Delta from the current build

- Radius moves from `element` to the new `mark` (4px), so the element ladder change does not round inline code.
