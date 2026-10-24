/* Scnehaux UI · Instrument · Square — the ruler scrollbar.
   A page-position ruler replaces the native scrollbar on the right edge. At rest it reads
   at page scale around the blue "now" line; hovered, it folds the whole page into 0–100
   with the viewport drawn as a window. Section titles sit beside it: the ones read are
   stacked small at the top, the current one large under them, the next one stands on the
   ruler where it begins, the rest wait at the bottom. When the current section changes,
   each title re-forms letter by letter. Click or drag the ruler to move.

   No dependencies. One rAF loop, running only while something moves. Below 1024px, in
   ?render and without JS the native scrollbar is kept. Under reduced motion every change
   lands at once. */
(() => {
  const doc = document.documentElement;
  if (new URLSearchParams(location.search).has("render")) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 1024px)");
  const RAIL = 60, TOP = 60, BOTTOM = 14, PITCH = 22;
  const SMALL = 16 / 34;
  const STAGGER = 22, TAU_FLIGHT = 150, TAU_MODE = 170;

  const ready = (fn) => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());
  const el = (tag, cls, attrs = {}) => { const n = document.createElement(tag); if (cls) n.className = cls; for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;

  ready(() => {
    const sheets = [...document.querySelectorAll("[data-sheet]")];
    if (!sheets.length) return;

    /* ---------- DOM ---------- */
    const rail = el("div", "sq-ruler", { role: "scrollbar", "aria-controls": document.querySelector("main")?.id || "", "aria-orientation": "vertical", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": "0", "aria-label": "Page position" });
    rail.append(el("div", "sq-ruler-glass", { "aria-hidden": "true" }));
    const ticks = [];
    for (let v = 0; v <= 100; v++) {
      const t = el("span", "sq-tick", { "aria-hidden": "true" });
      if (v % 5 === 0) { t.dataset.major = ""; const b = el("b"); b.textContent = v; t.append(el("i"), b); } else t.append(el("i"));
      rail.append(t); ticks.push(t);
    }
    const win = el("div", "sq-ruler-window", { "aria-hidden": "true" });
    const now = el("div", "sq-ruler-now", { "aria-hidden": "true" });
    const pct = el("span");
    now.append(pct);
    rail.append(win, now);
    const cursor = el("div", "sq-ruler-cursor", { "aria-hidden": "true" });
    const glassTop = el("div", "sq-glass", { "data-at": "top", "aria-hidden": "true" });
    const glassBottom = el("div", "sq-glass", { "data-at": "bottom", "aria-hidden": "true" });
    const layer = el("div", "sq-labels", { "aria-hidden": "true" });
    const jumps = el("nav", "sq-jumps", { "aria-label": "Sections" });

    const labels = sheets.map((s, i) => {
      const name = (s.dataset.sheet || s.id).toUpperCase();
      const letters = [...name].map((ch) => {
        const span = el("span");
        span.textContent = ch === " " ? " " : ch;
        layer.append(span);
        return { span, w: 0, c: 0, x: 0, y: 0, r: 0, s: SMALL, t: 0.4, tx: 0, ty: 0, tr: 0, ts: SMALL, tt: 0.4, start: 0, flying: false };
      });
      const a = el("a", "", { href: `#${s.id}`, "aria-label": `Jump to ${s.dataset.sheet || s.id}` });
      jumps.append(a);
      return { sheet: s, i, name, letters, link: a, W: 0, v: 0, role: "" };
    });
    document.body.append(glassTop, glassBottom, layer, jumps, rail, cursor);

    /* ---------- measure ---------- */
    let vw = 0, vh = 0, docH = 1, maxScroll = 1, H = 1, big = 34, readLine = 0;
    const measure = () => {
      vw = doc.clientWidth; vh = innerHeight;
      docH = Math.max(1, doc.scrollHeight);
      maxScroll = Math.max(1, docH - vh);
      H = Math.max(1, vh - TOP - BOTTOM);
      big = clamp(Math.round(vw * 0.0177), 22, 34);
      doc.style.setProperty("--sq-label-size", `${big}px`);
      // the same reading line instrument.js uses for "here"
      readLine = Math.round((vh * 0.4) / PITCH) * PITCH + PITCH / 2;
      for (const L of labels) {
        let c = 0;
        // offsetWidth is the laid-out width at the base size, before scale and rotation
        for (const l of L.letters) { l.w = l.span.offsetWidth; l.c = c; c += l.w; }
        L.W = c;
        const top = L.sheet.getBoundingClientRect().top + scrollY;
        L.v = L.i === 0 ? 0 : clamp(((top - readLine) / maxScroll) * 100, 0, 100);
      }
    };

    /* ---------- state ---------- */
    let mode = 0, modeTarget = 0, pointerY = -1, dragging = false, last = performance.now(), running = false;
    const hoverY = (v) => TOP + (v / 100) * H;
    const progress = () => clamp((scrollY / maxScroll) * 100, 0, 100);
    const currentIndex = () => { let idx = 0; for (const L of labels) if (L.sheet.getBoundingClientRect().top <= readLine) idx = L.i; return idx; };

    /* Targets for every letter of a label in a role. */
    const place = (L, role, at) => {
      const { letters, W } = L;
      letters.forEach((l, k) => {
        if (role === "vertical") {
          const s = SMALL * 1.12;
          l.tx = vw - 32; l.ty = at.y + (W * s) / 2 - (l.c + l.w / 2) * s; l.tr = -90; l.ts = s; l.tt = 0.42;
        } else {
          const s = at.s;
          l.tx = vw - RAIL - W * s + (l.c + l.w / 2) * s; l.ty = at.y; l.tr = 0; l.ts = s; l.tt = at.t;
        }
      });
      const t0 = performance.now();
      if (role !== L.role) {
        // a new role: the title re-forms letter by letter
        letters.forEach((l, k) => { l.start = t0 + (reduce.matches ? 0 : k * STAGGER); l.flying = !reduce.matches; });
        L.role = role;
      } else if (role !== "vertical" && !reduce.matches) {
        // same role, new place (a stack closing up): glide together; the standing title tracks the ruler
        for (const l of letters) if (!l.flying && (Math.abs(l.x - l.tx) > 1 || Math.abs(l.y - l.ty) > 1)) { l.start = t0; l.flying = true; }
      }
      // the jump link covers the title where it will land
      const s = role === "vertical" ? SMALL * 1.12 : at.s;
      const box = role === "vertical"
        ? { x: vw - 32 - (big * s) / 2, y: at.y - (W * s) / 2, w: big * s, h: W * s }
        : { x: vw - RAIL - W * s, y: at.y - (big * s) / 2, w: W * s, h: big * s };
      Object.assign(L.link.style, { transform: `translate(${box.x}px, ${box.y}px)`, width: `${box.w}px`, height: `${box.h}px` });
    };

    const layout = () => {
      const p = progress();
      const lineY = hoverY(p);
      const cur = currentIndex();
      const hovered = modeTarget > 0.5;
      if (hovered) {
        for (const L of labels) place(L, `hover`, { y: hoverY(L.v), s: SMALL, t: L.i === cur ? 1 : 0.86 });
        return { p, lineY };
      }
      let y = 66;
      for (const L of labels) if (L.i < cur) { place(L, "past", { y: y + 9, s: SMALL, t: 0.42 }); y += 20; }
      const curY = y + big;
      place(labels[cur], "current", { y: curY, s: 1, t: 1 });
      const future = labels.filter((L) => L.i > cur);
      let stack = future;
      const next = future[0];
      if (next) {
        const yv = lineY + ((next.v - p) / 100) * docH;
        const half = (next.W * SMALL * 1.12) / 2;
        const stackTop = vh - 37 - (future.length - 2) * 20 - 14;
        if (yv - half > curY + big * 0.6 + 16 && yv + half < stackTop) { place(next, "vertical", { y: yv }); stack = future.slice(1); }
      }
      let by = vh - 37;
      for (let k = stack.length - 1; k >= 0; k--) { place(stack[k], "stack", { y: by, s: SMALL, t: 0.42 }); by -= 20; }
      return { p, lineY };
    };

    /* ---------- frame ---------- */
    const frame = (t) => {
      running = false;
      const dt = Math.min(64, t - last); last = t;
      const kMode = reduce.matches ? 1 : 1 - Math.exp(-dt / TAU_MODE);
      mode = Math.abs(modeTarget - mode) < 0.002 ? modeTarget : mix(mode, modeTarget, kMode);
      const { p, lineY } = layout();

      // ticks: page scale around the now line at rest, 0–100 over the viewport when hovered
      for (let v = 0; v <= 100; v++) {
        const rest = lineY + ((v - p) / 100) * docH;
        ticks[v].style.transform = `translate3d(0, ${mix(rest, hoverY(v), mode).toFixed(1)}px, 0)`;
      }
      const a = hoverY((scrollY / docH) * 100), b = hoverY(((scrollY + vh) / docH) * 100);
      win.style.transform = `translate3d(0, ${a.toFixed(1)}px, 0)`; win.style.height = `${(b - a).toFixed(1)}px`; win.style.opacity = mode.toFixed(3);
      now.style.transform = `translate3d(0, ${lineY.toFixed(1)}px, 0)`;
      pct.textContent = `${String(Math.round(p)).padStart(3, "0")}%`;
      rail.setAttribute("aria-valuenow", String(Math.round(p)));
      cursor.style.opacity = pointerY < 0 ? "0" : mode.toFixed(3);
      if (pointerY >= 0) cursor.style.transform = `translate3d(0, ${pointerY}px, 0)`;

      // letters: fly after their stagger, then hold their target
      let moving = Math.abs(modeTarget - mode) > 0.002;
      const kFly = 1 - Math.exp(-dt / TAU_FLIGHT);
      for (const L of labels) for (const l of L.letters) {
        if (l.flying && t >= l.start) {
          l.x = mix(l.x, l.tx, kFly); l.y = mix(l.y, l.ty, kFly); l.r = mix(l.r, l.tr, kFly); l.s = mix(l.s, l.ts, kFly); l.t = mix(l.t, l.tt, kFly);
          if (Math.abs(l.x - l.tx) < 0.4 && Math.abs(l.y - l.ty) < 0.4 && Math.abs(l.r - l.tr) < 0.4) l.flying = false;
          moving = true;
        } else if (!l.flying) { l.x = l.tx; l.y = l.ty; l.r = l.tr; l.s = l.ts; l.t = l.tt; }
        else moving = true;
        l.span.style.transform = `translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${l.r.toFixed(1)}deg) scale(${l.s.toFixed(3)})`;
        l.span.style.color = `color-mix(in oklch, var(--ix-text) ${(l.t * 100).toFixed(0)}%, var(--ix-ground))`;
      }
      if (moving) request();
    };
    const request = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

    /* ---------- input ---------- */
    const toScroll = (y, smooth) => {
      const v = clamp((y - TOP) / H, 0, 1);
      scrollTo({ top: v * maxScroll, behavior: smooth && !reduce.matches ? "smooth" : "instant" });
    };
    const enter = () => { modeTarget = 1; request(); };
    const leave = () => { if (!dragging) { modeTarget = 0; pointerY = -1; request(); } };
    rail.addEventListener("pointerenter", enter);
    rail.addEventListener("pointerleave", leave);
    jumps.addEventListener("pointerover", (e) => { if (e.target.closest("a") && modeTarget > 0.5) enter(); });
    jumps.addEventListener("pointerout", (e) => { if (!rail.contains(e.relatedTarget) && !jumps.contains(e.relatedTarget)) leave(); });
    rail.addEventListener("pointermove", (e) => { pointerY = e.clientY; if (dragging) toScroll(e.clientY, false); request(); });
    rail.addEventListener("pointerdown", (e) => { dragging = true; rail.setPointerCapture(e.pointerId); toScroll(e.clientY, true); enter(); });
    const up = () => { dragging = false; };
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", up);
    rail.addEventListener("lostpointercapture", (e) => { up(); if (!rail.matches(":hover")) leave(); });

    /* ---------- lifecycle ---------- */
    const on = () => {
      const active = wide.matches;
      doc.dataset.ruler = active ? "on" : "off";
      for (const n of [rail, cursor, layer, jumps, glassTop, glassBottom]) n.hidden = !active;
      if (!active) return;
      measure();
      // first placement lands without flight
      layout();
      for (const L of labels) for (const l of L.letters) { l.x = l.tx; l.y = l.ty; l.r = l.tr; l.s = l.ts; l.t = l.tt; l.flying = false; }
      request();
    };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", () => { measure(); request(); });
    wide.addEventListener?.("change", on);
    new ResizeObserver(() => { measure(); request(); }).observe(document.body);
    on();
    document.fonts?.ready.then(() => { measure(); for (const L of labels) L.role = ""; on(); });
  });
})();
