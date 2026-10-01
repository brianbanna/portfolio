# Vendored libraries for the showcase pages

Pinned, self hosted copies so the static showcase pages do not depend on a
third party CDN. This README is kept out of `public/` so it is not deployed.

| Served at | Package | Version | Licence |
|---|---|---|---|
| `/vendor/plotly-basic-2.27.0.min.js` | plotly.js-basic-dist-min | 2.27.0 | MIT (header kept) |
| `/power-price-transmission/js/vendor/d3-7.9.0.min.js` | d3 | 7.9.0 | ISC (banner added) |
| `/power-price-transmission/js/vendor/topojson-client-3.1.0.min.js` | topojson-client | 3.1.0 | ISC (banner added) |
| `/power-price-transmission/js/vendor/scrollama-3.2.0.min.js` | scrollama | 3.2.0 | MIT (banner added) |

`plotly-basic.min.js` is copied unmodified from the npm package (byte identical
to jsdelivr's `plotly.js-basic-dist-min@2.27.0`). The 2 Plotly pages only use
scatter traces and layout shapes, which the basic bundle covers.

The other 3 are single file ESM bundles built with esbuild 0.18.20 from an
entry that re-exports the package:

```sh
# entries/d3.js:        export * from "d3";
# entries/topojson.js:  export * from "topojson-client";
# entries/scrollama.js: export { default } from "scrollama";
npm i d3@7.9.0 topojson-client@3.1.0 scrollama@3.2.0
esbuild entries/d3.js --bundle --format=esm --minify --target=es2019 \
  --legal-comments=inline --banner:js="/*! d3 7.9.0 | ISC License | ... */" \
  --outfile=public/power-price-transmission/js/vendor/d3-7.9.0.min.js
```

Resolved dependency set of the current build (npm caret ranges, so record any
change here when rebuilding): d3-array 3.2.4, d3-axis 3.0.0, d3-brush 3.0.0,
d3-chord 3.0.1, d3-color 3.1.0, d3-contour 4.0.2, d3-delaunay 6.0.4,
d3-dispatch 3.0.1, d3-drag 3.0.0, d3-dsv 3.0.1, d3-ease 3.0.1, d3-fetch 3.0.1,
d3-force 3.0.0, d3-format 3.1.2, d3-geo 3.1.1, d3-hierarchy 3.1.2,
d3-interpolate 3.0.1, d3-path 3.1.0, d3-polygon 3.0.1, d3-quadtree 3.0.1,
d3-random 3.0.1, d3-scale 4.0.2, d3-scale-chromatic 3.1.0, d3-selection 3.0.0,
d3-shape 3.2.0, d3-time 3.1.0, d3-time-format 4.1.0, d3-timer 3.0.1,
d3-transition 3.0.1, d3-zoom 3.0.0, delaunator 5.1.0, internmap 2.0.3,
robust-predicates 3.0.3.

jsdelivr's `d3@7/+esm` resolved d3-format 3.1.0 at the time of vendoring; 3.1.2
only changes `formatPrefix` suffixes and NaN handling for the `s` type, and the
power page never calls `d3.format`. Every other subpackage matches.

File names carry the version and never change in place, so `public/.htaccess`
serves `/vendor/*-x.y.z.min.js` as immutable. To upgrade, add a new file with
the new version in its name and update the referencing page.
