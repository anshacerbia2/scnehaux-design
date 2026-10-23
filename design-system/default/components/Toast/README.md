# Toast

Toast confirms something that just happened, away from where the user is looking; it leaves on its own.

## Usage

- Provide `title`, optional `description`, `scheme` (`neutral`, `success`, `danger`), up to two small actions and a dismiss IconButton.
- Menu material (floating fill, radius container 16, `ds-effect-material-menu`), 360px wide, stacked bottom-end with 8px gaps; enters with the 4px rise.
- Success and neutral toasts auto-dismiss after 5s (paused on hover and focus); danger toasts stay until dismissed. Never put the only path to an action in a toast.

## Status

Planned (intentional addition). Build it to this card: a `Toast` region (`role="region"` with live announcements) in @scnx/system.
