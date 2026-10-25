> **Status: reference, non-normative (ADR-UIP-VIS-002).** The binding rules are ADR-UIP-VIS-001 (materials, the concentric ladder, ink acts and blue signals, the stage, type voice, geometry) and STD-UIP-TKN-001 (token grammar); a component's contract is its specification in `ui-platform`. Sections that restate those records add nothing binding. The motion signature "the rise" is **guidance** until an ADR or STD revision records it; so are the voice, the icon grammar and the mark, now in [`brand/Brand.html`](../brand/Brand.html).

> **Which design this is.** These are the rules of the scnx-saas look (the boards in [`scnx-saas/`](../scnx-saas/)), until they move to `scnx-saas/Brand-Book.html`. The scnx-platform design has its own brand book, [`scnx-platform/Brand-Book.html`](../scnx-platform/Brand-Book.html).

> **[The industrial structure](proposals/industrial-structure.md), revision 3.** Components carry no design of their own: every presentational property reads a component hook (`--scnx-*`, Tier 3) that falls back to a semantic token (`--ds-*`, Tier 2), and a theme may map any Tier-2 key (recorded in ADR-UIP-VIS-001 revision 3). Revision 3 named the themes `scnx-platform` (was `industrial`, square) and `scnx-saas` (was `achromatic`), now shipped by `@scnx/system`, and gives `scnx-saas` the shape below: signatures 1 and 2 (materials, the concentric ladder) are this look's, so they stand.

Scnehaux UI is an accessible React design system with perceptual color, scoped multi-brand theming and zero runtime CSS, and every release ships with the evidence that it works. Its look is **spatial**: ink controls and layered materials on a dotted stage, one electric blue that means "here", and corners that nest. Build every screen from the rules below; a screen that follows them reads as Scnehaux at a glance.

## The six signatures

These are what make a screen recognizably Scnehaux. Never drop one to match another library's look.

1. **Materials, not boxes.** Every container is one of eight materials (`Surface` card): flat, raised, panel and well on the page; tooltip, menu, modal and sheet above it. A material binds fill, radius, a 1px ring and a shadow (`ds-effect-material-*`) as one unit. Never hand-mix a border, a radius and a shadow.
2. **The concentric ladder 4 · 8 · 12 · 16 · 24.** `ds-dimension-radius-mark` 4, `-element` 8, `-control` 12, `-container` 16, `-panel` 24, plus `-pill`. A child's radius is its parent's radius minus the parent's padding: a 24 panel padded 8 holds a 16 card; a 16 menu padded 8 holds 8 rows; a 12 segmented track padded 4 holds an 8 thumb. Corners never collide.
3. **Ink acts, blue signals.** The primary action is ink (`ds-color-neutral-surface-solid-default`: near-black in light mode, near-white in dark mode). Scnx Blue (`ds-color-primary-surface-solid-default`, #0A6CF2 at the seed) is reserved for meaning: the focus ring, links, checked controls, progress, and the "you are here" indicator in navigation, tabs and the table of contents. Blue is never a button fill and never decoration.
4. **The stage.** Marketing, docs, empty states and previews sit on the stage: a tinted ground (`ds-color-neutral-surface-default-default` in light, `-sunken-` in dark) with a 1px dot every 22px (`ds-color-neutral-border-subtle-default` in light, `-surface-strong-` in dark). Product data sits on the plain canvas (`ds-color-neutral-surface-canvas-default`); never put the dot grid behind a table or a form.
5. **The eyebrow and the tight display.** Section kickers, table headers, group labels and metadata are eyebrows: mono, uppercase, +0.12em, `ds-color-neutral-text-subtle-default` (`eyebrow` style). Marketing headlines are Inter semibold, tracked tight (−0.055em at `display-1`, leading 0.95).
6. **The rise.** Floating materials appear 4px from their anchor with no stem, rising 4px and fading in over `ds-motion-feedback-duration`; dialogs and sheets rise over `ds-motion-enter-duration`. Pressed controls sink 1px. All of it stops under `prefers-reduced-motion`.

## Voice, icons and the mark

The brand every theme shares (the name and the mark, the voice and the copy rules, the icon grammar) is written once, in [`brand/Brand.html`](../brand/Brand.html). This file keeps only the rules of the scnx-saas look.

## Color

- Tokens follow one grammar: `ds-color-{scheme}-{role}-{emphasis}-{state}`. Schemes: `neutral`, `primary` (Scnx Blue), `info`, `success`, `warning`, `danger`. Roles: `surface`, `text`, `icon`, `border`, `shadow`. States: `default` (rest), `hover`, `pressed`, `disabled`, `selected`, `focus`. Bind components only to these Tier 2 tokens, never to palette steps or literals.
- Every scale is a 12-step ramp from the palette engine (Radix custom-palette algorithm, Display P3, gated at WCAG 2.2 on four display paths). Role-to-step mapping is the same in both modes, so a component never chooses a token per mode.
- Text pairs: `ds-color-neutral-text-default-default` for body and titles and `ds-color-neutral-text-subtle-default` for secondary copy, on canvas, sunken, subtle, default, raised and floating surfaces (≥13.6:1 and ≥5.2:1 in every theme). Each text token's note states its grounds and its measured minimum.
- A solid fill always takes its scheme's contrast label: ink with `ds-color-neutral-text-contrast-default`, blue with `ds-color-primary-text-contrast-default`, danger with `ds-color-danger-text-contrast-default`.
- Status needs a word or an icon as well as a color: a Badge with a dot and "Live", an Alert with its icon and title. Success and danger are told apart by their icons and words, never by green and red alone.
- Themes: `light` and `dark` are the default theme's two modes; `achromatic-light` and `achromatic-dark` replace Scnx Blue with ink for monochrome brands. Every component works unchanged in all four because it binds roles, not hues.

### What color means

| Meaning | Treatment | Examples |
|---|---|---|
| The main action | Ink fill | Primary Button, the logo tile |
| You are here | Scnx Blue indicator + primary subtle fill | Navigation active item, selected Tab, TOC rail |
| Checked or on | Scnx Blue fill | Checkbox, Radio, Switch, Progress |
| Selected among peers | Raised material (no blue) | SegmentedControl thumb, current Pagination page |
| Focus | 2px Scnx Blue outline, 2px offset | Every focusable element |
| Status | Scheme fill + word or icon | Badge, Alert, Toast |
| Destruction | Danger solid, only on the confirming action | Dialog confirm, danger menu item text |

## Type

- One family: Inter (variable, `wght` 100–900 and `opsz`), from `fonts/`, with `font-feature-settings: "cv11" 1` (the single-storey a) and `font-optical-sizing: auto`. Code and eyebrows use the system mono stack (`mono`).
- Product type: `heading-*` (bold, −0.02em from `heading-large` up), `body-*`, `label-*`, `data-compact` for tables, `metric-display` for dashboard numbers. Docs and marketing add `display-1` to `display-3`, fluid with `clamp()`.
- Body copy in product is `body-small` (14px) in dense UI (alerts, menus, tables, descriptions) and `body-default` (16px) in forms and reading; long-form docs use `article-readable` (1.75 leading).
- Buttons and tabs set `label-default` at semibold or medium; never uppercase a label except through the eyebrow or Text's `label-small`.

## Space, size and layout

- Spacing is semantic: `ds-dimension-spacing-inline-*` between siblings on a line (4, 8, 16), `-stack-*` between blocks (4, 8, 16), `-inset-*` inside containers (8, 16, 24), `-page` 24 and `-section` 32.
- Controls are 28, 36 or 44px tall with inline padding of half the height minus 6 (8, 12, 16). Rows in menus, listboxes, navigation and pagination are 32px; table body rows are 44px. No pointer target is smaller than 24px. These sizes are component geometry, recorded in each component's specification, not tokens (ADR-UIP-VIS-001 item 6); `components/bundle.css` draws them as local `--scnx-size-*` properties.
- Shells: EdgeLayout (Navbar 64px, Sidebar 280px, all on the canvas, hairline-separated) for dense internal tools; FloatingLayout (Sidebar and content as raised materials 8px apart on the stage ground) for the client-facing product. Layout primitives (Box, Container, Flex, Grid, Stack) only arrange; they carry no look.

## Materials, rings and shadows

- Rings, not borders: containers draw their 1px edge as part of the material's `box-shadow`, so nesting and overflow never shift layout. Hairlines between rows and regions are inset 1px shadows in `ds-color-neutral-border-subtle-default`.
- Controls keep a real 1px border: inputs and checkboxes use `ds-color-neutral-border-strong-default` (≥3:1, WCAG 1.4.11); the secondary Button uses `ds-color-neutral-border-default-default`.
- One shadow per stack: a raised card inside a panel becomes flat; cards inside FloatingLayout content are flat.
- Dark mode lifts floating materials with a lit top edge (an inset 1px white at 6%) because shadows read weakly on dark grounds; the ring also brightens.
- The built `ds-effect-shadow-*` tokens remain for existing components; new work uses `ds-effect-material-*`.

## States and focus

- Hover changes the fill one step (`*-hover` tokens), never a filter or opacity. Pressed uses `*-pressed` and sinks 1px. Disabled uses the `*-disabled` pair at full opacity (exempt from 1.4.3, kept at 2.5:1) and the not-allowed cursor; disabled controls do not react.
- Focus is always visible: `outline: 2px solid ds-color-primary-border-default-focus; outline-offset: 2px`, following the element's radius. Inputs draw it flush (offset 0) and turn their border blue.
- Selected rows take `ds-color-primary-surface-subtle-default`; highlighted menu rows take `ds-color-neutral-surface-default-hover`.

## Motion

- `ds-motion-feedback-*` (150ms) for hover, press and floating materials; `-disclosure-*` (300ms) for accordions, sidebars and chevrons; `-enter-*` (300ms) and `-exit-*` (200ms, always shorter) for dialogs and sheets; `-attention-*` only for a rare nudge.
- Move things 4px or less; never bounce, never scale content. Reduced motion removes movement and keeps fades.

## Components

- Families in the current build: Button, IconButton, Badge, Alert, TextField, Divider, Code, Heading, Text, List, Accordion, Tabs, Dialog, Navbar, Navigation, Sidebar, TableOfContents, CodeShowcase, CodeSelect, EdgeLayout, FloatingLayout (plus Transition and the layout primitives, which carry no look). Each card lists its delta from the current build: build to the card.
- Intentional additions (planned, each card says what it becomes): Surface (the material primitive), Link, Kbd, Textarea, Select, Checkbox, Radio, Switch, SegmentedControl, Toast, Progress, Spinner, Skeleton, Tooltip, Popover, Menu, Sheet, Breadcrumb, Pagination, Table, Avatar — the P1 inventory a client dashboard needs.
- `components/bundle.css` is the reference stylesheet: the `.scnx-*` classes and `data-*` options of every card, bound only to tokens. Three mode roles live there because they choose a different token per mode: `--scnx-stage-ground`, `--scnx-stage-dot` and `--scnx-thumb`.
