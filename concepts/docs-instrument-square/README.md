# Docs · Instrument · Square

The Instrument expression (`concepts/docs-instrument/`) of the three docs boards,
with two changes and nothing else:

1. **No radius.** Every radius token (`radius.mark` … `radius.pill`) resolves to
   0, and the literal radii in the pages (round dots, slider thumbs, the 3px
   label chips) are flattened. Components and materials still bind the radius
   tokens; the tokens draw square. The callouts say so: `R0 / pad 8 / R0`, and
   the Button *Anatomy* view reads `R0 · radius.control`.
2. **No read head.** The blue hairline held at reading height (and the lit dots
   under it) is gone. "Here" still works: the sheet at the reading height turns
   its rail mark, sheet number and nav readout blue.

> **Status: reference, non-normative (ADR-UIP-VIS-002).** Square geometry departs
> from the brand book's concentric ladder (R24 panel, pad 8, R16 container). It is
> an option to compare, not a rule; adopting it needs an ADR-UIP-VIS-001 revision.

| Board | Page | Image |
| :-- | :-- | :-- |
| Public · Landing (global) | [`Docs-Landing.html`](Docs-Landing.html) | [`Docs-Landing.png`](Docs-Landing.png) |
| Signed in · Workspace home | [`Docs-Home.html`](Docs-Home.html) | [`Docs-Home.png`](Docs-Home.png) |
| Docs · Components / Button | [`Docs-Button.html`](Docs-Button.html) | [`Docs-Button.png`](Docs-Button.png) |

## Files

- `square.css`: the two changes, loaded after `../docs-instrument/instrument.css`.
  The pages share `instrument.css` and `instrument.js` with Instrument, so a
  change there lands in both expressions.
- `<Board>.html`: the Instrument page with the square overrides, the read head
  removed and the radius callouts set to `R0`. Content is otherwise the same;
  keep the two in step when a board changes.
- `<Board>.png`, `<Board>.thumb.webp`: the still frame, dark mode, 1440px wide,
  rendered with `?render&mode=dark`.

Query parameters are Instrument's: `?mode=light|dark`, `?render`.
