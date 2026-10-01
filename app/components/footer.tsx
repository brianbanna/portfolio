"use client";
import React from "react";
import Link from "next/link";

// Inlined at build time (next.config.mjs env) so server HTML and the first
// client render agree; new Date() at render time mismatched across new year.
const BUILD_YEAR = process.env.NEXT_PUBLIC_BUILD_YEAR ?? "2026";

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
      {/* Colophon row: modest italic serif mark + mono meta */}
      <div className="editorial pt-14 md:pt-16 pb-10 md:pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6">
          <Link
            href="/#home"
            className="display text-2xl md:text-3xl text-fg/85 hover:text-accent transition-colors"
          >
            Brian Banna.
          </Link>
          <div className="flex items-baseline gap-6">
            <span className="label">Direct</span>
            <ul className="flex items-baseline gap-5 text-[13px] text-fg/70">
              <li>
                <button
                  type="button"
                  onClick={handleEmailClick}
                  className="relative link-draw hover:text-fg before:absolute before:-inset-y-3 before:inset-x-0 before:content-['']"
                >
                  Email
                </button>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/brianbanna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative link-draw hover:text-fg before:absolute before:-inset-y-3 before:inset-x-0 before:content-['']"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/brianbanna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative link-draw hover:text-fg before:absolute before:-inset-y-3 before:inset-x-0 before:content-['']"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="editorial pt-6 pb-8 border-t border-fg/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 label">
        <span>© {BUILD_YEAR} Brian Banna</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
};
