# Scroll behaviour · Instrument · Square

Everything that moves, appears or changes as the page scrolls, in the order a reader
meets it. Values are taken from the code: `square.js` and `square.css` in this folder,
and `../docs-instrument/instrument.js`, which still runs here.

> **Status: guidance (ADR-UIP-VIS-002).** These are expression-local values. The 28px
> reveal goes past Instrument's 4px rise, and the whole set needs an ADR-UIP-VIS-001
> revision before it becomes a rule.

Terms used below:

| Term | Meaning |
| :-- | :-- |
| *section line* | The 1px rule at the top of a section (`[data-sheet]`), as it sits on screen. |
| *nav* | The 48px navigation strip, held at the top of the viewport. |
| *p* | Page progress, `scrollY / maxScroll × 100` (0–100). |
| *rest / folded* | The ruler at page scale / the ruler folded into 0–100 (hover, focus or drag). |

## 1. Page load

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 1.1 | Page held hidden | `html.sq-boot` hides everything below the nav until the reveal blocks are marked, in the same task, before first paint. A 2.5s failsafe removes it in any case. |
| 1.2 | Reveal, first screen | Blocks already in view rise at once (see 3.1), 80ms apart in document order. |
| 1.3 | Rules draw | Each section's rule draws in from the left once it is in view (see 2.2). |
| 1.4 | Ruler appears | At 1024px and wider. The native scrollbar is hidden (`html[data-ruler="on"]`) and the 60px ruler takes its place. The titles are placed for the current scroll position with no flight. |
| 1.5 | Measure | Section positions, the page height, the free margin and title widths are measured once, then again on resize, on a body resize, when fonts load, and after each reveal wave (a block still lowered by 28px lengthens the page). |

## 2. Lines and section bars

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 2.1 | Nav | Sticky at the top, 48px, above everything (z 50), including the ruler. |
| 2.2 | Section rule draws in | 1px, the width of the viewport, scaled 0 → 1 from the left over 1100ms. It runs once, when the section enters the view (`instrument.js`: 12% visible, bottom 18% of the viewport excluded). On the Button page the rule spans the page column only. |
| 2.3 | Crosses | An 11px cross in a strong line sits where each rule meets a column line. Static. |
| 2.4 | Section bar holds | `NN / Name ··· facts` is sticky under the nav (`top: 48px`) while its section is in view. |
| 2.5 | Bar top line | The rule sits above the bar (z 31 over z 30), so it is the bar's top line until the bar sticks. By then the rule has scrolled under the nav, and the nav's bottom line takes over. One line, never two. |
| 2.6 | Bar pushed out | The next section pushes a held bar up. The bar's −1px bottom margin lands its line on the next rule, so they don't sit 1px apart. |
| 2.7 | "Here" on the bar | The bar's number turns blue when its section crosses `instrument.js`'s reading line, at about 40% of the viewport. *See "Known difference" below.* |

## 3. Content

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 3.1 | Reveal on entry | A block rises from 28px below and an 8px blur to rest: opacity, translate and blur over 900ms, `power3.out`. It runs once, when 12% of the block is visible (the bottom 6% of the viewport excluded). Blocks entering together are staggered 80ms apart in document order, capped at 8 steps. |
| 3.2 | What rises | The finest blocks: a heading, a paragraph, a card's parts, a row of facts, the tape. A grid cell never rises on its own, because a fading cell would show the grid's line colour through it; its contents rise instead. Sticky elements never rise. |
| 3.3 | 3D drawings | The landing assembly rises without the blur, which would flatten its 3D. |
| 3.4 | Clean-up | The reveal classes are removed once a block is at rest (1100ms plus its delay), so nothing lingers on the element. |
| 3.5 | Drawn on entry (`instrument.js`) | Dimension lines draw from their centre over 900ms. Check marks settle over 420ms. Terminals type their lines: a command takes 520ms plus 14ms per character, an output line 160ms. Counters roll to their value over 1100ms. All run once, at 12% visible with the bottom 18% excluded. |
| 3.6 | Scrubbed by scroll (`instrument.js`) | The landing assembly's four plates come together as the hero scrolls out (`data-scrub="exit"`: `p = −top / (0.9 × height)`). The "Assembly NN%" readout follows. |
| 3.7 | Not scroll-driven | The receipt tape runs on its own (an 80s loop) and pauses on hover and focus. |

## 4. Smooth scroll

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 4.1 | Mouse wheel glides | Each notch moves the target. The page eases toward it with a 120ms time constant (the reference uses Lenis `lerp: 0.12`) and lands within 0.5px. Notches add up while gliding. |
| 4.2 | Trackpad stays native | Pixel deltas under 50, or fractional ones, are left to the browser. Its own inertia is smooth and runs off the main thread. If a glide is already running, the trackpad steers it with a 45ms time constant. |
| 4.3 | Left to the browser | Ctrl or pinch zoom, a mostly horizontal swipe, an element under the pointer that can still scroll that way (the Button sidebar, code blocks), an event another handler has already taken, and reduced motion. |
| 4.4 | Others take over | Keys, anchor links, find-in-page and the native scrollbar on narrow screens move the page directly. A glide in progress yields to them. |
| 4.5 | Line units | `deltaMode` 1 counts 16px per line; `deltaMode` 2 counts one viewport per page. |
| 4.6 | Same frame | The ruler and titles are redrawn in the frame the glide moves the page, never a frame behind. |

## 5. The ruler at rest

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 5.1 | Page scale | One tick per 1% of the page (10px), with a 20px tick and its number every 5. The tick for value *v* sits at `nowY + (v − p) × pageHeight / 100`. The whole scale moves as one transform. |
| 5.2 | Now line | A blue line at `nowY = 60 + p × (viewport − 74) / 100`, sliding down the viewport as the page scrolls. |
| 5.3 | Readout | Under the now line, like a receipt: `05 · 042%` (the current section, then *p*). |
| 5.4 | The ledger | A 20×2px mark at each section's place in the document (`top / pageHeight`). Marks are faint ahead, ink for the current section, and blue with a drawn check once read (an earlier section, or every section once *p* ≥ 99.5). |
| 5.5 | Glass | The ruler strip has a 9px backdrop blur, fading to the left. Two corner glasses (top 260px, bottom 220px, up to 380px wide) sit behind the title stacks. |

## 6. Section titles

Every letter is placed from the scroll position, so scrolling back plays everything
back. Each title moves letter by letter, the last letter first. 55% of a move is
spent staggering the letters, eased in and out (cubic).

| # | Place | Position and look |
| :-- | :-- | :-- |
| 6.1 | Stack (ahead) | Small (16px), right-aligned at the ruler, bottom-aligned: `y = viewport − 37 − (last − i) × 20`. Tone 42%. |
| 6.2 | Standing | Upright on the ruler (rotated −90°, 18px). It hangs from its section line (top at line + 8px), kept on screen while the line is still entering. Tone 42%. |
| 6.3 | Current | Large: `clamp(1.77% of viewport width, 22, 34)px`, shrunk to fit the free margin (no smaller than 1.2 × small). `y = 66 + i × 20 + size`. Full tone, with a blue check beside it once whole. |
| 6.4 | Read stack | Small, top-aligned under the nav: `y = 75 + i × 20`. Tone 42%. |

| # | Move | Trigger (section line on screen) |
| :-- | :-- | :-- |
| 6.5 | Stack → standing | Starts as the line enters from the bottom, and is complete once the line has risen 25% of the viewport. |
| 6.6 | Standing rides | The title moves with its line. |
| 6.7 | Standing → current | Starts when the line is 140px below the current title's place, and is complete when the line reaches the nav. Where the page ends first, it completes at the highest point the line can reach. |
| 6.8 | Current → read stack | Over the same stretch as 6.7, driven by the next section's line. |
| 6.9 | Current section | The last one whose line has reached the nav. That is the moment its section bar is held, and it drives the readout, the ledger and the check. |
| 6.10 | Check | Drawn beside the current title once it is whole: not moving in or out, and not being verified. Hidden while the ruler is folded. |
| 6.11 | Verified on demand | Hovering or focusing a title at rest (current, read stack or ahead) shows its letters as hash characters (`0–9 A–F`, changing every 50ms) for 120ms, then resolves them left to right, one every 45ms. The check is drawn again after. Once per entry; not on a title in motion, not while folded, not under reduced motion. |
| 6.12 | Links | Each title is a link to its section, covering the title where it mostly is. |

**Narrow margin (compact).** When the free margin between the column and the ruler
cannot hold even the small titles (about 1440px and below), titles never cover the
page at rest:
- The current title stands upright at the head of the ruler (top 74px).
- The next title stands upright where its line is.
- The others are hidden, and their links leave the tab order.
- The corner glass shows only while the ruler is folded.

## 7. The ruler folded

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 7.1 | Fold | Pointer over the ruler, focus on it, or a drag. Also kept while the pointer moves onto a title link. It eases with a 170ms time constant. |
| 7.2 | Scale | 0–100 over the viewport, from 60px to `viewport − 14px`. |
| 7.3 | Window | A shaded box marks the part of the page in view (`scrollY` to `scrollY + viewport`, as fractions of the page). |
| 7.4 | Cursor | A 3px ink line at the pointer. |
| 7.5 | Titles | All small and level, each at its section's place on the scale. Current at full tone, the rest at 86%. They move in letter by letter over the first 40% of the fold. |
| 7.6 | Click | Glides to the point under the pointer: `(y − 60) / (viewport − 74)` of the page. |
| 7.7 | Drag | Scrubs instantly with the pointer. |
| 7.8 | Unfold | On pointer leave, unless dragging or focused. |

## 8. Keyboard

The ruler is focusable (`role="scrollbar"`, Tab), and folds on focus.

| Key | Moves to |
| :-- | :-- |
| ↓ / → | +1% (Shift: +5%) |
| ↑ / ← | −1% (Shift: −5%) |
| Page Down | The next section's line under the nav |
| Page Up | The current section's line under the nav, or the previous section's if already there |
| Home / End | Top / bottom |

Moves glide like a wheel notch. It announces `aria-valuenow` and `aria-valuetext`, such as "42%, Guarantees". The keyboard keeps its native page scrolling everywhere else.

## 9. Where it is off

| Condition | What changes |
| :-- | :-- |
| Reduced motion | No glide, no reveal, no hash shuffle. The fold opens at once, with no letter stagger. Titles still follow the scroll, because they are positions, not timed animations. Instrument shows every line drawn and every terminal printed. |
| Below 1024px | No ruler, no titles. The native scrollbar returns. Reveal and wheel glide stay. |
| `?render` | No ruler, no reveal, no glide. Bars and nav are not sticky. Used for the still-frame PNGs. |
| No JS | The finished page with the native scrollbar. Nothing is hidden. |

## Known difference

Two definitions of "here" run side by side:
- **Ruler (`square.js`).** The current section is the one whose line has reached the nav. This drives the ruler's titles, readout and ledger.
- **`instrument.js`.** It still uses its reading line at 40% of the viewport. This drives the blue number on the section bar, the nav's `Sheet NN/07 NN%` readout and the Button page's "On this page" highlight.

Between those two points, the two can briefly disagree. Aligning `instrument.js` with the nav line would change the Instrument boards too, so it is left for a decision.

## Performance

- **No layout reads while scrolling.** Section positions are measured on resize and cached. A style is written only when it changes.
- **One loop for the ruler.** It runs only while the fold animates or a hover-verify runs. A glide redraws the ruler from inside its own frame.
- **Per-frame values off the root.** `instrument.js` writes them on the read head rather than on `<html>`, so scrolling no longer restyles the whole document.
