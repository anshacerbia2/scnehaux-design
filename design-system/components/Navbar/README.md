# Navbar

Navbar is the top bar of an application shell: brand at the start, primary destinations in the center, actions at the end.

## Usage

- Provide `start` (the mark and product name), `center` (3–6 links, the current one with `aria-current="page"`), `end` (search, a small primary action, the account Avatar).
- Default: 64px, canvas fill, bottom hairline. `variant="floating"`: the menu material, 56px, inset 8px from the viewport on the stage — the marketing and docs header.
- Links are 28px pills (radius element) in subtle text; the current link turns default text and medium weight. Location in the top bar is never blue; blue location lives in the sidebar and tabs.

## Delta from the current build

- New `floating` variant (menu material); links become 28px radius-element pills.
- Bottom border becomes an inset hairline.
