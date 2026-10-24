# Scnehaux design

Design references for the Scnehaux platform, kept as files so every person and
every coding agent reads the same design from one place. Each design has its
own folder.

```
design-system/                Scnehaux UI, the design system
  README.md                   rules: the brand book
  components/                 one card per component, shared by every theme
  index.html                  live viewer (theme and mode switch)
  themes/
    default/                  the default theme's values (light and dark)
concepts/
  concept-a-command-surface/  Konsep A — platform console and SaaS home
  concept-b-spatial-canvas/   Konsep B — client dev console and SaaS home
  internal-console/           Internal console, options C and D
  iam/                        IAM reachability
  docs-site/                  Public landing, signed-in workspace, component page
  docs-instrument/            The same three docs boards, industrial expression (live)
  docs-instrument-square/     Instrument with square geometry and no read head (live)
  canvas.json                 Board titles, sizes, and positions
```

## Website

**https://anshacerbia2.github.io/scnehaux-design/** (GitHub Pages, from `main`).
The hub links the component viewer (`/design-system/`) and every concept page.
To run it locally: `npx serve .` at the repository root and open
`http://localhost:3000/`; the component viewer loads its cards with `fetch()`,
which browsers block from a `file://` page.

## Rules

1. **This repository is the source of the designs.** The design canvases in
   Claude are previews made from these files. A change lands here by pull
   request first; the canvas is republished from the merged files.
2. **Scnehaux UI is the design system; a theme only supplies values.** The rules
   (`design-system/README.md`) and the components (`design-system/components/`)
   are shared. Each theme is a folder under `design-system/themes/` holding its
   tokens and its renders; `default` is the theme Scnehaux UI ships with.
   Another theme (achromatic, a client brand) is a sibling folder that changes
   values, never rules (ADR-UIP-VIS-001).
3. **Token values belong to `@scnx/system`.** `tokens.json` and `tokens.css` in
   a theme folder are a snapshot used to draw the cards. When a value here
   differs from the package, the package wins and the snapshot is regenerated.
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
| Rules — materials, the concentric ladder, ink acts and blue signals, the stage, type voice | [`README.md`](design-system/README.md) (the brand book) | No |
| Components — anatomy, geometry, states, token bindings | `components/<Name>/` (`preview.html`, `README.md`), `components/bundle.css` | No |
| Values — color, radius steps, type, shadows | `themes/<theme>/` (`tokens.json`, `tokens.css`, `rendered/`) | Yes |

- `components/<Name>/README.md` gives usage and the delta from the current build
  (or "Planned").
- `themes/default/rendered/<Name>.light.png` and `.dark.png`: every card in the
  default theme.
- `index.html`: every card live, with a filter and a theme and mode switch.
- Shared files: `design-system.json`, `assets/` (icons, logo), and `fonts/`
  (Inter, SIL Open Font License 1.1, `OFL.txt`).

Status: 21 cards are components the package does not have yet (ui-platform
PLAN, "Component backlog"). The material shadow values on the cards predate the
token implementation (ui-platform #110) and are regenerated from the package
after it merges (ui-platform PLAN, "Spatial identity adoption").

## `concepts/` — product screens

Konsep B, Spatial Canvas, is the chosen direction for client-facing screens;
internal consoles keep a separate design.

| Folder | Board | Source | Image |
| :-- | :-- | :-- | :-- |
| `concept-a-command-surface` | A · Platform Console | `Main.dc.html` | [`Main.png`](concepts/concept-a-command-surface/Main.png) |
| `concept-a-command-surface` | A · SaaS Home | `A-SaaS.dc.html` | [`A-SaaS.png`](concepts/concept-a-command-surface/A-SaaS.png) |
| `concept-b-spatial-canvas` | B · Client Dev Console | `B-Console.dc.html` | [`B-Console.png`](concepts/concept-b-spatial-canvas/B-Console.png) |
| `concept-b-spatial-canvas` | B · SaaS Home | `B-SaaS.dc.html` | [`B-SaaS.png`](concepts/concept-b-spatial-canvas/B-SaaS.png) |
| `internal-console` | Internal · Opsi C — Schematic | `C-Internal.dc.html` | [`C-Internal.png`](concepts/internal-console/C-Internal.png) |
| `internal-console` | Internal · Opsi D — Stratum | `D-Internal.dc.html` | [`D-Internal.png`](concepts/internal-console/D-Internal.png) |
| `iam` | Internal · IAM — Reachability | `IAM-Reachability.dc.html` | [`IAM-Reachability.png`](concepts/iam/IAM-Reachability.png) |
| `docs-site` | Public · Landing (global) | `Docs-Landing.dc.html` | [`Docs-Landing.png`](concepts/docs-site/Docs-Landing.png) |
| `docs-site` | Signed in · Workspace home | `Docs-Home.dc.html` | [`Docs-Home.png`](concepts/docs-site/Docs-Home.png) |
| `docs-site` | Docs · Components / Button | `Docs-Button.dc.html` | [`Docs-Button.png`](concepts/docs-site/Docs-Button.png) |
| `docs-instrument` | Instrument · Landing (global) | `Docs-Landing.html` | [`Docs-Landing.png`](concepts/docs-instrument/Docs-Landing.png) |
| `docs-instrument` | Instrument · Workspace home | `Docs-Home.html` | [`Docs-Home.png`](concepts/docs-instrument/Docs-Home.png) |
| `docs-instrument` | Instrument · Components / Button | `Docs-Button.html` | [`Docs-Button.png`](concepts/docs-instrument/Docs-Button.png) |
| `docs-instrument-square` | Square · Landing (global) | `Docs-Landing.html` | [`Docs-Landing.png`](concepts/docs-instrument-square/Docs-Landing.png) |
| `docs-instrument-square` | Square · Workspace home | `Docs-Home.html` | [`Docs-Home.png`](concepts/docs-instrument-square/Docs-Home.png) |
| `docs-instrument-square` | Square · Components / Button | `Docs-Button.html` | [`Docs-Button.png`](concepts/docs-instrument-square/Docs-Button.png) |

Each board has three files:

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

`docs-instrument` is the exception to the three-file rule: its motion is the
deliverable, and a canvas export freezes it at its first frame, so each board is
a hand-authored live page (`<Board>.html`, sharing `instrument.css` and
`instrument.js`) plus its still frame (`.png`, `.thumb.webp`, rendered with
`?render&mode=dark`). It binds the default theme's tokens and the reference
component classes; its folder README records the expression and its guidance
status. `docs-instrument-square` follows the same rule and reuses Instrument's
`instrument.css` and `instrument.js`, adding only `square.css` (radius tokens
at 0, no read head).

## Provenance

Exported on 2026-10-24 from the Claude design canvases "Scnehaux UI" (Design
System) and "Platform Dashboard Concepts" (Design). Concept PNGs were rendered
at 1440 px wide with the canvas runtime and the boards' fonts from Fontsource;
component PNGs at 880 px (Cover 960 px) with `themes/default/tokens.css` and
`components/bundle.css`.
