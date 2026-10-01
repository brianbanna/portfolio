// Browser checks for the site audit fixes. Run against a served static build:
//   pnpm build && (cd out && python3 -m http.server 3000)
//   npx playwright install chromium   (once)
//   pnpm check:site                   (or: node scripts/audit/<file> http://localhost:3000)
const playwright = require("playwright");
const { devices } = playwright;
// BROWSER=chromium (default) | firefox | webkit
const ENGINE = process.env.BROWSER || "chromium";
const engine = playwright[ENGINE];
if (!engine) throw new Error(`Unknown BROWSER "${ENGINE}"`);
// Firefox has no mobile emulation mode; keep viewport, scale factor and touch
const phone = (name) => {
  const { isMobile, ...rest } = devices[name];
  return ENGINE === "firefox" ? rest : { isMobile, ...rest };
};
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = path.join(require("os").tmpdir(), "site-audit-showcase");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Only the site itself and Google Fonts may be contacted by the showcase pages
const ALLOWED_HOSTS = new Set([new URL(BASE).host, "fonts.googleapis.com", "fonts.gstatic.com"]);
const foreignHosts = (urls) => [...new Set(urls.map((u) => new URL(u).host))].filter((h) => !ALLOWED_HOSTS.has(h));
const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` :: ${detail}` : ""}`);
};

(async () => {
  const browser = await engine.launch();

  // Power page, desktop: countries are hit testable inside the explorer, sidebar opens on click
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    const requested = [];
    // WebKit reports the spec's benign "ResizeObserver loop completed with undelivered
    // notifications" as a page error when scrollama's observer resizes steps; ignore only that
    page.on("pageerror", (e) => { if (!/^ResizeObserver loop/.test(e.message)) errors.push(e.message); });
    page.on("request", (r) => { if (/^https?:/.test(r.url())) requested.push(r.url()); });
    await page.goto(`${BASE}/power-price-transmission/`, { waitUntil: "networkidle" });
    await sleep(1500);
    await page.evaluate(() => document.getElementById("explorer").scrollIntoView({ block: "start", behavior: "instant" }));
    await sleep(1200);
    const hit = await page.evaluate(() => {
      const de = document.querySelector(".country[data-iso='DE']") || document.querySelector(".country");
      const r = de.getBoundingClientRect();
      const pts = [];
      for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) pts.push([r.left + (r.width * i) / 4, r.top + (r.height * j) / 4]);
      const hits = pts.map(([x, y]) => document.elementFromPoint(x, y)).filter((el) => el?.classList.contains("country")).length;
      return { iso: de.getAttribute("data-iso"), hits, of: pts.length, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
    check("power: countries receive pointer events inside the explorer", hit.hits >= 5, JSON.stringify(hit));
    await page.mouse.click(hit.cx, hit.cy);
    await sleep(600);
    const sidebarOpen = await page.evaluate(() => document.querySelector(".explorer__sidebar").classList.contains("is-open"));
    check("power: clicking a country in the explorer opens the sidebar", sidebarOpen);
    await page.keyboard.press("Escape");
    await sleep(300);
    // During the narrative a click on the map must not open the sidebar
    await page.evaluate(() => document.querySelector("#narrative").scrollIntoView({ block: "start", behavior: "instant" }));
    await sleep(1200);
    const de2 = await page.evaluate(() => { const r = document.querySelector(".country[data-iso='DE']").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await page.mouse.click(de2.x, de2.y);
    await sleep(500);
    const sidebarDuringNarrative = await page.evaluate(() => document.querySelector(".explorer__sidebar").classList.contains("is-open"));
    check("power: map click during the narrative does not open the sidebar", !sidebarDuringNarrative);
    check("power: no page errors", errors.length === 0, errors.join(" | "));
    check("power: no third party script hosts", foreignHosts(requested).length === 0, foreignHosts(requested).join(", "));
    await ctx.close();
  }

  // Power page, phone: legend hidden, clock under the cards
  {
    const ctx = await browser.newContext(phone("iPhone 13"));
    const page = await ctx.newPage();
    await page.goto(`${BASE}/power-price-transmission/`, { waitUntil: "networkidle" });
    await sleep(1500);
    const steps = await page.$$("[data-step], .step");
    const target = steps[Math.min(3, steps.length - 1)];
    if (target) await target.scrollIntoViewIfNeeded();
    await sleep(1500);
    const m = await page.evaluate(() => ({
      legend: getComputedStyle(document.querySelector(".arrow-legend")).display,
      clockZ: getComputedStyle(document.querySelector(".map-clock")).zIndex,
      // html/body are overflow-x: clip on this page; the off canvas sidebar sits past the
      // right edge by design, so the user facing measure is the document scroll width
      docScrollWidth: document.documentElement.scrollWidth,
      inner: window.innerWidth,
    }));
    check("power phone: legend hidden, clock z-index 2, no horizontal scroll", m.legend === "none" && m.clockZ === "2" && m.docScrollWidth <= m.inner, JSON.stringify(m));
    await page.screenshot({ path: path.join(OUT, "power-phone-step4.png") });
    await ctx.close();
  }

  // Power page with its library bundles blocked: loader shows a message
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route("**/power-price-transmission/js/vendor/**", (r) => r.abort());
    const page = await ctx.newPage();
    await page.goto(`${BASE}/power-price-transmission/`, { waitUntil: "domcontentloaded" });
    await sleep(4000);
    const text = await page.evaluate(() => document.querySelector(".app-loading__text")?.textContent ?? "");
    check("power: blocked library bundle surfaces a loader message", /could not load/.test(text), text.trim());
    await ctx.close();
  }

  // Plotly pages with the library blocked: fallback text in chart boxes
  for (const slug of ["commodity-curve-factors", "systematic-regime-trading"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route("**/vendor/plotly-basic-*.js", (r) => r.abort());
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${slug}/`, { waitUntil: "load" });
    await sleep(1000);
    const boxes = await page.evaluate(() => [...document.querySelectorAll(".interactive-chart")].map((el) => el.textContent.trim().slice(0, 40)));
    check(`${slug}: blocked plotly shows fallback text`, boxes.length > 0 && boxes.every((t) => /could not load/.test(t)), JSON.stringify(boxes));
    await ctx.close();
    // And the normal path still renders charts, with no third party requests
    const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p2 = await ctx2.newPage();
    const errs = [];
    const requested2 = [];
    p2.on("pageerror", (e) => errs.push(e.message));
    p2.on("request", (r) => { if (/^https?:/.test(r.url())) requested2.push(r.url()); });
    await p2.goto(`${BASE}/${slug}/`, { waitUntil: "networkidle" });
    await sleep(1500);
    const plots = await p2.evaluate(() => document.querySelectorAll(".js-plotly-plot").length);
    check(`${slug}: charts render from the vendored bundle`, plots >= 1 && errs.length === 0, `${plots} plots, errors: ${errs.join(" | ")}`);
    const figs = await p2.evaluate(async () => {
      const imgs = [...document.querySelectorAll("img")];
      for (const img of imgs) { img.loading = "eager"; img.scrollIntoView(); await new Promise((r) => setTimeout(r, 30)); }
      await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
      return { total: imgs.length, broken: imgs.filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")), maxW: Math.max(...imgs.map((i) => i.naturalWidth)) };
    });
    check(`${slug}: no third party script hosts`, foreignHosts(requested2).length === 0, foreignHosts(requested2).join(", "));
    check(`${slug}: all figures load at <= 2304px`, figs.broken.length === 0 && figs.maxW <= 2304, JSON.stringify(figs));
    await ctx2.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed (${ENGINE})`);
  process.exit(failed ? 1 : 0);
})();
