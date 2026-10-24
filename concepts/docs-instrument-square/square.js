/* Scnehaux UI · Instrument · Square — smooth scroll, reveal and the ruler scrollbar.

   Smooth scroll: a mouse-wheel notch is eased toward its target (Lenis-style, no
   library). A trackpad keeps native scrolling, whose own inertia is already smooth and
   runs off the main thread. Anything that scrolls itself, a pinch or ctrl zoom, a
   horizontal swipe and reduced motion keep the native behaviour; keys, anchors and find
   are never intercepted. The ruler is redrawn in the same frame the page moves, never a
   frame behind it.

   Reveal: content rises 28px into place out of an 8px blur as it first enters the view,
   in document order, a beat apart.

   The ruler: a page-position ruler replaces the native scrollbar on the right edge, kept
   as an evidence ledger. At rest it reads at page scale around the blue "now" line
   ("05 · 042%"); hovered or focused, it folds the whole page into 0–100 with the
   viewport drawn as a window. Each section's start is marked on the scale; a section
   read to its end is verified (blue, with a check). Section titles sit beside it: the
   ones read stacked small at the top, the current one large under them, the next one
   standing on the ruler where it begins, the rest waiting at the bottom. Titles move
   with the scroll, letter by letter, last letter first: scroll back and they go back.
   A title becoming current is checked once whole. Hovering or focusing a title at rest
   verifies it again: its letters read as hash characters, then resolve left to right. Titles never cover the page at rest: the large title shrinks to
   the free margin, and where the margin is too narrow they stand upright on the ruler.
   Click or drag to move; with focus, arrows step 1% (shift 5%), Page Up and Page Down
   move by section, Home and End go to the ends.

   No dependencies and no layout reads while scrolling: positions are measured on
   resize and cached, and a style is written only when it changes. Below 1024px, in
   ?render and without JS the native scrollbar is kept. Under reduced motion nothing
   glides, rises or scrambles. */
(() => {
  const doc = document.documentElement;
  if (new URLSearchParams(location.search).has("render")) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 1024px)");
  const RAIL = 60, TOP = 60, BOTTOM = 14, PITCH = 22, NAV = 48;
  const SMALL = 16 / 34, UPRIGHT = SMALL * 1.12;
  const TAU_MODE = 170, TAU_WHEEL = 120, TAU_TRACKPAD = 45;
  const SPREAD = 0.55; // share of a title's move spent staggering its letters
  const DECODE_LEAD = 120, DECODE_STEP = 45; // a hovered title: hash for 120ms, then a letter resolves every 45ms
  const HEX = "0123456789ABCDEF";
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';

  const ready = (fn) => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());
  const el = (tag, cls, attrs = {}) => { const n = document.createElement(tag); if (cls) n.className = cls; for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // write a style only when it changes
  const put = (node, prop, value) => { const k = `_${prop}`; if (node[k] !== value) { node[k] = value; node.style[prop] = value; } };
  const ty = (y) => `translate3d(0, ${y.toFixed(1)}px, 0)`;

  /* ---------- Reveal: hide the page before first paint, then rise it in ---------- */
  const reveal = !reduce.matches;
  if (reveal) {
    doc.classList.add("sq-boot");
    setTimeout(() => doc.classList.remove("sq-boot"), 2500); // never leave the page hidden
  }

  /* ---------- Smooth scroll ---------- */
  const smooth = (() => {
    let target = scrollY, current = scrollY, written = -1, running = false, last = 0, tau = TAU_WHEEL;
    const listeners = [];
    const max = () => Math.max(0, doc.scrollHeight - innerHeight);
    const write = (y, t) => { written = y; scrollTo({ top: y, behavior: "instant" }); for (const fn of listeners) fn(t); };
    const step = (t) => {
      const dt = Math.min(64, t - last); last = t;
      current = mix(current, target, 1 - Math.exp(-dt / tau));
      if (Math.abs(target - current) < 0.5) current = target;
      write(current, t);
      if (current !== target) requestAnimationFrame(step); else running = false;
    };
    const to = (y, ease = TAU_WHEEL) => {
      target = clamp(y, 0, max()); tau = ease;
      if (reduce.matches) { running = false; current = target; write(target, performance.now()); return; }
      if (!running) { running = true; current = scrollY; last = performance.now(); requestAnimationFrame(step); }
    };
    const set = (y) => { running = false; target = current = clamp(y, 0, max()); write(current, performance.now()); };
    // an element that can still scroll this way keeps the wheel
    const scrollsItself = (node, dy) => {
      for (let n = node; n && n !== document.body && n !== doc; n = n.parentElement) {
        if (n.nodeType !== 1) continue;
        const oy = getComputedStyle(n).overflowY;
        if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight + 1) {
          if (dy > 0 ? n.scrollTop + n.clientHeight < n.scrollHeight - 1 : n.scrollTop > 0) return true;
        }
      }
      return false;
    };
    addEventListener("wheel", (e) => {
      if (reduce.matches || e.ctrlKey || e.defaultPrevented) return;
      let dy = e.deltaY, dx = e.deltaX;
      if (e.deltaMode === 1) { dy *= 16; dx *= 16; } else if (e.deltaMode === 2) { dy *= innerHeight; dx *= innerHeight; }
      // a trackpad sends many small pixel deltas and brings its own inertia: leave it native
      // (and compositor-driven) unless a glide is already running, which it then steers
      const trackpad = e.deltaMode === 0 && (Math.abs(e.deltaY) < 50 || !Number.isInteger(e.deltaY));
      if (trackpad && !running) return;
      if (dy === 0 || Math.abs(dx) > Math.abs(dy) || scrollsItself(e.target, dy)) return;
      e.preventDefault();
      to((running ? target : scrollY) + dy, trackpad ? TAU_TRACKPAD : TAU_WHEEL);
    }, { passive: false });
    // any other mover (keys, anchors, find, the scrollbar on narrow screens) takes over
    addEventListener("scroll", () => {
      if (Math.abs(scrollY - written) <= 1.5) return;
      running = false; target = current = scrollY;
    }, { passive: true });
    return { to, set, onWrite: (fn) => listeners.push(fn) };
  })();

  ready(() => {
    /* ---------- Reveal ---------- */
    if (reveal) {
      const scope = document.querySelectorAll(".ix-page > main > section[data-sheet], .ix-foot, .docs");
      const blocks = ".sq-cells > *, .sq-lead, .sq-facts, .ix-tape, .schedule-head, .schedule > li, .gauges > *, .contracts > *, .hero-copy > *, .two-copy > *, .over-copy > *, .hue-panel > *, .page-head > *, .sec > :not(.sec-head), .ix-foot-grid > *, .ix-setblock, .side, .toc > *, .ix-page > main > section[data-sheet] > :not(.ix-sheet-head):not(.sq-cells)";
      let found = [];
      scope.forEach((s) => found.push(...s.querySelectorAll(blocks)));
      found = [...new Set(found)];
      // keep the finest blocks: drop any block that holds another
      found = found.filter((a) => !found.some((b) => b !== a && a.contains(b)));
      // a cell is never faded on its own (the grid's line colour would show through): its contents rise instead
      const expand = (n) => (n.parentElement?.classList.contains("sq-cells") && n.children.length ? [...n.children].flatMap(expand) : [n]);
      found = [...new Set(found.flatMap(expand))].filter((n) => getComputedStyle(n).position !== "sticky");
      for (const n of found) {
        n.classList.add("sq-reveal");
        // a 3D drawing would be flattened by a filter: it rises without the blur
        if (getComputedStyle(n).transformStyle === "preserve-3d" || n.querySelector(".asm-stage")) n.classList.add("sq-reveal-flat");
      }
      doc.classList.remove("sq-boot");
      const io = new IntersectionObserver((entries) => {
        const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        shown.forEach((n, i) => {
          io.unobserve(n);
          n.style.setProperty("--sq-d", `${Math.min(i, 8) * 80}ms`);
          n.classList.add("is-in");
          // clear every trace once risen, so nothing lingers on the element
          // (a block still lowered also lengthens the page, so the ruler measures again)
          setTimeout(() => { n.classList.remove("sq-reveal", "sq-reveal-flat", "is-in"); n.style.removeProperty("--sq-d"); dispatchEvent(new Event("sq:layout")); }, 1100 + Math.min(i, 8) * 80);
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.12 });
      found.forEach((n) => io.observe(n));
    }

    const sheets = [...document.querySelectorAll("[data-sheet]")];
    if (!sheets.length) return;

    /* ---------- DOM ---------- */
    const rail = el("div", "sq-ruler", { role: "scrollbar", tabindex: "0", "aria-controls": document.querySelector("main")?.id || "", "aria-orientation": "vertical", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": "0", "aria-label": "Page position" });
    rail.append(el("div", "sq-ruler-glass", { "aria-hidden": "true" }));
    const scale = el("div", "sq-scale", { "aria-hidden": "true" });
    const items = [];
    for (let v = 0; v <= 100; v++) {
      const t = el("span", "sq-tick");
      if (v % 5 === 0) { t.dataset.major = ""; const b = el("b"); b.textContent = v; t.append(el("i"), b); } else t.append(el("i"));
      scale.append(t); items.push({ n: t, v: () => v });
    }
    const win = el("div", "sq-ruler-window", { "aria-hidden": "true" });
    const now = el("div", "sq-ruler-now", { "aria-hidden": "true" });
    const pct = el("span");
    now.append(pct);
    rail.append(scale, win, now);
    const cursor = el("div", "sq-ruler-cursor", { "aria-hidden": "true" });
    const glassTop = el("div", "sq-glass", { "data-at": "top", "aria-hidden": "true" });
    const glassBottom = el("div", "sq-glass", { "data-at": "bottom", "aria-hidden": "true" });
    const layer = el("div", "sq-labels", { "aria-hidden": "true" });
    const verified = el("div", "sq-verified", { "aria-hidden": "true" });
    verified.innerHTML = CHECK;
    const jumps = el("nav", "sq-jumps", { "aria-label": "Sections" });

    const labels = sheets.map((s, i) => {
      const name = (s.dataset.sheet || s.id).toUpperCase();
      const letters = [...name].map((ch) => {
        const real = ch === " " ? " " : ch;
        const span = el("span");
        span.textContent = real;
        layer.append(span);
        return { span, real, shown: real, w: 0, c: 0 };
      });
      const a = el("a", "", { href: `#${s.id}`, "aria-label": `Jump to ${s.dataset.sheet || s.id}` });
      jumps.append(a);
      const mark = el("span", "sq-mark", { "data-state": "ahead" });
      mark.innerHTML = `<i></i>${CHECK}`;
      scale.append(mark);
      const L = { sheet: s, i, name, letters, link: a, mark, W: 0, v: 0, top: 0, box: "", decode: 0, settled: false };
      // hovering or focusing a title at rest verifies it again: once per entry, never while it moves
      const verify = () => {
        if (reduce.matches || L.decode || !L.settled || modeTarget > 0.5) return;
        L.decode = performance.now();
        request();
      };
      a.addEventListener("pointerenter", verify);
      a.addEventListener("focus", verify);
      items.push({ n: mark, v: () => L.v });
      return L;
    });
    const last = labels.length - 1;
    document.body.append(glassTop, glassBottom, layer, verified, jumps, rail, cursor);

    /* ---------- measure: on resize only, never while scrolling ---------- */
    let vw = 0, vh = 0, docH = 1, maxScroll = 1, H = 1, big = 34, readLine = 0, room = 0, compact = false, longest = 0, scaleState = "", W = 10;
    const column = document.querySelector(".sq-col") || document.querySelector(".ix-page > main > section[data-sheet]");
    const measureLetters = () => {
      big = clamp(Math.round(vw * 0.0177), 22, 34);
      doc.style.setProperty("--sq-label-size", `${big}px`);
      longest = 0;
      for (const L of labels) {
        let c = 0;
        // offsetWidth is the laid-out width at the base size, before scale and rotation
        for (const l of L.letters) { if (l.shown !== l.real) l.span.textContent = l.shown = l.real; l.w = l.span.offsetWidth; l.c = c; c += l.w; }
        L.W = c; longest = Math.max(longest, c);
      }
    };
    const measureLayout = () => {
      vw = doc.clientWidth; vh = innerHeight;
      docH = Math.max(1, doc.scrollHeight);
      maxScroll = Math.max(1, docH - vh);
      H = Math.max(1, vh - TOP - BOTTOM);
      // the same reading line instrument.js uses for "here"
      readLine = Math.round((vh * 0.4) / PITCH) * PITCH + PITCH / 2;
      for (const L of labels) {
        L.top = L.sheet.getBoundingClientRect().top + scrollY;
        L.v = L.i === 0 ? 0 : clamp(((L.top - readLine) / maxScroll) * 100, 0, 100);
      }
      // a title moves over half a screen of scrolling, or less where sections are close,
      // so no move starts before the page has moved
      W = Math.max(0.5, ((vh * 0.5) / maxScroll) * 100);
      for (const L of labels) L.win = L.i === 0 ? W : Math.max(0.25, Math.min(W, (L.v - labels[L.i - 1].v) * 0.9));
      // the free margin between the column and the ruler
      room = vw - RAIL - (column ? column.getBoundingClientRect().right : vw - RAIL) - 16;
      compact = room < longest * SMALL;
      scaleState = "";
    };
    const measure = () => { vw = doc.clientWidth; measureLetters(); measureLayout(); };

    /* ---------- state ---------- */
    let mode = 0, modeTarget = 0, pointerY = -1, dragging = false, focused = false, lastT = performance.now(), shownCur = -1, lastY = -1, lastMode = -1;
    const hoverY = (v) => TOP + (v / 100) * H;
    const progress = () => clamp((scrollY / maxScroll) * 100, 0, 100);
    const currentIndex = () => { let idx = 0; for (const L of labels) if (L.top - scrollY <= readLine) idx = L.i; return idx; };

    /* Where letter k of a title sits in each place it can be: [x, y, rotation, scale, tone, opacity]. */
    const across = (L, k, y, s, t, o = 1) => [vw - RAIL - L.W * s + (L.letters[k].c + L.letters[k].w / 2) * s, y, 0, s, t, o];
    const upright = (L, k, y, t, o = 1) => [vw - 32, y + (L.W * UPRIGHT) / 2 - (L.letters[k].c + L.letters[k].w / 2) * UPRIGHT, -90, UPRIGHT, t, o];
    const blend = (a, b, t) => a.map((v, j) => mix(v, b[j], t));
    // letter k's share of a move: the last letter leaves first
    const stagger = (P, k, n) => { const idx = n - 1 - k; const off = n > 1 ? (SPREAD * idx) / (n - 1) : 0; return ease(clamp((P - off) / (1 - SPREAD), 0, 1)); };
    const hash = (a, b, c) => { let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791); h = (h ^ (h >>> 13)) * 1274126177; return Math.abs(h ^ (h >>> 16)) % 16; };

    const frame = (t) => {
      const dt = Math.min(64, t - lastT); lastT = t;
      const kMode = reduce.matches ? 1 : 1 - Math.exp(-dt / TAU_MODE);
      mode = Math.abs(modeTarget - mode) < 0.002 ? modeTarget : mix(mode, modeTarget, kMode);
      const y = scrollY;
      const decoding = labels.some((L) => L.decode);
      if (y === lastY && mode === lastMode && !decoding) return mode !== modeTarget;
      lastY = y; lastMode = mode;
      const p = progress(), lineY = hoverY(p), cur = currentIndex();

      // the scale: one transform at rest, placed once when folded, mixed only while folding
      const offset = lineY - (p / 100) * docH;
      if (mode === 0) {
        if (scaleState !== "rest") { for (const it of items) it.n.style.transform = ty((it.v() / 100) * docH); scaleState = "rest"; }
        put(scale, "transform", ty(offset));
      } else if (mode === 1) {
        if (scaleState !== "fold") { for (const it of items) it.n.style.transform = ty(hoverY(it.v())); scaleState = "fold"; }
        put(scale, "transform", "none");
      } else {
        scaleState = "mix";
        put(scale, "transform", "none");
        for (const it of items) it.n.style.transform = ty(mix((it.v() / 100) * docH + offset, hoverY(it.v()), mode));
      }
      // the ledger: read sections are verified, the one being read is ink
      if (cur !== shownCur || p >= 99.5) {
        const end = p >= 99.5;
        for (const L of labels) L.mark.dataset.state = L.i < cur || end ? "read" : L.i === cur ? "here" : "ahead";
        shownCur = cur;
      }
      const a = hoverY((y / docH) * 100), b = hoverY(((y + vh) / docH) * 100);
      put(win, "transform", ty(a)); put(win, "height", `${(b - a).toFixed(1)}px`); put(win, "opacity", mode.toFixed(3));
      put(now, "transform", ty(lineY));
      const readout = `${String(cur + 1).padStart(2, "0")} · ${String(Math.round(p)).padStart(3, "0")}%`;
      if (pct.textContent !== readout) {
        pct.textContent = readout;
        rail.setAttribute("aria-valuenow", String(Math.round(p)));
        rail.setAttribute("aria-valuetext", `${Math.round(p)}%, ${labels[cur].sheet.dataset.sheet || labels[cur].sheet.id}`);
      }
      put(cursor, "opacity", pointerY < 0 ? "0" : mode.toFixed(3));
      if (pointerY >= 0) put(cursor, "transform", ty(pointerY));
      // the glass behind the titles is only needed where titles can cover the page
      const glass = (compact ? mode : 1).toFixed(3);
      put(glassTop, "opacity", glass); put(glassBottom, "opacity", glass);

      /* Titles: every letter is placed from the scroll position. A title waits in the
         stack, stands on the ruler as its section nears, becomes current as the section
         reaches the reading line, and joins the read stack as the next one takes over. */
      let check = null;
      for (const L of labels) {
        const n = L.letters.length;
        const sBig = clamp(room / L.W, SMALL * 1.2, 1);
        const stackY = vh - 37 - (last - L.i) * 20;
        const pastY = 66 + 9 + L.i * 20;
        const curY = 66 + L.i * 20 + big * sBig;
        const standY = lineY + ((L.v - p) / 100) * docH;
        const half = (L.W * UPRIGHT) / 2;
        // how far along each move the title is (0–1)
        const U = clamp((stackY - 14 - (standY + half)) / (vh * 0.18), 0, 1);
        const C = L.i === 0 ? 1 : clamp((p - (L.v - L.win)) / L.win, 0, 1);
        const nx = labels[L.i + 1];
        const Q = nx ? clamp((p - (nx.v - nx.win)) / nx.win, 0, 1) : 0;
        const headY = TOP + 14 + half;
        let whole = true, settled = mode === 0;
        // a verification run ends when its last letter has resolved
        if (L.decode && t > L.decode + DECODE_LEAD + (n - 1) * DECODE_STEP) L.decode = 0;
        for (let k = 0; k < n; k++) {
          const l = L.letters[k];
          const u = stagger(U, k, n), c = stagger(C, k, n), q = stagger(Q, k, n);
          let at = compact ? across(L, k, stackY, SMALL, 0.42, 0) : across(L, k, stackY, SMALL, 0.42);
          at = blend(at, upright(L, k, standY, 0.42), u);
          at = blend(at, compact ? upright(L, k, headY, 1) : across(L, k, curY, sBig, 1), c);
          at = blend(at, compact ? across(L, k, pastY, SMALL, 0.42, 0) : across(L, k, pastY, SMALL, 0.42), q);
          // folded: every title lies at the point its section begins
          const mk = ease(clamp(mode * 1.4 - (0.4 * k) / Math.max(1, n - 1), 0, 1));
          if (mk > 0) at = blend(at, across(L, k, hoverY(L.v), SMALL, L.i === cur ? 1 : 0.86), mk);
          if ((u > 0 && u < 1) || (c > 0 && c < 1) || (q > 0 && q < 1)) settled = false;
          // verified on demand: a hovered title reads as hash characters, then resolves left to right
          let ch = l.real;
          if (L.decode && l.real !== " " && t < L.decode + DECODE_LEAD + k * DECODE_STEP) ch = HEX[hash(L.i, k, Math.floor((t - L.decode) / 50))];
          if (ch !== l.shown) l.span.textContent = l.shown = ch;
          if (c < 1 || q > 0 || L.decode) whole = false;
          put(l.span, "transform", `translate3d(${at[0].toFixed(1)}px, ${at[1].toFixed(1)}px, 0) translate(-50%, -50%) rotate(${at[2].toFixed(1)}deg) scale(${at[3].toFixed(3)})`);
          put(l.span, "color", `color-mix(in oklch, var(--ix-text) ${(at[4] * 100).toFixed(0)}%, var(--ix-ground))`);
          put(l.span, "opacity", at[5].toFixed(2));
        }
        L.settled = settled;
        if (whole && !compact && mode < 0.05) check = { L, y: curY, s: sBig };
        // the jump link covers the title where it mostly is, and leaves the tab order when hidden
        const place = mode > 0.5 ? "hover" : Q > 0.5 ? "past" : C > 0.5 ? "current" : U > 0.5 ? "upright" : "stack";
        const box = place === "hover" ? [vw - RAIL - L.W * SMALL, hoverY(L.v) - (big * SMALL) / 2, L.W * SMALL, big * SMALL]
          : place === "upright" ? [vw - 32 - (big * UPRIGHT) / 2, standY - half, big * UPRIGHT, half * 2]
          : place === "current" ? (compact ? [vw - 32 - (big * UPRIGHT) / 2, headY - half, big * UPRIGHT, half * 2] : [vw - RAIL - L.W * sBig, curY - (big * sBig) / 2, L.W * sBig, big * sBig])
          : [vw - RAIL - L.W * SMALL, (place === "past" ? pastY : stackY) - (big * SMALL) / 2, L.W * SMALL, big * SMALL];
        const hidden = compact && mode < 0.5 && (place === "past" || place === "stack");
        const key = box.map((v) => v.toFixed(0)).join(",") + (hidden ? "h" : "");
        if (key !== L.box) {
          L.box = key;
          Object.assign(L.link.style, { transform: `translate(${box[0]}px, ${box[1]}px)`, width: `${box[2]}px`, height: `${box[3]}px` });
          L.link.hidden = hidden;
        }
      }
      // the check beside the current title, once it stands whole
      if (check) {
        const size = big * check.s * 0.62;
        const x = vw - RAIL - check.L.W * check.s - size * 1.25;
        put(verified, "transform", `translate3d(${x.toFixed(1)}px, ${(check.y - size / 2).toFixed(1)}px, 0)`);
        put(verified, "width", `${size.toFixed(1)}px`); put(verified, "height", `${size.toFixed(1)}px`);
      }
      if (check && !verified.hasAttribute("data-on")) verified.setAttribute("data-on", "");
      else if (!check && verified.hasAttribute("data-on")) verified.removeAttribute("data-on");
      return mode !== modeTarget || labels.some((L) => L.decode);
    };
    // one loop, only while the fold animates; scrolling redraws in the frame it moves
    let looping = false;
    const loop = (t) => { looping = false; if (frame(t)) request(); };
    const request = () => { if (!looping) { looping = true; requestAnimationFrame(loop); } };
    smooth.onWrite((t) => { if (wide.matches) frame(t); });
    const invalidate = () => { lastY = -1; request(); };

    /* ---------- pointer ---------- */
    const toScroll = (y, glide) => {
      const top = clamp((y - TOP) / H, 0, 1) * maxScroll;
      glide ? smooth.to(top) : smooth.set(top);
    };
    const enter = () => { modeTarget = 1; request(); };
    const leave = () => { if (!dragging && !focused) { modeTarget = 0; pointerY = -1; invalidate(); } };
    rail.addEventListener("pointerenter", enter);
    rail.addEventListener("pointerleave", () => { pointerY = -1; leave(); });
    jumps.addEventListener("pointerover", (e) => { if (e.target.closest("a") && modeTarget > 0.5) enter(); });
    jumps.addEventListener("pointerout", (e) => { if (!rail.contains(e.relatedTarget) && !jumps.contains(e.relatedTarget)) leave(); });
    rail.addEventListener("pointermove", (e) => { pointerY = e.clientY; if (dragging) toScroll(e.clientY, false); invalidate(); });
    rail.addEventListener("pointerdown", (e) => { dragging = true; rail.setPointerCapture(e.pointerId); toScroll(e.clientY, true); enter(); });
    const up = () => { dragging = false; };
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", up);
    rail.addEventListener("lostpointercapture", () => { up(); if (!rail.matches(":hover")) leave(); });

    /* ---------- keyboard ---------- */
    rail.addEventListener("focus", () => { focused = true; enter(); });
    rail.addEventListener("blur", () => { focused = false; leave(); });
    rail.addEventListener("keydown", (e) => {
      const p = progress(), cur = currentIndex();
      const at = (L) => L.top - NAV;
      let top = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") top = ((p + (e.shiftKey ? 5 : 1)) / 100) * maxScroll;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") top = ((p - (e.shiftKey ? 5 : 1)) / 100) * maxScroll;
      else if (e.key === "PageDown") top = labels[cur + 1] ? at(labels[cur + 1]) : maxScroll;
      else if (e.key === "PageUp") top = scrollY > at(labels[cur]) + 4 ? at(labels[cur]) : labels[cur - 1] ? at(labels[cur - 1]) : 0;
      else if (e.key === "Home") top = 0;
      else if (e.key === "End") top = maxScroll;
      if (top === null) return;
      e.preventDefault();
      smooth.to(top);
    });

    /* ---------- lifecycle ---------- */
    const on = () => {
      const active = wide.matches;
      doc.dataset.ruler = active ? "on" : "off";
      for (const n of [rail, cursor, layer, verified, jumps, glassTop, glassBottom]) n.hidden = !active;
      if (!active) return;
      measure();
      invalidate();
    };
    // a native scroll (keys, trackpad, anchors) redraws on the next frame; a glide already redrew
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", () => { measure(); invalidate(); });
    wide.addEventListener?.("change", on);
    // content that grows (a terminal printing, a font swap) moves the sections
    new ResizeObserver(() => { measureLayout(); invalidate(); }).observe(document.body);
    let relayout = 0;
    addEventListener("sq:layout", () => { cancelAnimationFrame(relayout); relayout = requestAnimationFrame(() => { if (wide.matches) { measureLayout(); invalidate(); } }); });
    on();
    document.fonts?.ready.then(on);
  });
})();
