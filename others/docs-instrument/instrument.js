/* Scnehaux UI · Instrument expression — the motion engine.
   No dependencies. One rAF loop reads scroll once per frame and writes CSS custom
   properties; layout is never read and written in the same frame. Everything here
   degrades to the finished drawing: without JS, or under prefers-reduced-motion,
   every line is drawn, every check settled, every terminal line printed. */
(() => {
  const doc = document.documentElement;
  const params = new URLSearchParams(location.search);
  const RENDER = params.has("render");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const MOTION = !reduce.matches && !RENDER;
  const PITCH = 22;

  /* ---------- Mode: dark by default for this expression; follows the toggle. ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  const initial = params.get("mode") || store.get("scnx-ix-mode") || "dark";
  doc.dataset.theme = initial === "light" ? "light" : "dark";
  if (RENDER) doc.classList.add("is-render");
  if (MOTION) doc.classList.add("js-draw");

  const ready = (fn) => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());

  ready(() => {
    document.querySelectorAll("[data-mode-toggle]").forEach((btn) => {
      const label = () => btn.setAttribute("aria-label", doc.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      label();
      btn.addEventListener("click", () => {
        doc.dataset.theme = doc.dataset.theme === "dark" ? "light" : "dark";
        store.set("scnx-ix-mode", doc.dataset.theme);
        label();
      });
    });

    /* ---------- Frames: crop marks and the radius callout. ---------- */
    document.querySelectorAll("[data-frame]").forEach((el) => {
      for (const c of ["tl", "tr", "bl", "br"]) {
        const m = document.createElement("i");
        m.className = "ix-mk"; m.dataset.c = c; m.setAttribute("aria-hidden", "true");
        el.append(m);
      }
      if (el.dataset.radius) {
        const r = document.createElement("span");
        r.className = "ix-r"; r.setAttribute("aria-hidden", "true");
        r.textContent = el.dataset.radiusLabel || `R${el.dataset.radius}`;
        el.append(r);
      }
    });

    /* ---------- Receipt tape: duplicate the list once for a seamless feed. ---------- */
    document.querySelectorAll(".ix-tape-track").forEach((track) => {
      const list = track.querySelector("ol");
      if (!list) return;
      const copy = list.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      copy.querySelectorAll("a, button").forEach((n) => n.setAttribute("tabindex", "-1"));
      track.append(copy);
    });

    /* ---------- Copy buttons ---------- */
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.dataset.copy;
        try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
        const was = btn.getAttribute("aria-label");
        btn.setAttribute("aria-label", "Copied");
        btn.dataset.copied = "";
        setTimeout(() => { btn.setAttribute("aria-label", was || "Copy"); delete btn.dataset.copied; }, 1600);
      });
    });

    /* ---------- Draw on entry: rulers, dimension lines, frames, ticks. ---------- */
    const drawables = document.querySelectorAll("[data-draw], [data-frame], [data-sheet], [data-type], [data-count]");
    const finish = (el) => {
      el.classList.add("is-drawn");
      if (el.matches("[data-type]")) type(el);
      if (el.matches("[data-count]")) count(el);
    };
    if (!MOTION || !("IntersectionObserver" in window)) {
      drawables.forEach((el) => { el.classList.add("is-drawn"); el.querySelectorAll?.("[data-type] > span").forEach((s) => s.classList.add("is-typed")); if (el.matches("[data-type]")) el.querySelectorAll(":scope > span").forEach((s) => s.classList.add("is-typed")); });
    } else {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { finish(e.target); io.unobserve(e.target); }
      }, { rootMargin: "0px 0px -18% 0px", threshold: 0.12 });
      drawables.forEach((el) => io.observe(el));
    }

    /* Terminal lines print in order; command lines type, output lines land whole. */
    function type(el) {
      const lines = [...el.querySelectorAll(":scope > span")];
      let t = 0;
      lines.forEach((line) => {
        const isCmd = line.dataset.cmd !== undefined;
        const delay = t;
        t += isCmd ? 520 + line.textContent.length * 14 : 160;
        setTimeout(() => {
          line.classList.add("is-typed");
          if (isCmd) {
            line.classList.add("is-typing");
            setTimeout(() => line.classList.remove("is-typing"), 420 + line.textContent.length * 14);
          }
        }, delay);
      });
    }
    /* Counters roll to their value with tabular figures (no layout shift). */
    function count(el) {
      const to = Number(el.dataset.count);
      const dec = (el.dataset.count.split(".")[1] || "").length;
      const start = performance.now();
      const dur = 1100;
      const step = (now) => {
        const k = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - k, 4);
        el.textContent = (to * e).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    /* ---------- Sheets, rail, read head, scrub: one loop. ---------- */
    const sheets = [...document.querySelectorAll("[data-sheet]")];
    const rail = document.querySelector(".ix-rail-marks");
    const railProgress = document.querySelector(".ix-rail-progress");
    const readout = document.querySelector("[data-sheet-readout]");
    const head = document.querySelector(".ix-readhead");
    const scrubs = [...document.querySelectorAll("[data-scrub]")];
    const total = sheets.length;

    if (rail) {
      sheets.forEach((s, i) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${s.id}`;
        a.textContent = String(i + 1).padStart(2, "0");
        a.setAttribute("aria-label", `Sheet ${i + 1}: ${s.dataset.sheet}`);
        li.append(a); rail.append(li);
      });
    }
    const railLinks = rail ? [...rail.querySelectorAll("a")] : [];
    // Any [data-spy] nav (a table of contents) follows the same "here".
    const spyLinks = [...document.querySelectorAll("[data-spy] a[href^='#']")];

    let headY = 0;
    const placeHead = () => {
      // Snap the read head onto a dot row of the fixed reticle.
      headY = Math.round((innerHeight * 0.4) / PITCH) * PITCH + PITCH / 2 - PITCH / 2;
      doc.style.setProperty("--ix-head-y", `${headY + PITCH / 2}px`);
      if (head) {
        const left = head.getBoundingClientRect().left;
        doc.style.setProperty("--ix-head-x", `${-left}px`);
      }
      layoutRail();
    };
    let docH = 1;
    const layoutRail = () => {
      docH = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const scrollable = document.documentElement.scrollHeight;
      sheets.forEach((s, i) => {
        if (!railLinks[i]) return;
        const top = s.getBoundingClientRect().top + scrollY;
        const at = Math.min(0.96, Math.max(0.04, top / scrollable));
        railLinks[i].style.setProperty("--at", `${at * 100}%`);
      });
    };

    let current = -1;
    let lastY = scrollY;
    let energy = 0;
    let ticking = false;

    const frame = () => {
      ticking = false;
      const y = scrollY;
      const vh = innerHeight;

      // read-head energy follows scroll speed and decays. Per-frame values are written on
      // the elements that read them: a custom property set on the root would restyle the
      // whole document every frame.
      energy = Math.min(1, energy * 0.86 + Math.abs(y - lastY) / 60);
      lastY = y;
      if (head) head.style.setProperty("--ix-energy", energy.toFixed(3));
      if (railProgress) railProgress.style.blockSize = `${(y / docH) * 100}%`;

      // Which sheet is "here": by default the one under the read head (about 40% down).
      // A page may set <html data-ix-here="48"> to place "here" at a fixed offset from the
      // top instead (under a held nav): a sheet is here once its top reaches that offset,
      // or the highest point its top can reach before the page ends.
      // (the page height is read live: content rising into place can change it after load)
      const offset = doc.dataset.ixHere ? Number(doc.dataset.ixHere) : NaN;
      const maxScroll = Number.isFinite(offset) ? Math.max(1, doc.scrollHeight - vh) : 0;
      const hereAt = (r) => (Number.isFinite(offset) ? Math.max(offset, r.top + y - maxScroll) + 0.5 : headY + PITCH / 2);
      let idx = 0;
      for (let i = 0; i < sheets.length; i++) { const r = sheets[i].getBoundingClientRect(); if (r.top <= hereAt(r)) idx = i; }
      if (idx !== current) {
        sheets[current]?.classList.remove("is-current");
        sheets[idx]?.classList.add("is-current");
        railLinks.forEach((a, i) => a.setAttribute("aria-current", i === idx ? "true" : "false"));
        spyLinks.forEach((a) => { if (a.getAttribute("href") === `#${sheets[idx]?.id}`) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
        current = idx;
        const name = sheets[idx]?.dataset.sheet || "";
        const no = String(idx + 1).padStart(2, "0");
        if (readout) readout.innerHTML = `<i></i>Sheet <b>${no}</b>/${String(total).padStart(2, "0")}<span class="pct"></span>`;
        if (readout) readout.setAttribute("title", name);
      }
      if (readout && sheets[idx]) {
        const r = sheets[idx].getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (hereAt(r) - r.top) / r.height));
        const pctEl = readout.querySelector(".pct");
        if (pctEl) pctEl.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
      }

      // scrubbed drawings: --p from 0 to 1
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        let p;
        if (el.dataset.scrub === "exit") p = -r.top / Math.max(1, r.height * 0.9);
        else p = (vh * 0.85 - r.top) / (vh * 0.85 + r.height * 0.15);
        p = Math.min(1, Math.max(0, p));
        el.style.setProperty("--p", p.toFixed(4));
      }

      if (energy > 0.002) request();
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

    if (MOTION) {
      addEventListener("scroll", request, { passive: true });
      addEventListener("resize", () => { placeHead(); request(); });
      // the read head's lit dots lean toward the pointer
      addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" || !head) return;
        head.style.setProperty("--ix-focus", `${(e.clientX / innerWidth) * 100}%`);
      }, { passive: true });
    } else {
      scrubs.forEach((el) => el.style.setProperty("--p", el.dataset.still ?? "0"));
      addEventListener("scroll", request, { passive: true });
    }
    placeHead();
    request();
    addEventListener("load", () => { layoutRail(); request(); });
    reduce.addEventListener?.("change", () => location.reload());
  });
})();
