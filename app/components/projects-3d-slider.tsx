"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Github } from "lucide-react";

interface ProjectData {
  title: string;
  description: string;
  url?: string;
  repository?: string;
  image?: string;
}

interface Projects3DSliderProps {
  projects: ProjectData[];
}

// Shared project metadata (kept in sync with the reel variant)
const meta: Record<
  string,
  { tag: string; year: string; domain: string; highlight?: string }
> = {
  "Market Regime Modeling for Systematic Trading": {
    tag: "Systematic / Regime",
    year: "2024",
    domain: "Equity Indices",
    highlight: "0.70 Sharpe · 6-day lead · 15y OOS",
  },
  "Commodity Futures Curve Modeling and Factor Trading": {
    tag: "Factors / Term Structure",
    year: "2024",
    domain: "Commodity Futures",
    highlight: "Cross-sectional · Roll-cost adjusted",
  },
  "Adaptive Statistical Arbitrage in Commodity Spreads": {
    tag: "Stat Arb / Cointegration",
    year: "2024",
    domain: "Commodity Pairs",
    highlight: "Adaptive hedge ratio",
  },
  AirJav: {
    tag: "Signal Processing",
    year: "2024",
    domain: "ADS-B / Aviation",
    highlight: "Real-time flight tracking",
  },
};

export const Projects3DSlider = ({ projects }: Projects3DSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = projects.map((p, i) => ({ ...p, id: i }));

  const slideNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const slidePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isHovered || slides.length === 0) return;
    const interval = setInterval(slideNext, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length, slideNext]);

  const getSlideStyle = (index: number) => {
    const total = slides.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const abs = Math.abs(diff);
    let x = diff * 340;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;

    if (diff === 0) {
      scale = 1;
      opacity = 1;
    } else if (abs === 1) {
      x = diff * 360;
      rotateY = diff * -32;
      scale = 0.82;
      opacity = 0.55;
    } else if (abs === 2) {
      x = diff * 310;
      rotateY = diff * -44;
      scale = 0.66;
      opacity = 0.28;
    } else {
      x = diff * 260;
      rotateY = diff * -50;
      scale = 0.5;
      opacity = 0;
    }

    return { x, rotateY, scale, opacity, zIndex: 10 - abs };
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-fg/60 text-lg">Projects coming soon.</p>
      </div>
    );
  }

  const active = slides[currentIndex];
  const activeMeta = meta[active.title];
  const activeNum = String(currentIndex + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Metadata header — reads like a research plate caption */}
      <div className="editorial mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-5 label">
            <span className="text-accent tabular-nums">({activeNum})</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={active.title + "tag"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {activeMeta?.tag || "Project"}
              </motion.span>
            </AnimatePresence>
            <span className="text-fg/25">/</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={active.title + "domain"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="hidden md:inline"
              >
                {activeMeta?.domain}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-6 label tabular-nums">
            <span>{activeMeta?.year}</span>
            <span className="text-fg/25">/</span>
            <span>
              {activeNum} — {total}
            </span>
          </div>
        </div>
      </div>

      {/* 3D carousel stage */}
      <div className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center overflow-hidden">
        {/* Side fade masks */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg z-20 pointer-events-none" />

        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: "1400px" }}
        >
          {slides.map((slide, index) => {
            const style = getSlideStyle(index);
            const isActive = index === currentIndex;

            return (
              <motion.div
                key={slide.id}
                className="absolute"
                initial={false}
                animate={{
                  x: style.x,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 32,
                  mass: 1,
                }}
                style={{
                  zIndex: isActive ? 15 : style.zIndex,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div
                  className="relative w-[320px] md:w-[520px] aspect-[4/3] overflow-hidden group bg-paper border border-fg/15"
                  style={{
                    boxShadow: isActive
                      ? "0 40px 80px -20px rgba(0,0,0,0.9), 0 0 80px -20px rgba(247,185,85,0.15)"
                      : "0 20px 50px -15px rgba(0,0,0,0.7)",
                  }}
                >
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`w-full h-full object-cover transition-all duration-[1200ms] ${
                        isActive
                          ? "grayscale-0 scale-100"
                          : "grayscale contrast-125 scale-105"
                      }`}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fg/10 to-fg/0 flex items-center justify-center">
                      <span className="display text-9xl text-fg/10 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Editorial scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent pointer-events-none" />

                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-fg/50" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-fg/50" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-fg/50" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-fg/50" />

                  {/* Number overlay */}
                  <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.18em] text-fg/60 uppercase">
                    {String(index + 1).padStart(2, "0")} / {total}
                  </div>

                  {/* Title + actions only on active */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <h3 className="display text-xl md:text-3xl text-fg leading-[1] mb-2 text-balance">
                      {slide.title}
                    </h3>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {meta[slide.title]?.highlight && (
                          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] text-accent/90 uppercase tracking-wide">
                            <span className="w-5 h-px bg-accent/60" />
                            {meta[slide.title]?.highlight}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {slide.url && (
                            <a
                              href={slide.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 bg-fg text-bg font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-accent transition-colors"
                            >
                              Live
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                          {slide.repository && (
                            <a
                              href={`https://github.com/${slide.repository}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-fg/25 text-fg/80 hover:text-fg hover:border-fg/60 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                            >
                              <Github className="w-3 h-3" />
                              Source
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Active accent line */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-accent/70" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nav buttons */}
        <button
          onClick={slidePrev}
          className="absolute left-2 md:left-8 z-30 p-2.5 border border-fg/20 bg-bg/60 backdrop-blur-sm hover:bg-fg/10 hover:border-fg/50 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-fg/70 group-hover:text-fg" />
        </button>
        <button
          onClick={slideNext}
          className="absolute right-2 md:right-8 z-30 p-2.5 border border-fg/20 bg-bg/60 backdrop-blur-sm hover:bg-fg/10 hover:border-fg/50 transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-fg/70" />
        </button>
      </div>

      {/* Footer: description + indicator rail */}
      <div className="editorial mt-8 md:mt-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.p
                key={active.title + "desc"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="font-serif text-lg md:text-xl leading-[1.55] text-fg/80 text-pretty max-w-2xl"
              >
                {active.description}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
            <div className="label">Index</div>
            <div className="flex flex-col gap-2">
              {slides.map((s, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIndex(i)}
                    className="group flex items-center gap-4 text-left"
                  >
                    <span
                      className={`font-mono text-[10px] tabular-nums transition-colors ${
                        isActive ? "text-accent" : "text-fg/35"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`h-px transition-all duration-500 ${
                        isActive
                          ? "w-16 bg-accent"
                          : "w-8 bg-fg/20 group-hover:w-12 group-hover:bg-fg/50"
                      }`}
                    />
                    <span
                      className={`font-serif text-sm md:text-base leading-tight transition-colors text-balance ${
                        isActive
                          ? "text-fg"
                          : "text-fg/45 group-hover:text-fg/80"
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects3DSlider;
