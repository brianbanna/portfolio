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

const BASE = process.argv[2] || "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` :: ${detail}` : ""}`);
};

const counter = (page) =>
  page.evaluate(() => {
    const el = document.querySelector("[aria-roledescription='carousel'] span[aria-live]");
    return el ? el.textContent.replace(/\s+/g, " ").trim() : null;
  });

(async () => {
  const browser = await engine.launch();

  // Desktop: console errors, autoplay reset, keyboard, canvas pause
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      window.__rafCount = 0;
      const orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => orig((t) => { window.__rafCount++; cb(t); });
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await sleep(1500);
    check("desktop: no console errors/warnings on load", errors.length === 0, errors.join(" | "));

    // Canvas loop runs at top, stops when hero is scrolled away
    await page.evaluate(() => { window.__rafCount = 0; });
    await sleep(2000);
    const rafTop = await page.evaluate(() => window.__rafCount);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(800);
    await page.evaluate(() => { window.__rafCount = 0; });
    await sleep(2000);
    const rafBottom = await page.evaluate(() => window.__rafCount);
    check("hero canvas: rAF loop runs in view and stops off screen", rafTop > 60 && rafBottom < 10, `in view ${rafTop}/2s, off screen ${rafBottom}/2s`);

    // Autoplay restarts after a manual click (no double advance). The timer
    // starts when the slider scrolls into view (T0), so timings count from there.
    await page.evaluate(() => document.getElementById("projects").scrollIntoView());
    await page.mouse.move(5, 5);
    await sleep(300);
    const c0 = await counter(page); // T0+0.3s
    await sleep(3500);
    await page.click("button[aria-label='Next project']"); // T0+3.8s: 02, timer restarts (fires at T0+8.8s)
    await page.mouse.move(5, 5); // leave the region so hover pause does not mask the result
    await page.evaluate(() => document.activeElement?.blur()); // focus inside the carousel also pauses
    const c1 = await counter(page);
    await sleep(2000);
    const c2 = await counter(page); // T0+5.8s: the un-reset timer would have fired at T0+5s
    await sleep(3800);
    const c3 = await counter(page); // T0+9.6s: restarted timer has fired once
    check("slider: manual click restarts the 5s timer", c0 === "01 / 07" && c1 === "02 / 07" && c2 === "02 / 07" && c3 === "03 / 07", `${c0} -> ${c1} -> ${c2} -> ${c3}`);

    // Pause control stops autoplay
    await page.click("button[aria-label='Pause autoplay']");
    await page.mouse.move(5, 5);
    const p0 = await counter(page);
    await sleep(6000);
    const p1 = await counter(page);
    check("slider: pause control stops autoplay", p0 === p1, `${p0} -> ${p1}`);
    await page.click("button[aria-label='Resume autoplay']");
    await page.mouse.move(5, 5);

    // Keyboard arrows navigate when focus is inside the carousel
    await page.focus("button[aria-label='Next project']");
    const k0 = await counter(page);
    await page.keyboard.press("ArrowRight");
    await sleep(200);
    const k1 = await counter(page);
    await page.keyboard.press("ArrowLeft");
    await sleep(200);
    const k2 = await counter(page);
    check("slider: arrow keys navigate", k1 !== k0 && k2 === k0, `${k0} -> ${k1} -> ${k2}`);

    // Keyboard focus inside the carousel holds the rotation
    await page.evaluate(() => document.activeElement?.blur());
    await page.mouse.move(5, 5);
    await page.focus("button[aria-label='Pause autoplay']");
    const f0 = await counter(page);
    await sleep(6000);
    const f1 = await counter(page);
    await page.evaluate(() => document.activeElement?.blur());
    check("slider: focus inside the carousel pauses autoplay", f0 === f1, `${f0} -> ${f1}`);

    // Inactive card links are not tabbable, active ones are
    const tabbable = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("[aria-roledescription='carousel'] div[style*='perspective'] > div")];
      return cards.map((c) => ({ hidden: c.getAttribute("aria-hidden"), links: [...c.querySelectorAll("a")].map((a) => a.tabIndex) }));
    });
    const bad = tabbable.filter((c) => c.hidden === "true" && c.links.some((t) => t !== -1));
    check("slider: inactive cards are aria-hidden with untabbable links", bad.length === 0 && tabbable.length === 7, JSON.stringify(tabbable));

    // Index jump of 2+ positions: stage fades out and back, cards land in place
    await page.evaluate(() => document.activeElement?.blur());
    const jump = await page.evaluate(async () => {
      const root = document.querySelector("[aria-roledescription='carousel']");
      const stage = root.querySelector("div[style*='perspective']");
      const rows = [...root.querySelectorAll("button[aria-current], .grid button")].filter((b) => /^\d\d/.test(b.textContent.trim()));
      const from = Number(root.querySelector("span[aria-live]").textContent.slice(0, 2)) - 1;
      const to = (from + 3) % rows.length;
      rows[to].click();
      const samples = [];
      const t0 = performance.now();
      while (performance.now() - t0 < 900) {
        samples.push(Number(getComputedStyle(stage).opacity));
        await new Promise((r) => requestAnimationFrame(r));
      }
      const active = [...stage.children].find((c) => c.getAttribute("aria-hidden") !== "true");
      return {
        from: from + 1,
        to: to + 1,
        minOpacity: Math.min(...samples),
        endOpacity: samples[samples.length - 1],
        counter: root.querySelector("span[aria-live]").textContent.trim(),
        activeTransform: active?.style.transform,
      };
    });
    check(
      "slider: index jump of 3 crossfades the stage and lands centred",
      jump.minOpacity < 0.2 && jump.endOpacity === 1 && jump.counter.startsWith(String(jump.to).padStart(2, "0")) && /none|translateX\(0px\)/.test(jump.activeTransform || "none"),
      JSON.stringify(jump)
    );

    // Races during a jump's 150 ms fade out: the stage must never stay hidden,
    // and the latest action must win on top of the pending jump
    const race = (secondAction, delayMs) =>
      page.evaluate(
        async ({ secondAction, delayMs }) => {
          const root = document.querySelector("[aria-roledescription='carousel']");
          const stage = root.querySelector("div[style*='perspective']");
          const rows = () => [...root.querySelectorAll(".grid button")].filter((b) => /^\d\d/.test(b.textContent.trim()));
          const counter = () => root.querySelector("span[aria-live]").textContent.trim().slice(0, 2);
          const wait = (ms) => new Promise((r) => setTimeout(r, ms));
          // Start from 01 with the stage settled
          if (counter() !== "01") { rows()[0].click(); await wait(900); }
          rows()[3].click(); // jump 01 -> 04 (distance 3)
          await wait(delayMs);
          if (secondAction === "index02") rows()[1].click();
          if (secondAction === "index07") rows()[6].click(); // 1 step from 01 via wrap
          if (secondAction === "arrowRight") root.querySelector("button[aria-label='Next project']").click();
          await wait(1200);
          return { counter: counter(), opacity: getComputedStyle(stage).opacity };
        },
        { secondAction, delayMs }
      );
    await page.mouse.move(5, 5);
    const r1 = await race("index02", 40);
    check("slider race: index 02 during jump fade out lands on 02, stage visible", r1.counter === "02" && r1.opacity === "1", JSON.stringify(r1));
    const r2 = await race("index07", 150);
    check("slider race: wrap neighbour 07 at +150ms lands on 07, stage visible", r2.counter === "07" && r2.opacity === "1", JSON.stringify(r2));
    const r3 = await race("arrowRight", 40);
    check("slider race: Next during jump fade out applies on top of the jump (05)", r3.counter === "05" && r3.opacity === "1", JSON.stringify(r3));

    // Card CTAs: visual pill stays small, hit area reaches 44px
    const cta = await page.evaluate(() => {
      const a = [...document.querySelectorAll("[aria-roledescription='carousel'] a")].find((x) => x.tabIndex === 0);
      if (!a) return null;
      const r = a.getBoundingClientRect();
      const before = getComputedStyle(a, "::before");
      return { h: Math.round(r.height), hit: Math.round(r.height + 2 * Math.abs(parseFloat(before.top))) };
    });
    check("slider: card CTA hit area at least 44px", !!cta && cta.hit >= 44, JSON.stringify(cta));

    // Nav click updates the hash and moves focus into the section
    await page.click("nav[aria-label='Primary'] a[href='#about']");
    await sleep(900);
    const hash = await page.evaluate(() => location.hash);
    const focused = await page.evaluate(() => document.activeElement?.id);
    check("nav: hash updates and focus lands in section", hash === "#about" && focused === "about", `hash ${hash}, focus ${focused}`);
    await ctx.close();
  }

  // Reduced motion: no autoplay, hero copy visible immediately
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await sleep(300);
    const taglineOpacity = await page.evaluate(() => getComputedStyle(document.querySelector("#home p")).opacity);
    await page.evaluate(() => document.getElementById("projects").scrollIntoView());
    await page.mouse.move(5, 5);
    const r0 = await counter(page);
    await sleep(6500);
    const r1 = await counter(page);
    check("reduced motion: hero tagline visible within 300ms", Number(taglineOpacity) === 1, `opacity ${taglineOpacity}`);
    check("reduced motion: slider does not autoplay", r0 === r1, `${r0} -> ${r1}`);
    await ctx.close();
  }

  // Mobile: menu dialog behaviour, separator, overflow, tap targets
  {
    const ctx = await browser.newContext(phone("iPhone 13"));
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await sleep(1500);
    check("mobile: no console errors on load", errors.length === 0, errors.join(" | "));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check("mobile: no horizontal overflow", overflow <= 0, `${overflow}px`);

    await page.click("button[aria-label='Toggle menu']");
    await sleep(400);
    const open = await page.evaluate(() => ({
      expanded: document.querySelector("button[aria-label='Toggle menu']").getAttribute("aria-expanded"),
      bodyOverflow: document.body.style.overflow,
      bg: getComputedStyle(document.getElementById("mobile-menu")).backgroundColor,
      focusedText: document.activeElement?.textContent.trim(),
      role: document.getElementById("mobile-menu").getAttribute("role"),
    }));
    check("mobile menu: opaque, scroll locked, focus moved in, aria wired", open.expanded === "true" && open.bodyOverflow === "hidden" && (open.bg.startsWith("rgb(243, 244, 246") || open.bg.startsWith("rgba(243, 244, 246")) && open.focusedText === "Index" && open.role === "dialog", JSON.stringify(open));
    await page.keyboard.press("Escape");
    await sleep(300);
    const closed = await page.evaluate(() => ({
      menu: !!document.getElementById("mobile-menu"),
      bodyOverflow: document.body.style.overflow,
      focusedLabel: document.activeElement?.getAttribute("aria-label"),
    }));
    check("mobile menu: Escape closes, scroll restored, focus returned", !closed.menu && closed.bodyOverflow === "" && closed.focusedLabel === "Toggle menu", JSON.stringify(closed));

    await page.evaluate(() => document.getElementById("projects").scrollIntoView());
    await sleep(800);
    const sep = await page.evaluate(() => {
      const spans = [...document.querySelectorAll("[aria-roledescription='carousel'] .label span")];
      const s = spans.find((x) => x.textContent.trim() === "/");
      return s ? getComputedStyle(s).display : "missing";
    });
    check("mobile: dangling '/' separator hidden", sep === "none", `display ${sep}`);

    const targets = await page.evaluate(() => {
      const q = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; };
      return { prev: q("button[aria-label='Previous project']"), next: q("button[aria-label='Next project']"), stage: Math.round(document.querySelector("div[style*='perspective']").getBoundingClientRect().height) };
    });
    check("mobile: 44px nav buttons and 320px stage", targets.prev === "46x46" && targets.stage === 320, JSON.stringify(targets));
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed (${ENGINE})`);
  process.exit(failed ? 1 : 0);
})();
