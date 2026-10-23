# Navigation

Navigation is the list of destinations inside a Sidebar: groups with eyebrow headers, 32px items, nested groups on a hairline rail.

## Usage

- Provide groups (an eyebrow `header`) of items (`href`, `label`, 16px `icon`, optional count, optional nested group); mark the current item `data-active` with `aria-current="page"`.
- Items are 32px (`ds-dimension-size-row`), radius element 8, body-small in subtle text; hover `ds-color-neutral-surface-subtle-hover`.
- The active item: `ds-color-primary-surface-subtle-default` fill, `ds-color-primary-text-subtle-default` text, semibold, and a 2px Scnx Blue bar at the start edge. Blue means "you are here".
- Counts are tabular, in subtle text, never a solid badge.

## Delta from the current build

- Items fixed at 32px with radius element (was control); nested groups hang on a 1px rail.
- Group headers become eyebrows (mono, uppercase, +0.12em) instead of bold label-small.
