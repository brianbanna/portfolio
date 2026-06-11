"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const getEmail = () => "briannbanna" + "@" + "gmail.com";

const handleEmailClick = (e: React.MouseEvent) => {
  e.preventDefault();
  window.location.href = `mailto:${getEmail()}`;
};

export const Footer: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-bg section-rail overflow-hidden">
      {/* Colophon row: modest italic serif mark + mono meta */}
      <div className="editorial pt-14 md:pt-16 pb-10 md:pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6">
          <Link
            href="/#home"
            className="font-serif italic font-normal text-2xl md:text-3xl text-fg/85 hover:text-accent transition-colors"
          >
            Brian Banna.
          </Link>
          <div className="flex items-baseline gap-6">
            <span className="label">Direct</span>
            <ul className="flex items-baseline gap-5 font-mono text-[13px] text-fg/70">
              <li>
                <button
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
        <span>© {year} Brian Banna</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
};
