// Renders every component card of the design system in each theme and mode
// (ADR-UIP-VIS-002 item 4): design-system/rendered/<theme>/<Name>.<mode>.png.
//
//   npm ci && npx playwright install chromium
//   node scripts/render-cards.mjs [--theme scnx-saas] [--check]
//
// The themes are the ones scripts/sync-tokens.json syncs from @scnx/system. A card is
// framed as a theme root: <html data-scnx-theme="<theme>" data-scnx-resolved-mode="<mode>">
// with the package's tokens/css/<theme>.css and the shared components/bundle.css. The viewport is 880 px wide
// (Cover 960) and as tall as the card's "@dsCard ... height=N" comment. With --check
// nothing is written; the run fails if a render differs from the committed PNG in size
// or in more than 0.1% of its pixels. Font rasterization differs between machines, so
// the comparison tolerates anti-aliasing (a channel-sum difference of 24 or less) rather
// than comparing bytes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DS = path.join(ROOT, "design-system");
const MODES = ["light", "dark"];
const arg = (flag) => (process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : undefined);
const check = process.argv.includes("--check");
const sync = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "sync-tokens.json"), "utf8"));
const TOKENS = path.join(ROOT, sync.out, "tokens", "css");
const themes = arg("--theme") ? [arg("--theme")] : sync.themes;
for (const theme of themes) {
  if (!fs.existsSync(path.join(TOKENS, `${theme}.css`))) throw new Error(`${theme}: no tokens in ${path.relative(ROOT, TOKENS)}; run npm run sync:tokens`);
}
// the package declares the Inter faces; bundle.css reads the two family names
const FAMILIES = `<style>:root{--font-sans:Inter,-apple-system,Arial,sans-serif;--font-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}</style>`;
const cards = fs.readdirSync(path.join(DS, "components"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(DS, "components", d.name, "preview.html")))
  .map((d) => d.name)
  .sort();

const TOLERANCE = 0.001;
/** Share of pixels whose RGB channels differ by more than 24 in sum; Infinity when sizes differ. */
function pixelDifference(a, b) {
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) return Infinity;
  let changed = 0;
  for (let i = 0; i < A.data.length; i += 4) {
    const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d > 24) changed += 1;
  }
  return changed / (A.width * A.height);
}

const TYPES = { ".css": "text/css", ".html": "text/html", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
// CHROMIUM_PATH points at an installed Chromium when Playwright's own download is not used.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const failures = [];
let count = 0;
for (const theme of themes) {
  const out = path.join(DS, "rendered", theme);
  fs.mkdirSync(out, { recursive: true });
  for (const mode of MODES) {
    for (const name of cards) {
      const source = fs.readFileSync(path.join(DS, "components", name, "preview.html"), "utf8");
      const height = Number(/height=(\d+)/.exec(source)?.[1] ?? 120);
      const html = source
        .replace("<html", `<html data-scnx-theme="${theme}" data-scnx-resolved-mode="${mode}"`)
        .replace("<head>", `<head><link rel="stylesheet" href="/${path.relative(ROOT, TOKENS).replaceAll("\\", "/")}/${theme}.css"><link rel="stylesheet" href="/design-system/components/bundle.css">${FAMILIES}`);
      const page = await browser.newPage({ viewport: { width: name === "Cover" ? 960 : 880, height } });
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.route("http://cards.local/**", (route) => {
        const url = new URL(route.request().url());
        if (url.pathname === "/card.html") return route.fulfill({ contentType: "text/html", body: html });
        const file = path.join(ROOT, decodeURIComponent(url.pathname));
        if (!file.startsWith(ROOT) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
        return route.fulfill({ contentType: TYPES[path.extname(file)] ?? "application/octet-stream", body: fs.readFileSync(file) });
      });
      await page.goto("http://cards.local/card.html", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      // Animations (Spinner, Skeleton) are stopped so a render is the same on every run.
      let png;
      try {
        png = await page.screenshot({ animations: "disabled", timeout: 15000 });
      } catch (error) {
        throw new Error(`${theme}/${mode}/${name}: ${error.message.split("\n")[0]}`);
      }
      await page.close();
      const file = path.join(out, `${name}.${mode}.png`);
      if (errors.length) failures.push(`${theme}/${mode}/${name}: ${errors.join("; ")}`);
      if (check) {
        const ratio = fs.existsSync(file) ? pixelDifference(fs.readFileSync(file), png) : Infinity;
        if (ratio > TOLERANCE) failures.push(`${path.relative(ROOT, file)} differs from a fresh render (${ratio === Infinity ? "size" : `${(ratio * 100).toFixed(2)}% of pixels`})`);
      } else fs.writeFileSync(file, png);
      count += 1;
    }
  }
}
await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`${check ? "Checked" : "Rendered"} ${count} cards (${themes.join(", ")} × ${MODES.join(", ")})`);
