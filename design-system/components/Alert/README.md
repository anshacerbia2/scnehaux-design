# Alert

Alert is an inline message about the current page; it stays until its cause is resolved.

## Usage

- Provide `scheme` (`info` default, `success`, `warning`, `danger`, `neutral`), `title`, `children` (one or two sentences), an `icon` and optional `actions` (small secondary Buttons, never a bare text link: 24px targets).
- `role` is `status` by default; use `alert` only for errors that interrupt.
- Fill `ds-color-<scheme>-surface-subtle-default`, ring `ds-color-<scheme>-border-subtle-default`, body in the scheme's subtle text, title in its default text. Radius container 16.
- A message about something that just happened elsewhere is a Toast.

## Delta from the current build

- Radius `container` changes from 8px to 16px.
