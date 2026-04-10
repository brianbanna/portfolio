"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const getEmail = () => "briannbanna" + "@" + "gmail.com";

const handleEmailClick = (e: React.MouseEvent) => {
  e.preventDefault();
  window.location.href = `mailto:${getEmail()}`;
};

const tickerItems = [
  "QUANT RESEARCH",
  "◆",
  "SYSTEMATIC TRADING",
  "◆",
  "COMMODITY MARKETS",
  "◆",
  "REGIME MODELS",
  "◆",
  "TERM STRUCTURES",
  "◆",
  "STAT ARB",
  "◆",
  "EPFL · LAUSANNE",
  "◆",
];

export const Footer: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
    const tick = () => {
      const now = new Date();
      const iso = now.toISOString().replace("T", " ").slice(0, 19);
      setStamp(iso + " UTC");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const ticker = [...tickerItems, ...tickerItems];

  return (
    <footer className="relative bg-bg border-t border-fg/10 overflow-hidden">
      {/* Massive wordmark */}
      <div className="editorial pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-6">
            <div className="label mb-4">Signed off</div>
            <Link
              href="#home"
              className="display text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] text-fg tracking-tightest block hover:text-accent transition-colors"
            >
              Brian<span className="italic-accent text-accent">B</span>anna
              <span className="text-accent">.</span>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-end gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="label mb-2">Based</div>
                <div className="font-mono text-[13px] text-fg/70 leading-relaxed">
                  Lausanne, CH<br />
                  46.5197°N<br />
                  6.5657°E
                </div>
              </div>
              <div>
                <div className="label mb-2">Direct</div>
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
        </div>
      </div>

      {/* Ticker */}
      <div className="relative border-y border-fg/10 py-4 bg-bg overflow-hidden">
        <div className="flex animate-marquee gap-10 whitespace-nowrap font-mono text-[11px] tracking-[0.18em] text-fg/50">
          {ticker.map((t, i) => (
            <span
              key={i}
              className={t === "◆" ? "text-accent" : ""}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="editorial py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 label">
        <div className="flex items-center gap-6">
          <span>© {year} Brian Banna</span>
          <span className="hidden md:inline text-fg/25">/</span>
          <span className="hidden md:inline">All rights reserved</span>
        </div>
        <div className="flex items-center gap-3 tabular-nums">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>{stamp || "———— ——:——:—— UTC"}</span>
        </div>
      </div>
    </footer>
  );
};
