# EdgeLayout

EdgeLayout is the product shell that runs edge to edge: Navbar across the top, Sidebar down the start, content on the canvas.

## Usage

- Provide `header` (a Navbar), `sidebar` (a Sidebar) and `children` (the page). Header 64px, sidebar 280px (geometry, not tokens).
- Everything sits on the canvas; regions are separated by hairlines, content cards are raised materials. Dense, data-first products.

## Delta from the current build

- Outer left and right borders are removed; region separation uses inset hairlines.
