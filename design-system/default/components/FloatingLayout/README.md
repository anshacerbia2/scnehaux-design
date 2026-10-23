# FloatingLayout

FloatingLayout is the spatial shell: the Sidebar and the content float as materials on the stage, 8px from the edges and each other.

## Usage

- Provide `sidebar` (a Sidebar with `variant="floating"`) and `children`. The ground is the stage color (no dot grid behind data); the sidebar is the raised material, radius container 16; the content area is the raised material with 24px padding.
- Inside the content, cards are flat (one shadow per stack). Use for the client-facing dashboard; EdgeLayout for internal, dense tools.

## Delta from the current build

- Content area gains the raised material (the commented-out surface becomes real); gaps tighten from 32px to 8px so the materials read as one layered object.
