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
  canvas.json                 Board titles, sizes, and positions
```

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
5. **A rendered PNG changes with its source** in the same pull request, so a
   reader who cannot run the source still sees the current design.

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
- `index.html`: every card live, with a filter and a theme and mode switch. Run
  `npx serve .` at the repository root and open `/design-system/`; browsers
  block its `fetch()` from a `file://` page.
- Shared files: `design-system.json`, `assets/` (icons, logo), and `fonts/`
  (Inter, SIL Open Font License 1.1, `OFL.txt`).

Status: 21 cards are components the package does not have yet (ui-platform
PLAN, "Component backlog"). The material shadow values on the cards predate the
token implementation (ui-platform #110) and are regenerated from the package
after it merges (ui-platform PLAN, "Spatial identity adoption").

## `concepts/` — product screens

Konsep B, Spatial Canvas, is the chosen direction for client-facing screens;
internal consoles keep a separate design.

| Folder | Board | Source | Rendered |
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

The `.dc.html` files are design-canvas sources (`<x-dc>` markup with
`<sc-for>`/`<sc-if>` templates and a data script). They need the canvas
runtime, which belongs to the design tool and is not redistributed here, so
they do not render when opened directly. Read them as source (layout, CSS
values, copy, data) and look at the PNG for the picture. The boards load their
fonts from Google Fonts.

## Provenance

Exported on 2026-10-24 from the Claude design canvases "Scnehaux UI" (Design
System) and "Platform Dashboard Concepts" (Design). Concept PNGs were rendered
at 1440 px wide with the canvas runtime and the boards' fonts from Fontsource;
component PNGs at 880 px (Cover 960 px) with `themes/default/tokens.css` and
`components/bundle.css`.
