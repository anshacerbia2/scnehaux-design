# Proposal: the industrial structure

> **Status: proposal, non-normative (ADR-UIP-VIS-002). Revision 2, 2026-10-25.** It
> binds nothing until ADR-UIP-VIS-001 revision 3 and STD-UIP-TKN-001 2.7.0 record it.
> Revision 1 (the same day) fixed structure in every theme and let a theme supply
> only colours; ADR-UIP-VIS-001 revision 2 and STD-UIP-TKN-001 2.6.0 recorded that
> (scnehaux-architecture#131). Revision 2 replaces it: components carry no design of
> their own, every presentational value is open through two paths, and what must hold
> is guarded as a floor, not locked as a value.

The owner's direction, in their words:

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
   `--scnx-{component}-{part?}-{property}`, the component namespace already used by
   `.scnx-*` classes and `data-scnx-*` attributes.

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
  hook is a contract to keep, so a component lists its hooks in its `*.spec.json`,
  and the budget in STD-UIP-TKN-002 §3.5 (five aliases per component, each with a
  review record) is revisited for this change. Open question for the owner: keep five,
  or set a new budget.
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

**Who tests what.** ui-platform certifies the themes it ships (`industrial`,
`achromatic`) in every mode. A product's own theme or hooks run the same gates (contrast
and floors) in that product's CI.

## Themes after the change

| Theme id | Was | What it maps |
| :-- | :-- | :-- |
| `industrial` | `default` | The Scnx Blue palette; square (radius 0, `pill` for meaningful shapes), ring materials |
| `achromatic` | `achromatic` | An ink palette; its radius and shadow overrides were removed in revision 1 and stay removed by choice, not by rule |

A brand theme may map any Tier-2 key. ui-platform is before v1, so the id changes
without a compatibility alias (TDD tokens-003, "Rollout and Compatibility").

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

| Repository | Change |
| :-- | :-- |
| `scnehaux-architecture` | ADR-UIP-VIS-001 revision 3: item 6 (structural invariants) becomes the guarded floors; item 7 (a theme supplies colour only) becomes "a theme maps any Tier-2 key"; item 2 keeps industrial square as the default theme's values, not a rule; Alternatives Considered gains revision 2's theme-invariant structure, with the reason. STD-UIP-TKN-001 2.7.0: "Theme-invariant structure" becomes "Guarded floors"; "Cascading Overrides" lets a brand theme override any Tier-2 key; a Tier-3 section (prefix `--scnx-`, referenced with a fallback, never declared, never registered). STD-UIP-TKN-002: the hook budget (§3.5). |
| `ui-platform` | Component CSS reads `var(--scnx-{component}-{property}, var(--ds-…))` for every presentational property, with no literal design values; floors in component CSS (`max()`, reduced motion); the theme gate checks contrast and floors, not identical structure; industrial values (radius 0, ring materials); `default` → `industrial`; hooks listed in each `*.spec.json`; control sizes moved to Tier 2; class names on the full component name (`.scnx-btn` → `.scnx-button`), before v1. |
| `ui-platform-docs` | Until the package ships the industrial values, the bridge in `square.css` sets them as a theme would (Tier 2 at the root). Component pages list hooks, fallbacks and floors; the Theme × Mode switch may change shape. |
| `scnehaux-design` | After the package ships: regenerate the token snapshot (ADR-UIP-VIS-002), rename `themes/default/` to `themes/industrial/`, re-render the cards, rewrite signatures 1 and 2 of the brand book, and delete the bridge. |

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
