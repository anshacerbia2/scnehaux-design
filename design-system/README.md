> **Status: reference, non-normative (ADR-UIP-VIS-002).** The binding rules are ADR-UIP-VIS-001 (materials, the concentric ladder, ink acts and blue signals, the stage, type voice, geometry) and STD-UIP-TKN-001 (token grammar); a component's contract is its specification in `ui-platform`. The brand books restate those records and add nothing binding. The motion signature "the rise" is **guidance** until an ADR or STD revision records it; so are the voice, the icon grammar and the mark.

# Scnehaux UI, the design system

Scnehaux UI is an accessible React design system with perceptual color, scoped multi-brand theming and zero runtime CSS, and every release ships with the evidence that it works. Its components carry no design of their own: every presentational property reads a component hook (`--scnx-*`, Tier 3) that falls back to a semantic token (`--ds-*`, Tier 2), and each theme maps the Tier-2 keys ([the industrial structure](proposals/industrial-structure.md), revision 3).

## Where the rules are

The rules of a look live in its theme's brand book, as a live page drawn on that theme's tokens. What every theme shares is written once, on the brand page.

| What | Where |
| :-- | :-- |
| The name and the mark, the voice and the copy rules, the icon grammar | [`brand/Brand.html`](../brand/Brand.html) |
| The `scnx-saas` look (the SaaS products): the six signatures, materials, the concentric ladder, the ink palette, the stage, type, space, states, motion | [`scnx-saas/Brand-Book.html`](../scnx-saas/Brand-Book.html) |
| The `scnx-platform` look (the platform and the docs): one line drawing, square, the ruler scrollbar | [`scnx-platform/Brand-Book.html`](../scnx-platform/Brand-Book.html) and [`SCROLL.md`](../scnx-platform/SCROLL.md) |

This file held the `scnx-saas` rules until its brand book was drawn. They are now in the brand book, checked against the package. Two things changed on the way:

- Signature 3 reads **"ink acts, and marks the place"** under `scnx-saas`. That theme maps the primary scheme to ink, so focus, links, checked controls and "here" are ink. Scnx Blue stays the primary scheme of `scnx-platform`, and the check in the mark is Scnx Blue in every theme.
- The themes are `scnx-platform` and `scnx-saas`, each with a light and a dark mode. The ids `light`, `dark`, `achromatic-light` and `achromatic-dark` are gone.

## This folder

- `components/<Name>/`: one card per component (`preview.html`, `README.md`), the same in every theme. Each README gives usage and the delta from the current build, or "Planned".
  - Families in the current build: Button, IconButton, Badge, Alert, TextField, Divider, Code, Heading, Text, List, Accordion, Tabs, Dialog, Navbar, Navigation, Sidebar, TableOfContents, CodeShowcase, CodeSelect, EdgeLayout and FloatingLayout, plus Transition and the layout primitives, which carry no look. Build to the card.
  - Intentional additions (planned; each card says what it becomes): Surface (the material primitive), Link, Kbd, Textarea, Select, Checkbox, Radio, Switch, SegmentedControl, Toast, Progress, Spinner, Skeleton, Tooltip, Popover, Menu, Sheet, Breadcrumb, Pagination, Table and Avatar. They are the P1 inventory a client dashboard needs.
- `components/bundle.css`: the reference stylesheet. It holds the `.scnx-*` classes and the `data-*` options of every card, bound only to tokens. Three mode roles live there because they choose a different token per mode: `--scnx-stage-ground`, `--scnx-stage-dot` and `--scnx-thumb`.
- `vendor/scnx-system/`: `@scnx/system`'s tokens and fonts for both themes, synced byte for byte (`npm run sync:tokens`; `SOURCE.json` records the commit).
- `rendered/<theme>/`: every card in each theme and mode, rendered from `vendor/scnx-system/` (`npm run render:cards`). The earlier hand-made snapshot they were drawn with is kept only for the old Instrument boards, as `others/docs-instrument/tokens.css`.
- `proposals/`: the industrial structure.
