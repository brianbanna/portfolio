"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroCanvas } from "../hero-canvas";

const useClock = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Zurich",
        hour12: false,
      });
      setTime(fmt.format(now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

export const HeroSection: React.FC = () => {
  const time = useClock();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax — hero elements move at different speeds
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background layers drift slower; headline drifts a bit; opacity fades
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const canvasY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const tickerY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-bg flex flex-col"
    >
      {/* Ambient grid (parallax slow) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-[0.45] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden
      />

      {/* Bespoke hero canvas — animated term-structure ribbon */}
      <motion.div
        style={{ y: canvasY }}
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_55%,black_10%,transparent_75%)]"
        aria-hidden
      >
        <HeroCanvas className="absolute inset-0 w-full h-full" />
      </motion.div>

      {/* Amber top glow */}
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgb(247_185_85/0.08),transparent_60%)] pointer-events-none"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      {/* Top meta bar */}
      <div className="relative z-10 pt-24 md:pt-28">
        <div className="editorial">
          <div className="flex items-center justify-between label opacity-0 animate-[fade-in_1.2s_ease-out_0.2s_forwards]">
            <div className="flex items-center gap-8">
              <span>§ 00 — Prologue</span>
              <span className="hidden md:inline">46.5197°N / 6.5657°E</span>
            </div>
            <div className="flex items-center gap-3 tabular-nums">
              <span className="hidden sm:inline">Lausanne</span>
              <span className="w-px h-3 bg-fg/20" />
              <span>CET {time || "——:——:——"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex-1 flex items-center"
      >
        <div className="editorial w-full py-16 md:py-24">
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-end">
            {/* Left rail — role */}
            <div className="col-span-12 md:col-span-3 order-2 md:order-1">
              <div className="opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.6s_forwards]">
                <div className="label mb-3">Discipline</div>
                <div className="font-mono text-sm text-fg/80 leading-relaxed">
                  Quantitative<br />
                  Research &<br />
                  Systematic<br />
                  Trading
                </div>
                <div className="mt-8 hairline" />
                <div className="mt-8">
                  <div className="label mb-3">Based</div>
                  <div className="font-mono text-sm text-fg/80">
                    Lausanne, CH<br />
                    <span className="text-fg/40">EPFL, MSc'26</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Display — name */}
            <motion.div
              style={{ y: headlineY }}
              className="col-span-12 md:col-span-9 order-1 md:order-2"
            >
              <h1 className="display text-fg leading-[0.86] text-balance">
                <span className="block text-[clamp(3.25rem,10vw,10.5rem)] opacity-0 animate-[rise_1.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
                  Brian
                </span>
                <span className="block text-[clamp(3.25rem,10vw,10.5rem)] -mt-2 md:-mt-4 opacity-0 animate-[rise_1.6s_cubic-bezier(0.16,1,0.3,1)_0.25s_forwards]">
                  B<span className="italic-accent text-accent">a</span>nna
                  <span className="text-accent">.</span>
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Bottom row — tagline */}
          <div className="mt-16 md:mt-24 grid grid-cols-12 gap-6 md:gap-8">
            <div className="hidden md:block md:col-span-3" />
            <div className="col-span-12 md:col-span-7 opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.8s_forwards]">
              <p className="font-serif text-xl md:text-2xl lg:text-[26px] leading-[1.4] text-fg/85 text-pretty">
                Building <span className="italic-accent text-accent">systematic</span> models
                that read market dynamics — research on commodity term
                structures, regime classification, and statistical arbitrage.
              </p>
            </div>
            <div className="col-span-12 md:col-span-2 flex md:justify-end items-end opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_1s_forwards]">
              <a
                href="#projects"
                className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg/60 hover:text-fg transition-colors"
              >
                <span>Selected Work</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>

          {/* Chart legend — explains the canvas */}
          <div className="mt-12 md:mt-16 grid grid-cols-12 gap-6 md:gap-8 opacity-0 animate-[fade-in_1.2s_ease-out_1.4s_forwards]">
            <div className="hidden md:block md:col-span-3" />
            <div className="col-span-12 md:col-span-9 flex items-center gap-6 label">
              <div className="flex items-center gap-2">
                <span className="w-4 h-px bg-accent" />
                <span>Active term structure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-px bg-fg/40" />
                <span className="hidden sm:inline">Historical snapshots</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-fg/35">WTI · 13-month tenor</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom hairline frame with ticker */}
      <motion.div
        style={{ y: tickerY }}
        className="relative z-10 border-t border-fg/10"
      >
        <div className="editorial py-4 flex items-center justify-between gap-6 label overflow-hidden">
          <div className="flex items-center gap-6 md:gap-10 min-w-0 overflow-hidden whitespace-nowrap">
            <span className="text-accent">●</span>
            <span>RESEARCH</span>
            <span className="text-fg/25">/</span>
            <span>COMMODITIES</span>
            <span className="text-fg/25">/</span>
            <span className="hidden sm:inline">TERM STRUCTURES</span>
            <span className="hidden sm:inline text-fg/25">/</span>
            <span className="hidden md:inline">REGIME MODELS</span>
            <span className="hidden md:inline text-fg/25">/</span>
            <span className="hidden lg:inline">STAT ARB</span>
          </div>
          <div className="hidden md:block flex-shrink-0 tabular-nums">
            SCROLL ↓
          </div>
        </div>
      </motion.div>
    </section>
  );
};
