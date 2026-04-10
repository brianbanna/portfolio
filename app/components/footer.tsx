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
    <footer className="relative bg-bg border-t border-fg/10 overflow-hidden">
      <div className="editorial pt-20 md:pt-28 pb-10 md:pb-14">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <Link
              href="#home"
              className="display text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] text-fg tracking-tightest block hover:text-accent transition-colors"
            >
              Brian Banna.
            </Link>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-end">
            <div className="label mb-3">Direct</div>
            <ul className="font-mono text-[13px] text-fg/70 space-y-1">
              <li>
                <button
                  onClick={handleEmailClick}
                  className="link-draw hover:text-fg"
                >
                  Email
                </button>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/brianbanna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw hover:text-fg"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/brianbanna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw hover:text-fg"
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
