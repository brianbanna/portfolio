"use client";
import React from "react";

// Inlined at build time (next.config.mjs env) so server HTML and the first
// client render agree; new Date() at render time mismatched across new year.
const BUILD_YEAR = process.env.NEXT_PUBLIC_BUILD_YEAR;
if (!BUILD_YEAR) {
  throw new Error("NEXT_PUBLIC_BUILD_YEAR is not set; see next.config.mjs env");
}

// Assembled from parts so the minifier cannot fold it into a literal.
const getEmail = () => {
  const user = "briannbanna";
  const domain = "gmail";
  const tld = "com";
  return `${user}@${domain}.${tld}`;
};

const handleEmailClick = (e: React.MouseEvent) => {
  e.preventDefault();
  window.location.href = `mailto:${getEmail()}`;
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-bg section-rail">
      <div className="editorial flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6 py-10 md:py-12">
        <span className="label">© {BUILD_YEAR} Brian Banna</span>
        <ul className="flex items-baseline gap-5 text-[13px] text-fg/70">
          <li>
            <button
              type="button"
              onClick={handleEmailClick}
              className="relative link-draw hover:text-fg before:absolute before:-inset-y-3 before:-inset-x-2 before:content-['']"
            >
              Email
            </button>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/brianbanna"
              target="_blank"
              rel="noopener noreferrer"
              className="relative link-draw hover:text-fg before:absolute before:-inset-y-3 before:-inset-x-2 before:content-['']"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/brianbanna"
              target="_blank"
              rel="noopener noreferrer"
              className="relative link-draw hover:text-fg before:absolute before:-inset-y-3 before:-inset-x-2 before:content-['']"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
