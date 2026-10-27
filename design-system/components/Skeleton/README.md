# Skeleton

Skeleton holds the shape of content that is loading, so the layout does not jump.

## Usage

- Provide `shape` (`text` 12px lines, `block` with radius control, `circle`) and size it like the content it replaces; mark the region `aria-busy="true"`.
- Fill `ds-color-neutral-surface-strong-default`, a 1.6s opacity pulse (off under reduced motion). The strong surface shows on every ground a skeleton sits on: the canvas, a raised surface, and the stage. The default surface was the stage's own ground in light mode, so a skeleton on it could not be seen.
- Match the real layout; never a generic grey card.

## Status

Planned (intentional addition). Build it to this card: a `Skeleton` atom.
