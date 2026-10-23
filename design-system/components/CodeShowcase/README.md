# CodeShowcase

CodeShowcase pairs a live example on the stage with its source, a view switch, a language select and copy.

## Usage

- Provide `preview` (the rendered example), `code` per language, and optional `defaultView`.
- The frame is the flat material; the preview sits on the stage (tinted ground and the 22px dot grid); the nav row is 44px with a small SegmentedControl, a small CodeSelect and a ghost copy IconButton; code sits in a sunken well, code-small at 1.7 line height.
- Syntax colors come from tokens: keywords `ds-color-primary-text-subtle-default`, strings `ds-color-success-text-subtle-default`, comments `ds-color-neutral-text-subtle-default`.

## Delta from the current build

- The conic checkerboard preview becomes the stage dot grid; the container becomes the flat material at radius 16 and loses its hover shadow.
