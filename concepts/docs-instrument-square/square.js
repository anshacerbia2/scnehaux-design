/* Scnehaux UI · Instrument · Square — smooth scroll and the ruler scrollbar.

   Smooth scroll: a mouse-wheel notch is eased toward its target (Lenis-style, no
   library). A trackpad keeps native scrolling, whose own inertia is already smooth and
   runs off the main thread. Anything that scrolls itself, a pinch or ctrl zoom, a
   horizontal swipe and reduced motion keep the native behaviour; keys, anchors and find
   are never intercepted.

   The ruler: a page-position ruler replaces the native scrollbar on the right edge, kept
   as an evidence ledger. At rest it reads at page scale around the blue "now" line
   ("05 · 042%"); hovered or focused, it folds the whole page into 0–100 with the
   viewport drawn as a window. Each section's start is marked on the scale; a section
   read to its end is verified (blue, with a check). Section titles sit beside it: the
   ones read stacked small at the top, the current one large under them, the next one
   standing on the ruler where it begins, the rest waiting at the bottom. A title that
   becomes current is verified letter by letter: each letter resolves from hash
   characters as it lands, then a check is drawn beside it. Titles never cover the page
   at rest: the large title shrinks to the free margin, and where the margin is too
   narrow they stand upright on the ruler instead. Click or drag to move; with focus,
   arrows step 1% (shift 5%), Page Up and Page Down move by section, Home and End go to
   the ends.

   No dependencies and no layout reads while scrolling: positions are measured on
   resize and cached, and a style is written only when it changes. Below 1024px, in
   ?render and without JS the native scrollbar is kept. Under reduced motion every
   change lands at once. */
(() => {
  const doc = document.documentElement;
  if (new URLSearchParams(location.search).has("render")) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 1024px)");
  const RAIL = 60, TOP = 60, BOTTOM = 14, PITCH = 22, NAV = 48;
  const SMALL = 16 / 34, UPRIGHT = SMALL * 1.12;
  const STAGGER = 22, TAU_FLIGHT = 150, TAU_MODE = 170, TAU_WHEEL = 100, TAU_TRACKPAD = 45, SCRAMBLE = 360;
  const HEX = "0123456789ABCDEF";
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';

  const ready = (fn) => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());
  const el = (tag, cls, attrs = {}) => { const n = document.createElement(tag); if (cls) n.className = cls; for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  // write a style only when it changes
  const put = (node, prop, value) => { const k = `_${prop}`; if (node[k] !== value) { node[k] = value; node.style[prop] = value; } };
  const ty = (y) => `translate3d(0, ${y.toFixed(1)}px, 0)`;

  /* ---------- Smooth scroll ---------- */
  const smooth = (() => {
    let target = scrollY, current = scrollY, written = -1, running = false, last = 0, tau = TAU_WHEEL;
    const max = () => Math.max(0, doc.scrollHeight - innerHeight);
    const write = (y) => { written = y; scrollTo({ top: y, behavior: "instant" }); };
    const step = (t) => {
      const dt = Math.min(64, t - last); last = t;
      current = mix(current, target, 1 - Math.exp(-dt / tau));
      if (Math.abs(target - current) < 0.5) current = target;
      write(current);
      if (current !== target) requestAnimationFrame(step); else running = false;
    };
    const to = (y, ease = TAU_WHEEL) => {
      target = clamp(y, 0, max()); tau = ease;
      if (reduce.matches) { running = false; current = target; write(target); return; }
      if (!running) { running = true; current = scrollY; last = performance.now(); requestAnimationFrame(step); }
    };
    const set = (y) => { running = false; target = current = clamp(y, 0, max()); write(current); };
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
    return { to, set };
  })();

  ready(() => {
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
        return { span, real, shown: real, w: 0, c: 0, x: 0, y: 0, r: 0, s: SMALL, t: 0.4, o: 1, tx: 0, ty: 0, tr: 0, ts: SMALL, tt: 0.4, to: 1, start: 0, flying: false, scrambleUntil: 0, swapped: 0 };
      });
      const a = el("a", "", { href: `#${s.id}`, "aria-label": `Jump to ${s.dataset.sheet || s.id}` });
      jumps.append(a);
      const mark = el("span", "sq-mark", { "data-state": "ahead" });
      mark.innerHTML = `<i></i>${CHECK}`;
      scale.append(mark);
      const L = { sheet: s, i, name, letters, link: a, mark, W: 0, v: 0, top: 0, role: "", box: "" };
      items.push({ n: mark, v: () => L.v });
      return L;
    });
    document.body.append(glassTop, glassBottom, layer, verified, jumps, rail, cursor);

    /* ---------- measure: on resize only, never while scrolling ---------- */
    let vw = 0, vh = 0, docH = 1, maxScroll = 1, H = 1, big = 34, readLine = 0, room = 0, compact = false, longest = 0, scaleState = "";
    const column = document.querySelector(".sq-col") || document.querySelector(".ix-page > main > section[data-sheet]");
    const measureLetters = () => {
      big = clamp(Math.round(vw * 0.0177), 22, 34);
      doc.style.setProperty("--sq-label-size", `${big}px`);
      longest = 0;
      for (const L of labels) {
        let c = 0;
        // offsetWidth is the laid-out width at the base size, before scale and rotation
        for (const l of L.letters) { if (l.shown !== l.real) { l.span.textContent = l.shown = l.real; } l.w = l.span.offsetWidth; l.c = c; c += l.w; }
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
      // the free margin between the column and the ruler
      room = vw - RAIL - (column ? column.getBoundingClientRect().right : vw - RAIL) - 16;
      compact = room < longest * SMALL;
      scaleState = "";
    };
    const measure = () => { vw = doc.clientWidth; measureLetters(); measureLayout(); };

    /* ---------- state ---------- */
    let mode = 0, modeTarget = 0, pointerY = -1, dragging = false, focused = false, last = performance.now(), running = false, shownCur = -1;
    const hoverY = (v) => TOP + (v / 100) * H;
    const progress = () => clamp((scrollY / maxScroll) * 100, 0, 100);
    const currentIndex = () => { let idx = 0; for (const L of labels) if (L.top - scrollY <= readLine) idx = L.i; return idx; };

    /* Targets for every letter of a title in a role. */
    const place = (L, role, at) => {
      const { letters, W } = L;
      const o = at.o ?? 1;
      const upright = role.startsWith("upright");
      for (const l of letters) {
        if (upright) {
          l.tx = vw - 32; l.ty = at.y + (W * UPRIGHT) / 2 - (l.c + l.w / 2) * UPRIGHT; l.tr = -90; l.ts = UPRIGHT; l.tt = at.t ?? 0.42;
        } else {
          l.tx = vw - RAIL - W * at.s + (l.c + l.w / 2) * at.s; l.ty = at.y; l.tr = 0; l.ts = at.s; l.tt = at.t;
        }
        l.to = o;
      }
      const t0 = performance.now();
      const key = `${role}:${o}`;
      if (key !== L.role) {
        // a new role: the title re-forms letter by letter; becoming current, it is verified as it lands
        const verify = (role === "current" || role === "upright-current") && !reduce.matches;
        letters.forEach((l, k) => {
          l.start = t0 + (reduce.matches ? 0 : k * STAGGER);
          l.flying = !reduce.matches;
          l.scrambleUntil = verify && l.real !== " " ? l.start + SCRAMBLE : 0;
        });
        L.role = key;
      } else if (!upright && !reduce.matches) {
        // same role, new place (a stack closing up): glide together; an upright title tracks the ruler
        for (const l of letters) if (!l.flying && (Math.abs(l.x - l.tx) > 1 || Math.abs(l.y - l.ty) > 1)) { l.start = t0; l.flying = true; }
      }
      // the jump link covers the title where it lands, and leaves the tab order when hidden
      const s = upright ? UPRIGHT : at.s;
      const box = upright
        ? [vw - 32 - (big * s) / 2, at.y - (W * s) / 2, big * s, W * s]
        : [vw - RAIL - W * s, at.y - (big * s) / 2, W * s, big * s];
      const key2 = box.map((n) => n.toFixed(0)).join(",") + (o === 0 ? "h" : "");
      if (key2 !== L.box) {
        L.box = key2;
        Object.assign(L.link.style, { transform: `translate(${box[0]}px, ${box[1]}px)`, width: `${box[2]}px`, height: `${box[3]}px` });
        L.link.hidden = o === 0;
      }
      return s;
    };

    let curPlace = null;
    const layout = (p, lineY, cur) => {
      const next = labels[cur + 1];
      const restY = (L) => lineY + ((L.v - p) / 100) * docH;
      curPlace = null;

      if (modeTarget > 0.5) {
        for (const L of labels) place(L, "hover", { y: hoverY(L.v), s: SMALL, t: L.i === cur ? 1 : 0.86 });
        return;
      }
      if (compact) {
        // no margin to spare: the current title stands at the head of the ruler, the next one where it begins
        const C = labels[cur];
        const half = (C.W * UPRIGHT) / 2;
        const cy = TOP + 14 + half;
        place(C, "upright-current", { y: cy, t: 1 });
        let showNext = false;
        if (next) {
          const yv = restY(next), nh = (next.W * UPRIGHT) / 2;
          showNext = yv - nh > cy + half + 24 && yv + nh < vh - BOTTOM;
          if (showNext) place(next, "upright", { y: yv });
        }
        for (const L of labels) if (L !== C && !(L === next && showNext)) place(L, L.i < cur ? "past" : "stack", { y: L.i < cur ? TOP : vh - 37, s: SMALL, t: 0.42, o: 0 });
        return;
      }
      let y = 66;
      for (const L of labels) if (L.i < cur) { place(L, "past", { y: y + 9, s: SMALL, t: 0.42 }); y += 20; }
      // the large title shrinks to the free margin rather than cover the page
      const C = labels[cur];
      const sBig = clamp(room / C.W, SMALL * 1.2, 1);
      const curY = y + big * sBig;
      place(C, "current", { y: curY, s: sBig, t: 1 });
      curPlace = { L: C, y: curY, s: sBig };
      const future = labels.filter((L) => L.i > cur);
      let stack = future;
      if (next) {
        const yv = restY(next);
        const half = (next.W * UPRIGHT) / 2;
        const stackTop = vh - 37 - (future.length - 2) * 20 - 14;
        if (yv - half > curY + big * sBig * 0.6 + 16 && yv + half < stackTop) { place(next, "upright", { y: yv }); stack = future.slice(1); }
      }
      let by = vh - 37;
      for (let k = stack.length - 1; k >= 0; k--) { place(stack[k], "stack", { y: by, s: SMALL, t: 0.42 }); by -= 20; }
    };

    /* ---------- frame ---------- */
    const frame = (t) => {
      running = false;
      const dt = Math.min(64, t - last); last = t;
      const kMode = reduce.matches ? 1 : 1 - Math.exp(-dt / TAU_MODE);
      mode = Math.abs(modeTarget - mode) < 0.002 ? modeTarget : mix(mode, modeTarget, kMode);
      const p = progress(), lineY = hoverY(p), cur = currentIndex();
      layout(p, lineY, cur);

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
      const a = hoverY((scrollY / docH) * 100), b = hoverY(((scrollY + vh) / docH) * 100);
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

      // letters: fly after their stagger, resolving from hash characters if they are being verified
      let moving = Math.abs(modeTarget - mode) > 0.002;
      const kFly = 1 - Math.exp(-dt / TAU_FLIGHT);
      for (const L of labels) for (const l of L.letters) {
        if (l.flying && t >= l.start) {
          l.x = mix(l.x, l.tx, kFly); l.y = mix(l.y, l.ty, kFly); l.r = mix(l.r, l.tr, kFly); l.s = mix(l.s, l.ts, kFly); l.t = mix(l.t, l.tt, kFly); l.o = mix(l.o, l.to, kFly);
          if (Math.abs(l.x - l.tx) < 0.4 && Math.abs(l.y - l.ty) < 0.4 && Math.abs(l.r - l.tr) < 0.4 && Math.abs(l.o - l.to) < 0.01) { l.flying = false; l.o = l.to; }
          moving = true;
        } else if (!l.flying) { l.x = l.tx; l.y = l.ty; l.r = l.tr; l.s = l.ts; l.t = l.tt; l.o = l.to; }
        else moving = true;
        let ch = l.real;
        if (t < l.scrambleUntil) { moving = true; ch = t - l.swapped > 45 ? HEX[(Math.random() * 16) | 0] : l.shown; if (ch !== l.shown) l.swapped = t; }
        if (ch !== l.shown) { l.span.textContent = l.shown = ch; }
        put(l.span, "transform", `translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${l.r.toFixed(1)}deg) scale(${l.s.toFixed(3)})`);
        put(l.span, "color", `color-mix(in oklch, var(--ix-text) ${(l.t * 100).toFixed(0)}%, var(--ix-ground))`);
        put(l.span, "opacity", l.o.toFixed(2));
      }

      // the check beside the current title, once every letter has landed and resolved
      const settled = curPlace && curPlace.L.letters.every((l) => !l.flying && t >= l.scrambleUntil);
      if (curPlace) {
        const size = big * curPlace.s * 0.62;
        const x = vw - RAIL - curPlace.L.W * curPlace.s - size * 1.25;
        put(verified, "transform", `translate3d(${x.toFixed(1)}px, ${(curPlace.y - size / 2).toFixed(1)}px, 0)`);
        put(verified, "width", `${size.toFixed(1)}px`); put(verified, "height", `${size.toFixed(1)}px`);
      }
      if (settled && !verified.hasAttribute("data-on")) verified.setAttribute("data-on", "");
      else if (!settled && verified.hasAttribute("data-on")) verified.removeAttribute("data-on");

      if (moving) request();
    };
    const request = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

    /* ---------- pointer ---------- */
    const toScroll = (y, glide) => {
      const top = clamp((y - TOP) / H, 0, 1) * maxScroll;
      glide ? smooth.to(top) : smooth.set(top);
    };
    const enter = () => { modeTarget = 1; request(); };
    const leave = () => { if (!dragging && !focused) { modeTarget = 0; pointerY = -1; request(); } };
    rail.addEventListener("pointerenter", enter);
    rail.addEventListener("pointerleave", () => { pointerY = -1; leave(); });
    jumps.addEventListener("pointerover", (e) => { if (e.target.closest("a") && modeTarget > 0.5) enter(); });
    jumps.addEventListener("pointerout", (e) => { if (!rail.contains(e.relatedTarget) && !jumps.contains(e.relatedTarget)) leave(); });
    rail.addEventListener("pointermove", (e) => { pointerY = e.clientY; if (dragging) toScroll(e.clientY, false); request(); });
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
      // first placement lands without flight or verification
      layout(progress(), hoverY(progress()), currentIndex());
      for (const L of labels) for (const l of L.letters) { l.x = l.tx; l.y = l.ty; l.r = l.tr; l.s = l.ts; l.t = l.tt; l.o = l.to; l.flying = false; l.scrambleUntil = 0; }
      request();
    };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", () => { measure(); request(); });
    wide.addEventListener?.("change", on);
    // content that grows (a terminal printing, a font swap) moves the sections
    new ResizeObserver(() => { measureLayout(); request(); }).observe(document.body);
    on();
    document.fonts?.ready.then(() => { for (const L of labels) L.role = ""; on(); });
  });
})();
