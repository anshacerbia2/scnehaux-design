# Scnehaux design

Design references for the Scnehaux platform, kept as files so every person and
every coding agent reads the same design from one place. There are two designs,
one per theme, each in its own folder with its own brand book; everything else
is in `others/`.

```
brand/
  Brand.html                  The brand every theme shares: name, mark, voice, icons (live)
scnx-platform/                The platform's design (IAM, AI runtime, organization, the docs), live
  Brand-Book.html             its brand book
  Docs-Front-Door.html        the docs' front door, adopted from the site (current)
  Docs-Landing.html, Docs-Home.html, Docs-Button.html
scnx-saas/                    The SaaS products' design: public landing, signed-in workspace, component page
  Brand-Book.html             its brand book (live)
design-system/                Scnehaux UI, the design system
  README.md                   where the rules are, and the status of the reference
  components/                 one card per component, shared by every theme
  index.html                  live viewer (theme and mode switch)
  vendor/scnx-system/         @scnx/system's tokens and fonts, synced byte for byte
  rendered/<theme>/           every card drawn from those tokens, light and dark
others/
  concept-a-command-surface/  Konsep A — platform console and SaaS home
  concept-b-spatial-canvas/   Konsep B — client dev console and SaaS home
  internal-console/           Internal console, options C and D
  iam/                        IAM reachability
  docs-instrument/            The docs boards in the Instrument expression, which scnx-platform grew from (live)
  canvas.json                 Board titles, sizes, and positions
concepts/                     Redirects from the old addresses only
```

A brand book belongs to a theme, not to a product: every product on
scnx-platform reads the same brand book. A product that needs a different look
needs a new theme, and that theme gets its own folder and brand book. What every
theme shares (the name and the mark, the voice, the icons) is written once, in
`brand/Brand.html`, and both brand books link to it.

## Website

**https://anshacerbia2.github.io/scnehaux-design/** (GitHub Pages, from `main`).
The hub links the two designs, the component viewer (`/design-system/`), and
every page in `others/`. The old `concepts/...` addresses redirect to the new
ones.
To run it locally: `npx serve .` at the repository root and open
`http://localhost:3000/`; the component viewer loads its cards with `fetch()`,
which browsers block from a `file://` page.

## Rules

1. **This repository is the source of the designs.** The design canvases in
   Claude are previews made from these files. A change lands here by pull
   request first; the canvas is republished from the merged files.
2. **Scnehaux UI is the design system; a theme supplies the values, and a design
   shows one theme.** The components (`design-system/components/`) are shared.
   `scnx-platform/` shows the package's `scnx-platform` theme (was `industrial`) and
   `scnx-saas/` its `scnx-saas` theme (was `achromatic`). A theme maps Tier-2 values above the guarded
   floors, never rules (ADR-UIP-VIS-001).
3. **Token values belong to `@scnx/system`.** `npm run sync:tokens` runs the
   package's own emitter at the ui-platform commit pinned in
   `scripts/sync-tokens.json` and copies its output into
   `design-system/vendor/scnx-system/` byte for byte, at the package's published
   paths (`tokens/css/<theme>.css`, `tokens/json/<theme>.json`, `fonts/`), with
   `SOURCE.json` recording the commit and a hash per file. Pages link those
   files and never restate a value; `npm run check:tokens` fails when they are
   out of date. Once the package is published, a page moves to it by changing
   only the path prefix. The cards are rendered from the same files
   (`npm run render:cards`).
4. **The binding rules live in the architecture repository**: ADR-UIP-VIS-001
   (spatial identity), STD-UIP-TKN-001 (token grammar), and each component's
   specification in `ui-platform`. A card shows the target; it does not
   override a specification.
5. **Generated files change with their source** in the same pull request (the
   static page, PNG, and thumbnail of a board; the PNGs of a card), so a reader
   who cannot run the source still sees the current design.

## `design-system/` — Scnehaux UI

The design system, in three layers:

| Layer | Where | Changes per theme? |
| :-- | :-- | :-- |
| Rules — materials, the concentric ladder, ink, the stage, type voice | Each theme's brand book: [`scnx-saas/Brand-Book.html`](scnx-saas/Brand-Book.html), [`scnx-platform/Brand-Book.html`](scnx-platform/Brand-Book.html) | Yes |
| Components — anatomy, geometry, states, token bindings | `components/<Name>/` (`preview.html`, `README.md`), `components/bundle.css` | No |
| Values — color, radius steps, type, shadows | `vendor/scnx-system/` (from `@scnx/system`); the cards drawn with them: `rendered/<theme>/` | Yes |

- `components/<Name>/README.md` gives usage and the delta from the current build
  (or "Planned").
- `rendered/<theme>/<Name>.light.png` and `.dark.png`: every card in
  `scnx-platform` and in `scnx-saas`, rendered by `scripts/render-cards.mjs` from
  the synced tokens. `npm run check:cards` compares a fresh render with them;
  font rasterization differs between machines, so render and check on one.
- `index.html`: every card live, with a filter and a theme and mode switch.
- Shared files: `design-system.json`, `assets/` (icons, logo), and `fonts/`
  (Inter, SIL Open Font License 1.1, `OFL.txt`).

Status: 21 cards are components the package does not have yet (ui-platform
PLAN, "Component backlog"). The cards draw `components/bundle.css` on the
package's tokens: they show each theme's rules, not the shipped components,
which ui-platform checks in its own visual tests.

## The two designs

| Folder | Board | Source | Image |
| :-- | :-- | :-- | :-- |
| `brand` | Brand (shared by both) | `Brand.html` | [`Brand.png`](brand/Brand.png) |
| `scnx-platform` | Brand book | `Brand-Book.html` | [`Brand-Book.png`](scnx-platform/Brand-Book.png) |
| `scnx-platform` | Docs · Front door | `Docs-Front-Door.html` | [`Docs-Front-Door.png`](scnx-platform/Docs-Front-Door.png) |
| `scnx-platform` | Landing (global) | `Docs-Landing.html` | [`Docs-Landing.png`](scnx-platform/Docs-Landing.png) |
| `scnx-platform` | Docs home (get started) | `Docs-Home.html` | [`Docs-Home.png`](scnx-platform/Docs-Home.png) |
| `scnx-platform` | Components / Button | `Docs-Button.html` | [`Docs-Button.png`](scnx-platform/Docs-Button.png) |
| `scnx-saas` | Brand book | `Brand-Book.html` | [`Brand-Book.png`](scnx-saas/Brand-Book.png) |
| `scnx-saas` | Public · Landing (global) | `Docs-Landing.dc.html` | [`Docs-Landing.png`](scnx-saas/Docs-Landing.png) |
| `scnx-saas` | Signed in · Workspace home | `Docs-Home.dc.html` | [`Docs-Home.png`](scnx-saas/Docs-Home.png) |
| `scnx-saas` | Docs · Components / Button | `Docs-Button.dc.html` | [`Docs-Button.png`](scnx-saas/Docs-Button.png) |

`scnx-saas/Brand-Book.html` is drawn from `@scnx/system`'s `scnx-saas` tokens.
The boards were drawn before the theme shipped, as canvas exports with literal
colours; where they differ from the package (the blue accent, the card shadow),
sheet 10 of the brand book lists the difference and the side it takes.

## `others/` — earlier concepts

Kept for reference; Konsep B, Spatial Canvas, was the direction for
client-facing screens.

| Folder | Board | Source | Image |
| :-- | :-- | :-- | :-- |
| `concept-a-command-surface` | A · Platform Console | `Main.dc.html` | [`Main.png`](others/concept-a-command-surface/Main.png) |
| `concept-a-command-surface` | A · SaaS Home | `A-SaaS.dc.html` | [`A-SaaS.png`](others/concept-a-command-surface/A-SaaS.png) |
| `concept-b-spatial-canvas` | B · Client Dev Console | `B-Console.dc.html` | [`B-Console.png`](others/concept-b-spatial-canvas/B-Console.png) |
| `concept-b-spatial-canvas` | B · SaaS Home | `B-SaaS.dc.html` | [`B-SaaS.png`](others/concept-b-spatial-canvas/B-SaaS.png) |
| `internal-console` | Internal · Opsi C — Schematic | `C-Internal.dc.html` | [`C-Internal.png`](others/internal-console/C-Internal.png) |
| `internal-console` | Internal · Opsi D — Stratum | `D-Internal.dc.html` | [`D-Internal.png`](others/internal-console/D-Internal.png) |
| `iam` | Internal · IAM — Reachability | `IAM-Reachability.dc.html` | [`IAM-Reachability.png`](others/iam/IAM-Reachability.png) |
| `docs-instrument` | Instrument · Landing (global) | `Docs-Landing.html` | [`Docs-Landing.png`](others/docs-instrument/Docs-Landing.png) |
| `docs-instrument` | Instrument · Workspace home | `Docs-Home.html` | [`Docs-Home.png`](others/docs-instrument/Docs-Home.png) |
| `docs-instrument` | Instrument · Components / Button | `Docs-Button.html` | [`Docs-Button.png`](others/docs-instrument/Docs-Button.png) |

## Board files

Each canvas board (`scnx-saas` and most of `others/`) has three files:

- `<Board>.dc.html`: the design-canvas source (`<x-dc>` markup with
  `<sc-for>`/`<sc-if>` templates and a data script). It needs the canvas
  runtime, which belongs to the design tool and is not redistributed here, so
  it does not render when opened directly. Edit this one.
- `<Board>.html`: a static page generated from the source with the runtime,
  without scripts; it opens in any browser. Interactive parts are frozen at
  their first frame (the landing page's 3D hero is an image). Generated, never
  edited.
- `<Board>.png` and `<Board>.thumb.webp`: the full render and the hub
  thumbnail.

The boards load their fonts from Google Fonts.

`scnx-platform` and `others/docs-instrument` are the exception to the
three-file rule: their motion is the deliverable, and a canvas export freezes it
at its first frame, so each board is a hand-authored live page (`<Board>.html`)
plus its still frame (`.png`, `.thumb.webp`, rendered with `?render&mode=dark`).
`scnx-platform` has its own copies of Instrument's `instrument.css` and
`instrument.js`, adds `square.css` (a framed column, crossing rules, sticky
section bars, cells that share their lines) and `square.js` (a ruler scrollbar
with section titles), and binds `@scnx/system`'s scnx-platform tokens from
`design-system/vendor/`; its thumbnails are the live first screen, so they show
the ruler. `others/docs-instrument` keeps the earlier snapshot. Since 2026-10-27
the documentation site (`anshacerbia2/ui-platform-docs`) is the source of its
own pages and chrome: the `Docs-*.html` boards, `square.css`, `square.js` and
`SCROLL.md` stay as history (see `scnx-platform/README.md`), and the brand book
stays current here.

## Provenance

Exported on 2026-10-24 from the Claude design canvases "Scnehaux UI" (Design
System) and "Platform Dashboard Concepts" (Design). Concept PNGs were rendered
at 1440 px wide with the canvas runtime and the boards' fonts from Fontsource;
component PNGs at 880 px (Cover 960 px) with the hand-made snapshot
`themes/default/tokens.css` (now `others/docs-instrument/tokens.css`) and
`components/bundle.css`. Since 2026-10-26 the cards are rendered from
`@scnx/system`'s tokens instead.
