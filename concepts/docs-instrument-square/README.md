# Docs · Instrument · Square

The Instrument expression (`concepts/docs-instrument/`) of the three docs boards,
drawn as an engineering sheet. Content, motion and colour roles are Instrument's;
the changes are geometry, line and type:

1. **No radius.** Every radius token (`radius.mark` … `radius.pill`) resolves to
   0, and the literal radii in the pages (round dots, slider thumbs, the 3px
   label chips) are flattened. Components and materials still bind the radius
   tokens; the tokens draw square. The callouts say so: `R0 / pad 8 / R0`, and
   the Button *Anatomy* view reads `R0 · radius.control`.
2. **No read head.** The blue hairline held at reading height (and the lit dots
   under it) is gone. "Here" still works: the sheet at the reading height turns
   its rail mark, sheet number and nav readout blue.
3. **Hairlines, not shadows.** The material effects keep their 1px ring and drop
   the blur; only menus, dialogs and sheets keep one long, low shadow. The nav is
   an opaque strip (no glass) and marks the current page with an ink underline.
4. **The frame.** Each sheet is bounded left and right by a hairline that meets
   its ruler, so the set reads as one drawing border. The reticle steps back.
5. **Hatched mounts.** A panel's 8px pad is hatched like a section cut and the
   plate sits on it; the call-to-action is a plain plate in a passe-partout ring.
6. **Lighter type.** Display and section headings at 500 with more open tracking,
   the big figures at 300, labels tracked wider.

> **Status: reference, non-normative (ADR-UIP-VIS-002).** Square geometry departs
> from the brand book's concentric ladder (R24 panel, pad 8, R16 container). It is
> an option to compare, not a rule; adopting it needs an ADR-UIP-VIS-001 revision.

| Board | Page | Image |
| :-- | :-- | :-- |
| Public · Landing (global) | [`Docs-Landing.html`](Docs-Landing.html) | [`Docs-Landing.png`](Docs-Landing.png) |
| Signed in · Workspace home | [`Docs-Home.html`](Docs-Home.html) | [`Docs-Home.png`](Docs-Home.png) |
| Docs · Components / Button | [`Docs-Button.html`](Docs-Button.html) | [`Docs-Button.png`](Docs-Button.png) |

## Files

- `square.css`: the changes above, loaded after `../docs-instrument/instrument.css`.
  The `--sq-*` properties (hairlines, hatch, lift) are expression-local guidance.
  The pages share `instrument.css` and `instrument.js` with Instrument, so a
  change there lands in both expressions.
- `<Board>.html`: the Instrument page with the square overrides, the read head
  removed and the radius callouts set to `R0`. Content is otherwise the same;
  keep the two in step when a board changes.
- `<Board>.png`, `<Board>.thumb.webp`: the still frame, dark mode, 1440px wide,
  rendered with `?render&mode=dark`.

Query parameters are Instrument's: `?mode=light|dark`, `?render`.
