# Menu

Menu lists commands for its trigger; choosing one runs it and closes the menu.

## Usage

- Provide a trigger and items (label, optional 16px icon, optional shortcut Kbd, `onSelect`, `disabled`, `variant="danger"`), groups with eyebrow labels, and separators.
- Menu material: floating fill, radius container 16, 8px padding; rows 32px, radius element 8 (16 − 8 = 8). Highlight `ds-color-neutral-surface-default-hover`; danger items in the danger subtle text and icon.
- Keyboard: arrows move, Enter runs, Escape closes, type-ahead jumps (APG menu button).
- Choosing a value is a Select; a destructive item opens a confirming Dialog.

## Status

Planned (intentional addition). Build it to this card: a `Menu` on the menu-button primitive (APG).
