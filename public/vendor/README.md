# Vendored libraries (served from /vendor/)

Pinned, self hosted copies so the showcase pages do not depend on a third party CDN.

| File | Package | Version | Source |
|---|---|---|---|
| plotly-basic-2.27.0.min.js | plotly.js-basic-dist-min | 2.27.0 | `plotly-basic.min.js` from the npm package, unmodified |

The power page's own bundles live in `public/power-price-transmission/js/vendor/`
(d3 7.9.0, topojson-client 3.1.0, scrollama 3.2.0), each a single ESM file built with
`esbuild <entry> --bundle --format=esm --minify --target=es2019`, where the entry
re-exports the package (`export * from "d3"`, `export * from "topojson-client"`,
`export { default } from "scrollama"`).

File names carry the version and the files never change in place, so they are
served with an immutable Cache-Control (see public/.htaccess). To upgrade, add a
new file with the new version in its name and update the referencing page.
