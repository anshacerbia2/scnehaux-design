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
| *half a pixel* | A threshold, not rounding. Section tops are often fractional (48.4px), so a line within half a pixel of a mark counts as having reached it. Every position is still computed and drawn unrounded (to 0.1px). |

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
| 2.1 | Nav | Sticky at the top, 48px, above everything (z 50), including the ruler. A strip of cells with one line between any two. At 1240px and below the sheet readout leaves (the ruler repeats it), so the strip fits down to 1024px. Below 980px the links leave too. |
| 2.2 | Section rule draws in | 1px, the width of the viewport, scaled 0 → 1 from the left over 1100ms. It runs once, when the section enters the view (`instrument.js`: 12% visible, bottom 18% of the viewport excluded). On the Button page the rule spans the page column only. |
| 2.3 | Crosses | An 11px cross in a strong line sits where each rule meets a column line. Static. |
| 2.3a | First section | No rule and no crosses: it starts right under the nav, whose own line is its top line. The same holds for the Button page's docs column. |
| 2.4 | Section bar holds | `NN / Name ··· facts` is sticky under the nav (`top: 48px`) while its section is in view. |
| 2.5 | Bar top line | The rule sits above the bar (z 31 over z 30), so it is the bar's top line until the bar sticks. By then the rule has scrolled under the nav, and the nav's bottom line takes over. One line, never two. |
| 2.6 | Bar pushed out | The next section pushes a held bar up. The bar's −1px bottom margin lands its line on the next rule, so they don't sit 1px apart. |
| 2.7 | "Here" on the bar | The bar's number turns blue when its section is current: when its line reaches the nav (see 6.9). The nav's `Sheet NN/07 NN%` readout and the Button page's "On this page" highlight switch at the same moment, as do the ruler's titles, readout and ledger. |

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
| 4.1 | Wheel glides | Every wheel input, mouse or trackpad, moves a target. The page eases toward it with a 120ms time constant (the reference uses Lenis `lerp: 0.12`) and lands within 0.5px. Inputs add up while gliding. |
| 4.2 | Trackpad | It glides like the mouse, as Lenis does. Its many small deltas add up to one eased movement. |
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
| 5.5 | Glass | The ruler strip has a 9px backdrop blur, fading to the left. Two corner glasses (top 260px, bottom 220px, up to 380px wide) always sit behind the title stacks. |

## 6. Section titles

Every letter is placed from the scroll position, so scrolling back plays everything
back. Each title moves letter by letter, the last letter first. 55% of a move is
spent staggering the letters, eased in and out (cubic).

| # | Place | Position and look |
| :-- | :-- | :-- |
| 6.1 | Stack (ahead) | Small (16px), right-aligned at the ruler, bottom-aligned: `y = viewport − 37 − (last − i) × 20`. Tone 42%. |
| 6.2 | Standing | Upright on the ruler (rotated −90°, 18px). It hangs from its section line (top at line + 8px), kept on screen while the line is still entering. Tone 42%. |
| 6.3 | Current | Large: `clamp(1.77% of viewport width, 22, 34)px`, shrunk toward the free margin (never below 80%). `y = 66 + i × 20 + size`. Full tone, with a blue check beside it once whole. |
| 6.4 | Read stack | Small, top-aligned under the nav: `y = 75 + i × 20`. Tone 42%. |

| # | Move | Trigger (section line on screen) |
| :-- | :-- | :-- |
| 6.5 | Stack → standing | Starts as the line enters from the bottom, and is complete once the line has risen 25% of the viewport. |
| 6.6 | Standing rides | The title moves with its line. |
| 6.7 | Standing → current | Starts when the line is 140px below the current title's place, and is complete when the line reaches the nav (within half a pixel). Where the page ends first, it completes at the highest point the line can reach. It never starts until the previous section's line is 24px past the nav, so a short section makes the next title lie down over a shorter stretch, never early. |
| 6.8 | Current → read stack | Over the same stretch as 6.7, driven by the next section's line. |
| 6.9 | Current section | The last one whose line has reached the nav. Where the page ends first, the highest point its line can reach counts instead. This is the moment its section bar is held. It is the page's one "here": the ruler (titles, readout, ledger, check), the bar's blue number, the nav's readout and the Button page's contents all switch on it. `square.js` sets `<html data-ix-here="48">`, which tells `instrument.js` to use the same line. |
| 6.10 | Check | Drawn beside the current title once it is whole: not moving in or out, and not being verified. Because of 6.7, that is always true at the moment the line reaches the nav (or the end of the page), so the title is level and checked at that moment, never after. The check draws in over 420ms. Hidden while the ruler is folded. |
| 6.11 | Verified on demand | Hovering or focusing a title at rest shows its letters as hash characters (`0–9 A–F`, changing every 50ms) for 120ms, then resolves them left to right, one every 45ms. The check is drawn again after, when the title is the current one. "At rest" covers the current title, both stacks, and every title while the ruler is open or opening. A title in a scroll move, or with the ruler closing, is not at rest. Standing titles sit on the ruler, so pointing at one opens the ruler first. Once per entry; not under reduced motion. Nav links and calls to action use the same shuffle (see the README, "Nav and calls to action"). |
| 6.12 | Links | Each title is a link to its section, covering the title where it mostly is. A jump lands the section's line under the nav (`scroll-margin-top: 48px` on every section). Section 01 lands at the top of the page, exactly where it loads. |

**The same at every width.** Wherever the ruler shows (1024px and up), the titles keep
one layout and one behaviour:
- Read stack, large current title with its check, standing next title, and the waiting stack.
- Only the size follows the viewport: 1.77% of its width, between 22 and 34px.
- The large title shrinks toward the free margin between the column and the ruler, but never below 80%.
- Where the margin is narrower, the titles overlap the page's top-right corner over the corner glass, as the reference does.

## 7. The ruler folded

| # | Behaviour | Detail |
| :-- | :-- | :-- |
| 7.1 | Fold | Pointer over the ruler, focus on it, or a drag. Also kept while the pointer moves onto a title link. It eases with a 170ms time constant. |
| 7.2 | Scale | 0–100 over the viewport, from 60px to `viewport − 14px`. |
| 7.3 | Window | A shaded box marks the part of the page in view (`scrollY` to `scrollY + viewport`, as fractions of the page). |
| 7.4 | Cursor | A 3px ink line at the pointer. |
| 7.5 | Titles | All small and level, each at its section's place on the scale. Current at full tone, the rest at 86%. They move in letter by letter over the first 40% of the fold. |
| 7.6 | Click | Glides to the point under the pointer: `(y − 60) / (viewport − 74)` of the page. |
| 7.7 | Drag | Glides after the pointer, closer behind than a wheel (80ms time constant), and lands where the pointer is on release. |
| 7.8 | Onto a title | Moving the pointer from the ruler onto a title keeps the ruler open, so its titles can be read, verified (6.11) or followed. |
| 7.9 | Unfold | When the pointer leaves both the ruler and its titles, unless dragging or focused. |

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

## One "here"

Square has one definition of the current section: its line has reached the nav (6.9).
Instrument's own boards keep their reading line at about 40% of the viewport, because
their read head is drawn there. Square removed the read head, so that line no longer
meant anything here. `instrument.js` takes the line from `data-ix-here`; unset, it
keeps the read head's line, so the Instrument boards are unchanged.

## Performance

- **No layout reads while scrolling.** Section positions are measured on resize and cached. A style is written only when it changes.
- **One loop for the ruler.** It runs only while the fold animates or a hover-verify runs. A glide redraws the ruler from inside its own frame.
- **Per-frame values off the root.** `instrument.js` writes them on the read head rather than on `<html>`, so scrolling no longer restyles the whole document.
