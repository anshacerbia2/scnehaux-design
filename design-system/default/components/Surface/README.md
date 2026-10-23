# Surface

Surface is the material primitive: every container in Scnehaux UI is one of eight materials, never an ad-hoc mix of fill, border and shadow.

A material binds four things at once: a fill token, a radius token, a ring and a shadow (`ds-effect-material-*`). The ring is a 1px `box-shadow` stroke, so nesting and overflow never shift layout.

## On the page

| Material | Fill | Radius | Shadow | Use for |
|---|---|---|---|---|
| flat | `ds-color-neutral-surface-raised-default` | `ds-dimension-radius-container` | `ds-effect-material-flat` | Tables, code frames, inline cards, accordions |
| raised | `ds-color-neutral-surface-raised-default` | `ds-dimension-radius-container` | `ds-effect-material-raised` | Cards, interactive tiles, the segmented thumb |
| panel | `ds-color-neutral-surface-raised-default` | `ds-dimension-radius-panel` | `ds-effect-material-panel` | Dashboard and landing panels on the stage |
| well | `ds-color-neutral-surface-sunken-default` | container (or the parent's radius minus its padding) | none | Code wells, inner insets |

## Above the page

| Material | Fill | Radius | Shadow | Use for |
|---|---|---|---|---|
| tooltip | ink (`ds-color-neutral-surface-solid-default`) | `ds-dimension-radius-element` | `ds-effect-material-tooltip` | Tooltips only |
| menu | `ds-color-neutral-surface-floating-default` | `ds-dimension-radius-container` | `ds-effect-material-menu` | Menus, select listboxes, popovers, toasts |
| modal | floating | `ds-dimension-radius-panel` | `ds-effect-material-modal` | Dialogs |
| sheet | floating | `ds-dimension-radius-panel` (leading corners) | `ds-effect-material-sheet` | Drawers, bottom sheets |

## Usage

- Provide `data-material` (`flat`, `raised`, `panel`, `well`) and `data-padding` (`compact` 8, `default` 16, `comfortable` 24). Children are yours.
- Nest concentrically: a child's radius is the parent's radius minus the parent's padding. Panel 24 with 8 padding holds a container 16; container 16 with 4 padding holds a control 12.
- Floating materials enter with a 4px rise and a fade in `ds-motion-feedback-duration`; they never carry a stem or arrow.
- Do not stack two shadows: a raised card inside a panel becomes flat.
- Do not put a raised material on a raised material; use a well or flat inside.

## Status

Planned (intentional addition). Build it to this card: a `Surface` component in @scnx/system with `material` and `padding` props, the eight `ds-effect-material-*` tokens and `ds-dimension-radius-panel` in the token build (TDD tokens revision).
