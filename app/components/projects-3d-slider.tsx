"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Github,
  Pause,
  Play,
} from "lucide-react";

interface ProjectData {
  title: string;
  description: string;
  question?: string;
  url?: string;
  repository?: string;
  image?: string;
  imageAlt?: string;
}

interface Projects3DSliderProps {
  projects: ProjectData[];
}

// Shared project metadata
const meta: Record<
  string,
  { tag: string; domain: string; highlight?: string }
> = {
  "Market Regime Modeling for Systematic Trading": {
    tag: "Regime Detection",
    domain: "US Equities",
    highlight: "HMM · GARCH · GMM · Sharpe 0.70",
  },
  "Cross-Border Price Transmission in European Power Markets": {
    tag: "Power Markets / Transmission",
    domain: "European Electricity",
    highlight: "ENTSO-E · 301k hours · 5 zones",
  },
  "Commodity Futures Curve Modeling and Factor Trading": {
    tag: "Futures Curves / Factors",
    domain: "Commodity Futures",
    highlight: "19 markets · 2.4M obs · roll adjusted",
  },
  "Multi Leg Relative Value with Break Detection": {
    tag: "Relative Value / Cointegration",
    domain: "Commodity Baskets",
    highlight: "In progress · Johansen · VECM · Break detection",
  },
  "Day Ahead Power Price Formation": {
    tag: "Power Markets / Price Formation",
    domain: "EPEX Day Ahead",
    highlight: "In progress · EPEX · Merit order · with Axpo",
  },
  "Commodity Volatility Trading": {
    tag: "Volatility / Options",
    domain: "WTI Crude",
    highlight: "In progress · OVX · HAR · Greeks",
  },
  AirJav: {
    tag: "Signal Processing",
    domain: "ADS-B / Aviation",
    highlight: "Java · ADS-B · Signal processing",
  },
};

const AUTOPLAY_MS = 5000;

export const Projects3DSlider = ({ projects }: Projects3DSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // Explicit user pause: auto updating content needs a control (WCAG 2.2.2)
  const [isPaused, setIsPaused] = useState(false);
  // Autoplay only runs while the slider is on screen
  const [inView, setInView] = useState(true);
  // Bumped on every manual navigation so the autoplay timer restarts from 0
  // instead of firing right after the click
  const [autoplayKey, setAutoplayKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const slides = projects.map((p, i) => ({ ...p, id: i }));

  const slideNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const slidePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const restartAutoplay = () => setAutoplayKey((k) => k + 1);
  const goNext = () => {
    slideNext();
    restartAutoplay();
  };
  const goPrev = () => {
    slidePrev();
    restartAutoplay();
  };
  const goTo = (index: number) => {
    setCurrentIndex(index);
    restartAutoplay();
  };

  useEffect(() => {
    if (isHovered || isPaused || !inView || reduceMotion || slides.length < 2)
      return;
    const interval = setInterval(() => {
      // Background tabs throttle timers; skip those ticks so no burst fires on return
      if (document.visibilityState === "visible") slideNext();
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
    // autoplayKey is a deliberate dependency: it restarts the timer on manual navigation
  }, [
    isHovered,
    isPaused,
    inView,
    reduceMotion,
    slides.length,
    slideNext,
    autoplayKey,
  ]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  const cardTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 260, damping: 32, mass: 1 };
  const fade = (duration: number): Transition =>
    reduceMotion ? { duration: 0 } : { duration };

  const getSlideStyle = (index: number) => {
    const total = slides.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const abs = Math.abs(diff);
    let x = diff * 390;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;

    if (diff === 0) {
      scale = 1;
      opacity = 1;
    } else if (abs === 1) {
      x = diff * 415;
      rotateY = diff * -32;
      scale = 0.82;
      opacity = 0.55;
    } else if (abs === 2) {
      x = diff * 355;
      rotateY = diff * -44;
      scale = 0.66;
      opacity = 0.28;
    } else {
      x = diff * 300;
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
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work"
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={onKeyDown}
    >
      {/* Metadata header — reads like a research plate caption */}
      <div className="editorial mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-5 label">
            <span className="text-accent tabular-nums">({activeNum})</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active.title + "tag"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: fade(0.12) }}
                transition={fade(0.3)}
              >
                {activeMeta?.tag || "Project"}
              </motion.span>
            </AnimatePresence>
            <span className="text-fg/25 hidden md:inline">/</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active.title + "domain"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: fade(0.12) }}
                transition={fade(0.3)}
                className="hidden md:inline"
              >
                {activeMeta?.domain}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-6 label tabular-nums">
            {/* Single text node so a live announcement reads the whole counter */}
            <span aria-live={isPaused ? "polite" : "off"}>
              {`${activeNum} / ${total}`}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-pressed={isPaused}
              aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
              className="p-4 -m-4 text-fg/55 hover:text-fg transition-colors"
            >
              {isPaused ? (
                <Play className="w-3 h-3" />
              ) : (
                <Pause className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3D carousel stage */}
      <div className="relative w-full h-[320px] sm:h-[500px] md:h-[620px] flex items-center justify-center overflow-hidden">
        {/* Side fade masks — edge strips only, so the active card is never veiled; off on phones where the side cards are already out of frame */}
        <div className="hidden sm:block absolute inset-y-0 left-0 w-10 md:w-20 lg:w-40 xl:w-56 bg-gradient-to-r from-bg to-transparent z-20 pointer-events-none" />
        <div className="hidden sm:block absolute inset-y-0 right-0 w-10 md:w-20 lg:w-40 xl:w-56 bg-gradient-to-l from-bg to-transparent z-20 pointer-events-none" />

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
                transition={cardTransition}
                style={{
                  zIndex: isActive ? 15 : style.zIndex,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
              >
                <div
                  className="relative w-[310px] sm:w-[400px] md:w-[600px] aspect-[4/3] overflow-hidden group bg-paper border border-fg/15"
                  style={{
                    boxShadow: isActive
                      ? "0 40px 80px -20px rgba(26,23,18,0.18), 0 0 80px -20px rgba(166,72,42,0.12)"
                      : "0 20px 50px -15px rgba(26,23,18,0.12)",
                  }}
                >
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.imageAlt || slide.title}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
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

                  {/* Editorial scrim — dark like the preview artwork, not the page ground;
                      mid stop at 0.4 keeps the title legible on bright artwork */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(20_18_15/0.92)] via-[rgb(20_18_15/0.4)] to-transparent pointer-events-none" />
                  {/* Top scrim so the counter stays legible on light artwork */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgb(20_18_15/0.75)] to-transparent pointer-events-none" />

                  {/* Number overlay */}
                  <div className="absolute top-4 left-4 text-[10px] tracking-[0.18em] text-bg/75 uppercase">
                    {String(index + 1).padStart(2, "0")} / {total}
                  </div>

                  {/* Title + actions. The action block stays mounted on every card and
                      only fades, so the title does not jump when a card becomes active */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <h3 className="display text-xl md:text-3xl text-bg leading-[1] mb-2 text-balance">
                      {slide.title}
                    </h3>
                    <motion.div
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.3, delay: isActive ? 0.15 : 0 }
                      }
                    >
                      {meta[slide.title]?.highlight && (
                        <div className="mb-3 flex items-center gap-2 text-[10px] text-bg/80 uppercase tracking-wide">
                          <span className="w-5 h-px bg-accent" />
                          {meta[slide.title]?.highlight}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {slide.url && (
                          <a
                            href={slide.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isActive ? 0 : -1}
                            className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg text-fg text-[10px] uppercase tracking-[0.14em] hover:bg-accent hover:text-bg transition-colors"
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
                            tabIndex={isActive ? 0 : -1}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-bg/40 text-bg/90 hover:text-bg hover:border-bg/70 text-[10px] uppercase tracking-[0.14em] transition-colors"
                          >
                            <Github className="w-3 h-3" />
                            Source
                          </a>
                        )}
                      </div>
                    </motion.div>
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

        {/* Nav buttons — 44px tap targets */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 md:left-8 z-30 p-3.5 border border-fg/20 bg-bg/60 backdrop-blur-sm hover:bg-fg/10 hover:border-fg/50 transition-all"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-4 h-4 text-fg/70" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 md:right-8 z-30 p-3.5 border border-fg/20 bg-bg/60 backdrop-blur-sm hover:bg-fg/10 hover:border-fg/50 transition-all"
          aria-label="Next project"
        >
          <ChevronRight className="w-4 h-4 text-fg/70" />
        </button>
      </div>

      {/* Footer: description + indicator rail */}
      <div className="editorial mt-8 md:mt-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Every caption is stacked in one grid cell so the block keeps the height of
              the tallest one: no layout jump below the slider on each change */}
          <div className="col-span-12 md:col-span-7 grid">
            {slides.map((s, i) => {
              const isActive = i === currentIndex;
              return (
                <motion.div
                  key={s.id}
                  className="[grid-area:1/1]"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                  transition={fade(0.35)}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                  aria-hidden={!isActive}
                >
                  {s.question && (
                    <p className="text-xl md:text-2xl font-medium leading-[1.35] text-fg text-balance max-w-2xl mb-4">
                      {s.question}
                    </p>
                  )}
                  <p className="text-lg md:text-xl leading-[1.55] text-fg/80 text-pretty max-w-2xl">
                    {s.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
            <div className="label">Index</div>
            <div className="flex flex-col gap-2">
              {slides.map((s, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex items-center gap-4 text-left py-2 md:py-0"
                  >
                    <span
                      className={`text-[10px] tabular-nums transition-colors ${
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
                      className={`text-sm md:text-base leading-tight transition-colors text-balance ${
                        isActive
                          ? "text-fg"
                          : "text-fg/60 group-hover:text-fg/85"
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
