# Sidebar

Sidebar is the application shell's column of Navigation, with a header for the workspace and a footer for the account.

## Usage

- Provide `header` (mark, workspace name, plan Badge), `children` (a Navigation), `footer` (Avatar, name, sign-out), and `state` (`expanded` 280px, `collapsed` 56px icons only).
- In EdgeLayout: canvas fill with an end hairline. In FloatingLayout: `variant="floating"`, the raised material with radius container 16 and 8px padding, so items (radius element 8) are concentric.
- Collapsed items keep `aria-label`s and gain Tooltips.

## Delta from the current build

- 8px padding with concentric items; the inverse-surface comments and `color-mix()` badges are retired.
- New `floating` variant for FloatingLayout; collapsed width 80 → 56px.
