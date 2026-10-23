// Renders every component card of the design system in each theme and mode
// (ADR-UIP-VIS-002 item 4): design-system/themes/<theme>/rendered/<Name>.<mode>.png.
//
//   npm ci && npx playwright install chromium
//   node scripts/render-cards.mjs [--theme default] [--check]
//
// A card is framed as the design tool frames it: <html data-theme="<mode>"> with the
// theme's tokens.css and the shared components/bundle.css. The viewport is 880 px wide
// (Cover 960) and as tall as the card's "@dsCard ... height=N" comment. With --check
// nothing is written; the run fails if any render differs from the committed PNG.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DS = path.join(ROOT, "design-system");
const MODES = ["light", "dark"];
const arg = (flag) => (process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : undefined);
const check = process.argv.includes("--check");
const themes = arg("--theme") ? [arg("--theme")] : fs.readdirSync(path.join(DS, "themes"));
const cards = fs.readdirSync(path.join(DS, "components"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(DS, "components", d.name, "preview.html")))
  .map((d) => d.name)
  .sort();

const TYPES = { ".css": "text/css", ".html": "text/html", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
// CHROMIUM_PATH points at an installed Chromium when Playwright's own download is not used.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const failures = [];
let count = 0;
for (const theme of themes) {
  const out = path.join(DS, "themes", theme, "rendered");
  fs.mkdirSync(out, { recursive: true });
  for (const mode of MODES) {
    for (const name of cards) {
      const source = fs.readFileSync(path.join(DS, "components", name, "preview.html"), "utf8");
      const height = Number(/height=(\d+)/.exec(source)?.[1] ?? 120);
      const html = source
        .replace("<html", `<html data-theme="${mode}"`)
        .replace("<head>", `<head><link rel="stylesheet" href="/design-system/themes/${theme}/tokens.css"><link rel="stylesheet" href="/design-system/components/bundle.css">`);
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
      await page.goto("http://cards.local/card.html");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const png = await page.screenshot();
      await page.close();
      const file = path.join(out, `${name}.${mode}.png`);
      if (errors.length) failures.push(`${theme}/${mode}/${name}: ${errors.join("; ")}`);
      if (check) {
        if (!fs.existsSync(file) || !fs.readFileSync(file).equals(png)) failures.push(`${path.relative(ROOT, file)} differs from a fresh render`);
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
