// Response header checks for the Apache host (public/.htaccess). The python
// static server used by the browser suites ignores .htaccess, so run this
// against the live site after a deploy, or against a local Apache:
//   node scripts/audit/headers-check.mjs https://brianbanna.com
// Cache-Control is compared as an exact string: a duplicated header arrives
// joined ("no-cache, public, ...") and fails, which is the failure mode to catch.

const BASE = (process.argv[2] || "https://brianbanna.com").replace(/\/$/, "");
const NO_CACHE = "no-cache";
const IMMUTABLE = "public, max-age=31536000, immutable";
const WEEK = "public, max-age=604800";

const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` :: ${detail}` : ""}`);
};

const head = async (path, init = {}) => {
  const res = await fetch(BASE + path, { redirect: "manual", ...init, headers: { "accept-encoding": "gzip", ...(init.headers || {}) } });
  await res.arrayBuffer();
  return res;
};

const html = await (await fetch(`${BASE}/`)).text();
const chunk = html.match(/\/_next\/static\/chunks\/[^"]+\.js/)?.[0];
const css = html.match(/\/_next\/static\/css\/[^"]+\.css/)?.[0];
if (!chunk || !css) throw new Error("could not find a /_next/ chunk and stylesheet in the homepage HTML");

const expectations = [
  ["/", NO_CACHE, true],
  [chunk, IMMUTABLE, true],
  [css, IMMUTABLE, true],
  ["/vendor/plotly-basic-2.27.0.min.js", IMMUTABLE, true],
  ["/power-price-transmission/js/vendor/d3-7.9.0.min.js", IMMUTABLE, true],
  ["/power-price-transmission/js/main.js", NO_CACHE, true],
  ["/commodity-curve-factors/css/style.css", NO_CACHE, true],
  ["/power-price-transmission/", NO_CACHE, true],
  ["/sitemap.xml", NO_CACHE, false],
  ["/images/projects/vol.jpg", WEEK, false],
  ["/power-price-transmission/data/processed/map.topojson", WEEK, true],
];

for (const [path, cacheControl, gzip] of expectations) {
  const res = await head(path);
  const cc = res.headers.get("cache-control");
  const enc = res.headers.get("content-encoding");
  const ok = res.status === 200 && cc === cacheControl && (!gzip || enc === "gzip");
  check(`${path}`, ok, `status ${res.status}, cache-control "${cc}", encoding ${enc ?? "none"}`);
}

const topo = await head("/power-price-transmission/data/processed/map.topojson");
check("topojson content type", (topo.headers.get("content-type") || "").startsWith("application/json"), topo.headers.get("content-type"));

const first = await head("/");
const etag = first.headers.get("etag");
const again = await head("/", { headers: { "if-none-match": etag } });
check("homepage revalidates to 304 with gzip", again.status === 304, `etag ${etag}, status ${again.status}`);

for (const path of ["/this-page-does-not-exist/", "/notes/"]) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const body = await res.text();
  check(`${path} is a real 404 with the site's page`, res.status === 404 && /Page not found/.test(body), `status ${res.status}`);
}

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} header checks passed (${BASE})`);
process.exit(failed ? 1 : 0);
