# Badge

Badge labels status or metadata in one or two words; it never acts.

## Usage

- Provide `children`, `scheme` (neutral, primary, info, success, warning, danger), `emphasis` (`subtle` default, `solid`) and `size` (`medium`, `small`).
- `subtle`: the scheme's component fill under its subtle text (≥4.5:1). `solid`: the scheme's solid fill under its contrast label. Use solid sparingly, once per row at most.
- Live status takes a leading 6px dot in `currentColor` and a word ("Live", "Failed"); color is never the only cue.
- Radius element 8 at medium (22px tall), mark 4 at small.

## Delta from the current build

- Radius `element` changes from 4px to 8px; small badges use the new `mark` (4px).
- New optional `dot` part for live status.
