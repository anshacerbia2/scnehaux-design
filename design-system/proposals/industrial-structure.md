# Proposal: the industrial structure

> **Status: proposal, non-normative (ADR-UIP-VIS-002). Revision 3, 2026-10-26.**
> Revision 1 (2026-10-25) fixed structure in every theme and let a theme supply only
> colours (scnehaux-architecture#131). Revision 2 (the same day) replaced it: components
> carry no design of their own, every presentational value is open through two paths,
> and what must hold is guarded as a floor; ADR-UIP-VIS-001 revision 3 and
> STD-UIP-TKN-001 2.7.0 record that (scnehaux-architecture#132), and ui-platform has
> built most of it. Revision 3 adds what revision 2 left open: **how themes are named,
> which brand book a product reads, and the shape of the second theme** (items 6 to 8
> and [Themes, names and brand books](#themes-names-and-brand-books)). It binds nothing
> until STD-UIP-TKN-001 and ADR-UIP-VIS-002 record it.

The owner's direction for revision 3, in their words:

- "yg industrial itu akan gw pake buat scnehaux platform, iam, ai-runtime, dll" (the
  industrial theme is for the Scnehaux platform, IAM, AI runtime and the rest).
- "achromatic itu tokennya untuk design ini" (achromatic holds the tokens of the
  docs-site design, now `scnx-saas/`).
- "mungkin yg industrial diganti code name scnx-platform dan yg achromatic diganti jadi
  scnx-saas" (industrial becomes `scnx-platform`, achromatic becomes `scnx-saas`).
- "brandbook artinya per theme kan bukan lagi per product" (a brand book is per theme,
  no longer per product).

The owner's direction for revision 2:

- "styled component dilarang mengapply radius atau apapun property yg mengacu ke
  spesifik design ... jadi agnostic" (a styled component applies no radius, nor any
  property tied to a specific design such as glassmorphism or neumorphism).
- "tier 3 untuk radiusnya ngelock ke tier 2 radius yg by defaultnya 0 di theme
  industrial ... klo butuh keseragaman besar maka theme harus set tier 2 radiusnya"
  (tier 3 locks to tier 2, which is 0 in industrial; uniform change goes through the
  theme's tier 2).
- "ga perlu ada yg di lock lagi ... semua radius, spacing dll kebuka" (nothing else
  needs locking; radius, spacing and the rest are open).
- "variable tier 3 ... ganti jgn --ds lagi" (tier 3 gets its own prefix).
- "tetap mengacu ke modern solution ... 5 - 10 tahun" (modern solutions, for a
  five-to-ten-year system).

## The decision

1. **Components are design-agnostic.** A styled component's CSS holds no design value.
   Every presentational property reads a component hook (Tier 3) that falls back to
   a semantic token (Tier 2). The theme decides the look.
2. **Industrial is the default theme, and it is square.** `dimension.radius.mark` …
   `panel` are 0; `pill` is fully rounded for shapes whose roundness carries meaning;
   on-page materials are a 1px ring. The theme `default` is renamed `industrial`.
3. **Two paths change a value, and a third is the system's:**
   - **Product-wide, through the theme.** A theme maps any Tier-2 key to Tier-1
     values: radius, spacing, size, type, motion, materials, colour. A product with
     fully rounded buttons, or 6 to 8px corners, sets `dimension.radius.control` in
     its theme.
   - **Local, through a component hook.** A product sets a Tier-3 hook on a scope, for
     example `.promo { --scnx-button-radius: 9999px; }`. The product owns the result.
   - **A system variant**, for a shape that carries meaning and that ui-platform tests,
     for example `data-shape="circular"` on an icon-only Button.
4. **Nothing presentational is locked. What must hold is a guarded floor** (below):
   the component enforces it in its own CSS, so no theme or hook can break it.
5. **Two prefixes at runtime.** Tier 1 is a compiler input and is never emitted as a
   CSS variable (ADR-GLB-FE-010). Tier 2 is `--ds-*`. Tier 3 is
   `--scnx-{component}-{part?}-{property}-{state?}`, the component namespace already
   used by `.scnx-*` classes and `data-scnx-*` attributes. A hook name has no variant
   segment; a product changes one variant by setting the hook on `[data-variant]`
   within its scope (the owner's decision A, 2026-10-25, recorded in ui-platform's TDD
   styled-004 as HK5).
6. **A theme is named after who owns the look, never after a trait.** The two shipped
   themes become `scnx-platform` (was `industrial`: the Scnehaux platform, IAM, AI
   runtime, organization, the docs) and `scnx-saas` (was `achromatic`: the SaaS
   products). The prefix `scnx-` is reserved for themes `@scnx/system` ships; a product's
   or a client's theme takes its own name (`northwind`). Mode stays its own axis and is
   never part of a theme's name.
7. **A brand book belongs to a theme, not to a product.** Products on one theme read one
   brand book; a product that needs a different look gets a new theme and, with it, a
   brand book. What every theme shares (the name and the mark, the voice, the icons) is
   written once, on a brand page that each brand book links to.
8. **`scnx-saas` takes the shape of its boards.** It maps the concentric radius ladder
   and the soft material shadows that the `scnx-saas/` boards are drawn with. Revision 1
   removed them from `achromatic` because a theme then supplied only colour; revision 2
   lifted that rule, and the design that owns the theme needs them back.

## Why

- **One look per product, from one place.** Fluent UI React v9 themes by remapping its
  alias (semantic) layer, with no component layer at all [8]; a product's uniform look
  belongs in the theme, not in every instance.
- **A local change without a fork.** Spectrum CSS, Salesforce SLDS 1 and Material Web
  each give a component its own custom properties that fall back to the system's
  tokens [5][6][7]. That is how a product adjusts one component without selecting its
  classes.
- **Floors instead of locks.** The old reasons to fix a value were often the
  technology: compile-time Sass themes, hand-managed z-index, global breakpoints. The
  platform now covers those (cascade layers, the top layer, container queries), so
  the remaining locks are the ones accessibility and meaning need, and modern CSS can
  enforce those inside the component (`max()`, `prefers-reduced-motion`).

## Tier 3: the component hook

```css
.scnx-btn {
  border-radius: var(--scnx-button-radius, var(--ds-dimension-radius-control));
  min-block-size: max(24px, var(--scnx-button-height, var(--ds-dimension-size-control-medium)));
}
```

The size token in the example is illustrative: control heights are component geometry
today, and moving them to Tier 2 is part of this change.

- **Referenced, never declared.** The package emits no Tier-3 declaration. A hook costs
  bytes in the component's CSS, not in the token file, and holds no value on any
  element until a product sets it. Spectrum CSS works the same way: token-driven
  properties "are mapped to empty `--mod` prefixed variables (for customization) with
  a fallback to variables prefixed with `--spectrum`" [5]; SLDS 1 writes
  `border-radius: var(--slds-c-badge-radius-border, 15rem);` [6].
- **Never registered with `@property`.** A registered property always has an initial
  value, so its `var()` fallback would never apply and the hook would cut the link to
  Tier 2.
- **A hook is public API.** SLDS 2 does not support component-level hooks, and
  Salesforce's guidance is to replace them with global hooks where possible [6]. Each
  hook is a contract to keep, so a component lists its hooks in its `*.spec.json`.
  The standards already bound them by review, not by count: each alias records "the
  component purpose, Tier-2 fallback, theme/state coverage, and migration impact. A
  numerical cap and an ADR for each alias are not required" (STD-UIP-TKN-001, Component
  Alias Review), and aliases "are justified by independent component semantics, not by
  an arbitrary numeric quota" (STD-UIP-TKN-002). This change keeps that rule; only the
  prefix moves from `--ds-` to `--scnx-`.
- **Set it on a scope, not on `:root`, when it changes at runtime.** In a document of
  about 42,000 elements, a write to a custom property on `:root` measured about 77ms,
  "independent of what reads the variable", against about 0.5ms on the consuming
  element [10]. The count of variables matters less: in GitLab's test, custom
  properties against none changed rendering by 10ms (1.8%), and three levels of
  properties added about 14% overall, attributed to the larger style block's download,
  not to rendering [9].

## Guarded floors

Each floor holds in every theme and under every hook. The component enforces it where
CSS can; the gate checks the rest.

| Floor | How it is guarded | Why |
| :-- | :-- | :-- |
| Target size at least 24px | `max(24px, …)` on the interactive box | WCAG 2.2, 2.5.8 [12] |
| A visible focus indicator | A minimum outline width with `max()`; its colour pair in the contrast gate | WCAG 2.2, 2.4.7 and 2.4.11 [12] |
| Contrast of every declared colour pair | The theme gate, per theme and mode | WCAG 2.2, 1.4.3 and 1.4.11 [12] |
| Reduced motion | Components drop movement under `prefers-reduced-motion`, whatever the motion tokens say | WCAG 2.2, 2.3.3 [12] |
| Shapes that carry meaning | The radio indicator, the switch thumb, the status dot and the spinner are anatomy, not hooks | A radio must not read as a checkbox; Radix Themes never fully rounds a checkbox for that reason [4] |
| State mechanics | Which states exist, disabled controls not reacting | Behaviour, not look |

Two older locks become unnecessary: overlays use the top layer (`<dialog>`, the Popover
API), so the browser orders them; and components respond to their container with
container queries, not to global breakpoints.

**Who tests what.** ui-platform certifies the themes it ships (`scnx-platform`,
`scnx-saas`) in every mode. A product's own theme or hooks run the same gates (contrast
and floors) in that product's CI. With one square theme and one rounded theme shipped,
the gate also proves that every component follows a theme's shape through its hooks:
a component that stays square under `scnx-saas` still holds a literal.

## Themes, names and brand books

| Theme id | Was | Used by | What it maps | Brand book |
| :-- | :-- | :-- | :-- | :-- |
| `scnx-platform` | `industrial` (until 2026-10-25 `default`) | The Scnehaux platform: IAM, AI runtime, organization, the docs | The Scnx Blue palette; square (radius 0, `pill` for meaningful shapes); ring materials | `scnx-platform/Brand-Book.html` |
| `scnx-saas` | `achromatic` | The SaaS products | An ink palette; the concentric ladder (`mark` 4, `element` 8, `control` 12, `container` 16, `panel` 24, plus `pill`); materials with their soft shadows and, in dark mode, a lit top edge | `scnx-saas/Brand-Book.html`; until it is drawn, `design-system/README.md` |

The shape values for `scnx-saas` are the ones its boards were drawn with, in the
earlier snapshot `design-system/themes/default/tokens.css`. ui-platform is before v1, so
both ids change without a compatibility alias (TDD tokens-003, "Rollout and
Compatibility").

**Naming rules.**

- **Named after the owner of the look.** A name that describes a trait stops being true
  the day the theme maps another Tier-2 key: `industrial` would be wrong the day it
  gains a 4px corner, `achromatic` the day it gains an accent. The large systems name a
  complete look after its product or brand: Adobe Spectrum ships the systems
  `spectrum`, `express` (Adobe Express) and `spectrum-two` [15]; Fluent UI ships
  `webLightTheme` and `teamsLightTheme` (Microsoft Teams) [16]; SLDS 2 ships
  Salesforce Cosmos [17]. Trait words are kept for values within an axis: `light`,
  `dark`, `large`, `highContrast`.
- **`scnx-` marks a shipped theme.** Only `@scnx/system` names a theme `scnx-*`. A
  product or client theme takes its own name, so it can never collide with a shipped
  theme, and a file such as `tokens/css/scnx-saas.css` or a Figma mode reads as
  first-party where no attribute gives the context. The attribute reads
  `data-scnx-theme="scnx-saas"`; the repetition is the price of the namespace.
- **A theme is not a product.** A product picks a theme. A new theme is made only when a
  product needs a different look, which keeps the count of themes, and of brand books,
  at the count of looks.
- **Mode is an axis, not a name.** Spectrum keeps `color` and `scale` apart from the
  system [15]; Atlassian keeps `colorMode` apart from the theme ids it sets for
  spacing, typography and shape [18]; the DTCG Resolver Module expresses each such axis
  as a modifier, and the resolutions are the product of their contexts [13]. Structure
  and colour are not split into separate axes now: no product needs to mix them yet,
  and the Resolver can add that modifier later without renaming a theme.

**Brand books.** A brand book documents a theme's look. Products on one theme read the
same brand book. A product may keep thin notes in its own repository (its terms, its
domain patterns, the hooks it sets); they add to the theme's brand book and never
change its rules. What every theme shares is on one brand page, `brand/Brand.html`: the
name and the mark, whose check stays Scnx Blue in every theme because it is artwork,
not a token; the voice and the copy rules; the icon grammar.

## The docs

- **The primitives page** draws structure and states in the docs' style, with no theme.
- **A styled component page** shows the component as it ships, with a Theme × Mode
  switch. A theme may now change shape as well as colour; the switch shows it.
- **Each component page lists its hooks:** the hook (`--scnx-*`), the Tier-2 token it
  falls back to, its value in the current theme, and the floors that bound it. The list
  comes from the component's `*.spec.json`.

## Looking ahead (five to ten years)

- **DTCG 2025.10.** The Resolver Module expresses permutations such as theme × mode ×
  another axis as sets and modifiers [13]; STD-UIP-TKN-001 already targets DTCG
  2025.10. Theme remapping belongs there.
- **Container style queries** are Baseline since Firefox 151 (May 2026) [11]. A variant
  can read a custom property instead of adding a class.
- **`corner-shape`** (`squircle`, `superellipse()`) is in Chromium 139 and later, not
  yet in Firefox or Safari [14]. The radius family can add a corner-shape token later,
  as a progressive enhancement over `border-radius`.

## The mono (separable)

IBM Plex Mono 400, 500 and 600 as the system mono (`--font-mono`, `typography.code.*`),
served from the package with its licence (SIL OFL 1.1; the files are in
`design-system/fonts/`). It can ship on its own. Until it does, the docs chrome uses its
own mono (`--sq-mono`) and product code keeps the system mono.

## What changes, and where

Revision 2, checked against each repository's `main` on 2026-10-26:

| Repository | Change | State |
| :-- | :-- | :-- |
| `scnehaux-architecture` | ADR-UIP-VIS-001 revision 3 (guarded floors; a theme maps any Tier-2 key; industrial square as values, not a rule). STD-UIP-TKN-001 2.7.0 (guarded floors; Tier-3 hooks under `--scnx-`, referenced with a fallback, never declared, never registered; the review rule kept). | Done (#132) |
| `ui-platform` | Hooks and floors in component CSS (`hook()`, `target-floor()`); the hook gate; hooks with review records in each `*.spec.json`; control sizes in Tier 2; the industrial values; `default` → `industrial`; full class names; Panda recipes on hooks. | Done for 12 styled components (#127 to #133). CodeSelect, CodeShowcase, Navigation, Sidebar, EdgeLayout and FloatingLayout are on the branch `feat/hooks-entries`, not yet in a pull request |
| `ui-platform` | A system variant for a meaningful shape (`data-shape="circular"`). | Not started |
| `ui-platform` | TableOfContents takes a controlled `activeId`, so a page can make it agree with its own "here". | Not started |
| `ui-platform-docs` | Component pages list hooks, fallbacks and floors; the Theme × Mode switch may change shape. | Not started; the pin is `9938a60`, before the hooks |
| `scnehaux-design` | Pages read the package's tokens (`scripts/sync-tokens.mjs`); the bridge is deleted. | Done (#26). The cards still use the earlier snapshot |

Revision 3:

| Repository | Change |
| :-- | :-- |
| `scnehaux-architecture` | STD-UIP-TKN-001: theme naming (an id names the owner of the look; `scnx-` reserved for shipped themes; mode never in the id), and the ids `scnx-platform` and `scnx-saas`. ADR-UIP-VIS-001 item 7: the shipped themes by their new ids. ADR-UIP-VIS-002: the repository's layout (`brand/`, `scnx-platform/`, `scnx-saas/`, `others/`, and the redirects in `concepts/`), a brand book per theme and the shared brand page, and tokens synced from the package's emitter at a pinned commit (`design-system/vendor/scnx-system/`) in place of a hand-made snapshot. |
| `ui-platform` | Rename `industrial` → `scnx-platform` and `achromatic` → `scnx-saas` (folders, ids, emitted files, Figma modes, tests). `scnx-saas` maps the concentric ladder and the material shadows above; correct the comment in its token file, which still says a theme supplies colour only (STD-UIP-TKN-001 2.6.0). The theme gate rejects a theme id that takes the `scnx-` prefix without shipping in the package. |
| `ui-platform-docs` | Pin the renamed package; the Theme × Mode switch lists `scnx-platform` and `scnx-saas`. |
| `scnehaux-design` | Bump the sync pin and sync both themes; draw `scnx-saas/Brand-Book.html` from `design-system/README.md` and its boards; re-render the cards from the package. Signatures 1 and 2 of `design-system/README.md` (the concentric ladder, materials) stay: they are `scnx-saas`'s look. |

## References

Retrieved 2026-10-25.

1. IBM Carbon, Themes: <https://carbondesignsystem.com/elements/themes/code/>. Its
   themes (White, Gray 10, Gray 90, Gray 100) are colour sets.
2. IBM Carbon, Button style: <https://carbondesignsystem.com/components/button/style/>.
   It lists padding and heights and no radius.
3. Revision 1 of this proposal and ADR-UIP-VIS-001 revision 2: scnehaux-architecture#131.
4. Radix Themes, Radius: <https://www.radix-ui.com/themes/docs/theme/radius>. "A
   Checkbox will never become fully rounded", so it is not mistaken for a Radio.
5. Adobe Spectrum CSS, README: <https://github.com/adobe/spectrum-css>. The `--mod`
   custom properties and their `--spectrum` fallback.
6. Salesforce Lightning Design System. Styling hooks (SLDS 1):
   <https://v1.lightningdesignsystem.com/platforms/lightning/styling-hooks/>.
   SLDS 2 and component-level hooks:
   <https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties>
   and <https://lightningdesignsystem.com/dev-guidelines/best-practices>.
7. Material Web. Button theming: <https://material-web.dev/components/button/>
   (`--md-elevated-button-container-shape`, default `--md-sys-shape-corner-full`).
   Shape: <https://material-web.dev/theming/shape>.
8. Microsoft Fluent 2, Design tokens: <https://fluent2.microsoft.design/design-tokens>
   (global and alias tokens). Fluent UI v9 token notes:
   <https://hackmd.io/@fluentui/SkjrGU6To>.
9. GitLab, Investigate performance impact of many CSS variables:
   <https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/issues/2344>.
10. Sim, "perf(workflow): scope resize CSS-var writes to the container, not :root":
    <https://github.com/simstudioai/sim/pull/5738>.
11. web.dev, New to the web platform in May 2026:
    <https://web.dev/blog/web-platform-05-2026> (container style queries, Firefox 151).
12. W3C, Web Content Accessibility Guidelines 2.2: <https://www.w3.org/TR/WCAG22/>.
13. Design Tokens Community Group, Resolver Module 2025.10 (Final Community Group
    Report, 2025-10-28):
    <https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/>.
14. Smashing Magazine, "Beyond border-radius: What the CSS corner-shape property
    unlocks for everyday UI" (March 2026):
    <https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/>.

Retrieved 2026-10-26 (revision 3).

15. Spectrum Web Components, Theme: <https://opensource.adobe.com/spectrum-web-components/tools/theme>.
    Systems `spectrum`, `express`, `spectrum-two`; color `light`, `dark`; scale
    `medium`, `large`.
16. Fluent UI, `@fluentui/tokens` exports:
    <https://cdn.jsdelivr.net/npm/@fluentui/tokens/dist/index.d.ts> (`webLightTheme`,
    `webDarkTheme`, `teamsLightTheme`, `teamsDarkTheme`, `teamsHighContrastTheme`,
    `createLightTheme`).
17. Salesforce Trailhead, Plan your transition from SLDS 1 to SLDS 2:
    <https://trailhead.salesforce.com/content/learn/modules/salesforce-lightning-design-system-2-for-admins/plan-your-transition-from-slds-1-to-slds-2>
    (Salesforce Cosmos, the default SLDS 2 theme).
18. Atlassian Design, Tokens in code: <https://atlassian.design/components/tokens/code>
    (`setGlobalTheme`: `colorMode`, `light`, `dark`, `spacing`, `typography`, `shape`).
