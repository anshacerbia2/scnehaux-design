# Default theme

The values Scnehaux UI ships with. The rules and components it fills are in
[`../../README.md`](../../README.md) and [`../../components/`](../../components/);
this folder holds only what a theme changes.

- Modes: `light` and `dark` (`data-theme` on the card's root).
- Primary scheme: Scnx Blue, seed `#0A6CF2`; the other scales come from the
  palette engine in `@scnx/system`.
- Radius ladder: 4 · 8 · 12 · 16 · 24 (`mark`, `element`, `control`,
  `container`, `panel`), plus `pill`.
- Type: Inter (variable) with the system mono stack.

Files:

- `tokens.json`: every Tier-2 token with its value per mode and its usage note.
- `tokens.css`: the same values as custom properties for the cards and the viewer.
- `rendered/<Name>.light.png` and `.dark.png`: every card drawn with these values.

Values are a snapshot of `@scnx/system`'s default theme; when they differ, the
package wins and this folder is regenerated.

A new theme is a sibling folder (`../<theme-id>/`) with the same three parts.
It keeps the rules: the ladder still ascends, materials stay materials, and the
primary action stays ink (ADR-UIP-VIS-001).
