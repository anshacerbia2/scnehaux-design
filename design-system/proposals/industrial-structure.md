# Proposal: the industrial structure

> **Status: proposal, non-normative (ADR-UIP-VIS-002).** It binds nothing until
> ADR-UIP-VIS-001 is revised and STD-UIP-TKN-001 records it. Decided by the owner
> on 2026-10-25 as the direction to propose: the structure of every component is the
> system's, square, and the same in every theme; a theme changes only colours.

## The decision, in three lines

1. **Structure is fixed.** Shape, size, spacing, border, type scale, motion and
   stacking are the system's, identical in every theme and mode. No theme and no
   consumer overrides them.
2. **The structure is square.** The radius ladder is flat at 0. `pill` stays fully
   rounded, because the round shape of a radio, a switch or a status dot carries
   meaning. On-page materials are a ring only.
3. **A theme is colour.** A theme supplies `color.*` per mode and nothing else. The
   theme `default` becomes `industrial`; `achromatic` stays and loses its own radius
   and shadow values.

## Why

- **One shape across every brand.** A product is recognisable in any theme. Carbon
  works this way: its four themes (White, Gray 10, Gray 90, Gray 100) change colour,
  and its buttons have no radius in any of them [1][2].
- **The docs show components as they ship.** A component page's theme switch
  compares colours only, so a specimen and the docs chrome never disagree in shape.
  The primitives page draws structure in the docs' style, and that is also the styled
  component's structure.
- **Structure is tested once.** Sizes, targets and nesting are proven in one theme
  and hold in all; the theme gate checks colour pairs.

## What stays fixed (structural invariants)

Every row is identical in every theme and mode. A theme file that sets one fails the
gate.

| # | Property | Where it lives | Industrial value | Why it is fixed |
| :-- | :-- | :-- | :-- | :-- |
| 1 | Corner radius | `dimension.radius.mark` … `panel`; `pill` | 0; `pill` fully rounded | The shape is the identity; a round that means something stays round |
| 2 | Spacing | `dimension.spacing.inset-*`, `stack-*`, `inline-*`, `control-*`, `section`, `page` | Current values (4, 8, 16; 8, 16, 24; 8, 12, 16; 24, 32) | Density and alignment are layout, not brand |
| 3 | Border width | `dimension.border-width.default`, `strong` | 1px, 2px | A boundary's weight is part of the contrast contract (1.4.11) |
| 4 | Stacking | `dimension.z-index.*` | Current order | Layering is behaviour |
| 5 | Component geometry | Each component's specification (not tokens, STD-UIP-TKN-001) | Controls 28, 36, 44px; rows 32px (tables 44px); icons 16, 20px; targets at least 24px; Navbar 64px; Sidebar 280px; container widths | Already structural (ADR-UIP-VIS-001 item 6) |
| 6 | Type | `typography.*`: family, size, line height, letter spacing, weight; Inter `cv11` | Current scale | Metrics drive every size and wrap; a brand font needs its own ADR |
| 7 | Material geometry | `effect.material.*` | 1px ring. `flat`, `raised`, `panel`: ring only. `well`: none. `tooltip`, `menu`, `modal`, `sheet`: ring and their contact and ambient layers, plus the dark inset top edge | Edges and elevation read the same in every brand |
| 8 | Focus indicator | Outline geometry | 2px, offset 2px (inputs 0) | Visible focus is a contract (STD-GLB-FE-005 3.9) |
| 9 | Motion | `motion.*.duration`, `motion.*.easing`; distances | Current values; rise 4px; pressed sinks 1px; reduced motion removes movement | Behaviour, not brand |
| 10 | Breakpoints | Build-time constants | Current values | Layout behaviour |
| 11 | State mechanics | Each component's specification | Which states exist, the pressed sink, disabled controls not reacting, cursors | Behaviour |

Density, if it is ever needed, is a separate axis with its own selector, not a theme.

## What a theme changes

Only `color.*`: every scheme × role × emphasis × state (surface, text, icon, border,
shadow), for each mode. A translucent state stays a colour whose alpha is part of its
value. The layer colours of a material shadow are colour tokens, so a theme recolours
a material without changing its geometry.

## Themes after the change

| Theme id | Was | Palette | Structure |
| :-- | :-- | :-- | :-- |
| `industrial` | `default` | Scnx Blue primary, neutral, the status schemes | Industrial |
| `achromatic` | `achromatic` | Ink primary (neutral matrix) | Industrial; its radius ladder (2, 4, 8, 12, 20px) and shadow overrides are removed |

The current rounded look is not kept as a theme, because radius is no longer a theme
value. ui-platform is before v1, so the id changes without a compatibility alias
(TDD tokens-003, "Rollout and Compatibility").

## `pill`: what stays round

`pill` keeps its full radius. In `components/bundle.css` it is used by:

| Use | Proposed |
| :-- | :-- |
| Radio indicator and dot | Round: tells a radio from a checkbox (Radix Themes never fully rounds a checkbox for the same reason [3]) |
| Switch track and thumb | Round: the switch's affordance |
| Status dot (Badge, Avatar status) | Round: a status mark |
| Spinner | Round: it is a ring |
| Avatar (circle shape) | Round; the square shape takes 0 |
| Skeleton (circle shape) | Round: it stands in for a circle avatar |
| Progress track | Review: proposed square (`mark`, 0) |
| Tab underline, navigation and TOC markers | Review: proposed square (`mark`, 0) |

## The mono (separable)

IBM Plex Mono 400, 500 and 600 as the system mono (`--font-mono`,
`typography.code.*`), served from the package with its licence (SIL OFL 1.1; the
files are in `design-system/fonts/`). It can ship after the structure. Until it does,
the docs chrome uses its own mono (`--sq-mono`) and product code keeps the system mono.

## What changes, and where

| Repository | Change |
| :-- | :-- |
| `scnehaux-architecture` | Revise ADR-UIP-VIS-001: item 2 (the ladder becomes flat, `pill` kept), item 1 (on-page materials are a ring), item 6 (extended to the invariants above), Context, Alternatives (the concentric ladder becomes the rejected alternative). STD-UIP-TKN-001 2.6.0: structural families are theme-invariant; radius values are non-decreasing from `mark` to `panel` (`pill` excluded); a brand theme overrides colour keys only ("Cascading Overrides"); remove "a brand theme may shift the ladder". |
| `ui-platform` | Token values (radius 0, materials); theme id `default` → `industrial`; achromatic's radius and shadow overrides removed; a gate that fails when a theme sets a structural key or when structural values differ between themes; component specifications, `*.spec.json` and TDD decision records that quote radius values; the Figma profile; the `pill` review above; Chromatic baselines re-accepted. |
| `ui-platform-docs` | Adopt the Instrument · Square expression; until the package ships, a bridge of the radius and material tokens in the `overrides` layer; a component page's theme switch changes colour only. |
| `scnehaux-design` | After the package ships: regenerate the token snapshot (ADR-UIP-VIS-002), rename `themes/default/` to `themes/industrial/`, re-render the cards, and rewrite signatures 1 and 2 of the brand book. The Square docs boards already draw the target, through the bridge in `square.css`. |

## References

Retrieved 2026-10-25.

1. IBM Carbon, Themes: <https://carbondesignsystem.com/elements/themes/code/>. The
   current themes are White, Gray 10, Gray 90 and Gray 100.
2. IBM Carbon, Button style: <https://carbondesignsystem.com/components/button/style/>.
   It lists padding and heights (24 to 80px) and no radius.
3. Radix Themes, Radius: <https://www.radix-ui.com/themes/docs/theme/radius>. The
   theme's radius ranges from `none` to `full`; with `full` a Button is a pill, but a
   Checkbox is never fully rounded, so it is not confused with a Radio.
