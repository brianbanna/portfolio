"use client";
import { useState, useCallback, useEffect, useRef } from "react";
// LazyMotion + m with the domAnimation bundle: the slider only needs animate,
// exit and transitions, not layout or drag, so the full motion bundle is not shipped
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useAnimationControls,
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
    highlight: "HMM, GARCH, GMM, Sharpe 0.70",
  },
  "Cross-Border Price Transmission in European Power Markets": {
    tag: "Power Markets / Transmission",
    domain: "European Electricity",
    highlight: "ENTSO-E, 301k hours, 5 zones",
  },
  "Commodity Futures Curve Modeling and Factor Trading": {
    tag: "Futures Curves / Factors",
    domain: "Commodity Futures",
    highlight: "19 markets, 2.4M obs, roll adjusted",
  },
  "Multi Leg Relative Value with Break Detection": {
    tag: "Relative Value / Cointegration",
    domain: "Commodity Baskets",
    highlight: "In progress, Johansen, VECM, break detection",
  },
  "Day Ahead Power Price Formation": {
    tag: "Power Markets / Price Formation",
    domain: "EPEX Day Ahead",
    highlight: "In progress, EPEX, merit order, with Axpo",
  },
  "Commodity Volatility Trading": {
    tag: "Volatility / Options",
    domain: "WTI Crude",
    highlight: "In progress, OVX, HAR, Greeks",
  },
  AirJav: {
    tag: "Signal Processing",
    domain: "ADS-B / Aviation",
    highlight: "Java, ADS-B, signal processing",
  },
};

const AUTOPLAY_MS = 5000;
const CARD_SIZES = "(max-width: 639px) 310px, (max-width: 767px) 400px, 600px";

function webpSrcSet(src: string) {
  if (!/\.jpe?g$/i.test(src)) return null;
  const at = (suffix: string) => src.replace(/\.jpe?g$/i, suffix);
  return `${at("-640.webp")} 640w, ${at("-960.webp")} 960w, ${at(".webp")} 1200w`;
}

export const Projects3DSlider = ({ projects }: Projects3DSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // Keyboard focus inside the carousel also pauses rotation, or a focused
  // link would rotate away into an aria-hidden card
  const [isFocused, setIsFocused] = useState(false);
  // Explicit user pause: auto updating content needs a control (WCAG 2.2.2)
  const [isPaused, setIsPaused] = useState(false);
  // Autoplay only runs while the slider is on screen
  const [inView, setInView] = useState(true);
  // Bumped on every manual navigation so the autoplay timer restarts from 0
  // instead of firing right after the click
  const [autoplayKey, setAutoplayKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  // Index jumps of 2+ positions would spring every card through its
  // neighbours with z-index swaps mid flight; instead the stage fades out,
  // the cards snap to their new places, and the stage fades back in
  const stageControls = useAnimationControls();
  const [snapCards, setSnapCards] = useState(false);
  const jumpToken = useRef(0);
  const jumpPending = useRef(false);
  const jumpTarget = useRef(0);
  // Bumped each time a jump lands; drives the fade back in
  const [landedJumps, setLandedJumps] = useState(0);

  const slides = projects.map((p, i) => ({ ...p, id: i }));

  const slideNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const slidePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const restartAutoplay = () => setAutoplayKey((k) => k + 1);

  // Snap to the jump's target and schedule the fade back in
  const landJump = (index: number) => {
    jumpPending.current = false;
    setSnapCards(true);
    setCurrentIndex(index);
    setLandedJumps((n) => n + 1);
  };
  // Any navigation that arrives while a jump is fading out commits that jump
  // at once, so the new action applies on top of it and the stage never stays
  // hidden. The token bump drops the jump's own continuation.
  const settlePendingJump = () => {
    if (!jumpPending.current) return;
    jumpToken.current += 1;
    landJump(jumpTarget.current);
  };

  const goNext = () => {
    settlePendingJump();
    slideNext();
    restartAutoplay();
  };
  const goPrev = () => {
    settlePendingJump();
    slidePrev();
    restartAutoplay();
  };
  const goTo = async (index: number) => {
    if (index === currentIndex && !jumpPending.current) return;
    restartAutoplay();
    const span = Math.abs(index - currentIndex);
    const distance = Math.min(span, slides.length - span);
    if (reduceMotion || distance <= 1) {
      settlePendingJump();
      setCurrentIndex(index);
      return;
    }
    const token = ++jumpToken.current;
    jumpPending.current = true;
    jumpTarget.current = index;
    // An interrupted controls animation never resolves, so a superseded jump
    // simply never continues; the token check covers the resolved case
    await stageControls.start({ opacity: 0, transition: { duration: 0.15 } });
    if (token !== jumpToken.current) return;
    landJump(index);
  };

  // Runs after each landing has committed the snapped card positions
  useEffect(() => {
    if (landedJumps === 0) return;
    let cancelled = false;
    stageControls
      .start({ opacity: 1, transition: { duration: 0.25 } })
      .then(() => {
        if (!cancelled) setSnapCards(false);
      });
    return () => {
      cancelled = true;
    };
  }, [landedJumps, stageControls]);

  useEffect(() => {
    if (
      isHovered ||
      isFocused ||
      isPaused ||
      !inView ||
      reduceMotion ||
      slides.length < 2
    )
      return;
    const interval = setInterval(() => {
      // Background tabs throttle timers; skip those ticks so no burst fires on return
      if (document.visibilityState === "visible") slideNext();
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
    // autoplayKey is a deliberate dependency: it restarts the timer on manual navigation
  }, [
    isHovered,
    isFocused,
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

  // Arrow keys navigate and park focus on the matching arrow button, so focus
  // never stays on a card that has just rotated out of view
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
      nextBtnRef.current?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
      prevBtnRef.current?.focus();
    }
  };

  const cardTransition: Transition =
    reduceMotion || snapCards
      ? { duration: 0 }
      : { duration: 0.58, ease: [0.25, 1, 0.35, 1] };
  const fade = (duration: number): Transition =>
    reduceMotion ? { duration: 0 } : { duration };

  const getSlideStyle = (index: number) => {
    const total = slides.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const abs = Math.abs(diff);
    let x = diff * 430;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;

    if (diff === 0) {
      scale = 1;
      opacity = 1;
    } else if (abs === 1) {
      x = diff * 430;
      rotateY = diff * -4;
      scale = 0.95;
      opacity = 0.4;
    } else if (abs === 2) {
      x = diff * 430;
      rotateY = diff * -8;
      scale = 0.9;
      opacity = 0.22;
    } else {
      x = diff * 430;
      rotateY = diff * -8;
      scale = 0.9;
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
    <LazyMotion features={domAnimation} strict>
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work"
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setIsFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      {/* Metadata header — reads like a research plate caption */}
      <div className="editorial mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-5 label">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={`${active.title}-tag`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3, transition: fade(0.12) }}
                transition={fade(0.22)}
                className="text-fg"
              >
                {activeMeta?.tag || "Project"}
              </m.span>
            </AnimatePresence>
            <span className="text-fg/25 hidden md:inline">/</span>
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={`${active.title}-domain`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3, transition: fade(0.12) }}
                transition={fade(0.22)}
                className="hidden md:inline"
              >
                {activeMeta?.domain}
              </m.span>
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
              className="p-4 -m-4 text-fg/60 hover:text-fg transition-colors"
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
      {/* Phones clip only sideways so the card shadow is not cut by the short stage */}
      <div className="relative w-full h-[320px] sm:h-[500px] md:h-[620px] flex items-center justify-center overflow-x-clip sm:overflow-hidden">
        {/* Side fade masks — edge strips only, so the active card is never veiled; off on phones where the side cards are already out of frame */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-28 bg-gradient-to-r from-bg to-transparent sm:block md:w-40 lg:w-52" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-28 bg-gradient-to-l from-bg to-transparent sm:block md:w-40 lg:w-52" />

        <m.div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: "1800px" }}
          initial={false}
          animate={stageControls}
        >
          {slides.map((slide, index) => {
            const style = getSlideStyle(index);
            const isActive = index === currentIndex;
            const sources = slide.image ? webpSrcSet(slide.image) : null;

            return (
              <m.div
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
                  backfaceVisibility: "hidden",
                  visibility: style.opacity === 0 ? "hidden" : "visible",
                }}
                aria-hidden={!isActive || undefined}
              >
                <div
                  className="relative w-[268px] sm:w-[400px] md:w-[600px] aspect-[4/3] overflow-hidden group bg-paper border border-fg/15"
                  style={{
                    boxShadow: isActive
                      ? "0 18px 36px -22px rgba(17,19,22,0.16)"
                      : "0 10px 24px -18px rgba(17,19,22,0.08)",
                  }}
                >
                  {slide.image ? (
                    <picture>
                      {sources && (
                        <source
                          type="image/webp"
                          srcSet={sources}
                          sizes={CARD_SIZES}
                        />
                      )}
                      <img
                        src={slide.image}
                        alt={slide.imageAlt || slide.title}
                        width={1200}
                        height={900}
                        sizes={CARD_SIZES}
                        loading="lazy"
                        decoding="async"
                        fetchPriority={isActive ? "auto" : "low"}
                        className={`h-full w-full object-cover ${isActive ? "" : "grayscale"}`}
                        draggable={false}
                      />
                    </picture>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fg/10 to-fg/0 flex items-center justify-center">
                      <span className="display text-9xl text-fg/10 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Scrim keeps the title readable on bright artwork */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(17_19_22/0.9)] via-[rgb(17_19_22/0.28)] to-transparent pointer-events-none" />

                  {/* Title + actions. The action block stays mounted on every card and
                      only fades, so the title does not jump when a card becomes active */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <h3 className={`display text-xl md:text-3xl text-bg leading-[1] mb-2 text-balance transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
                      {slide.title}
                    </h3>
                    <m.div
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 4 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.35, delay: isActive ? 0.06 : 0 }
                      }
                    >
                      {meta[slide.title]?.highlight && (
                        <div className="mb-3 flex items-center gap-2 font-sans text-[12px] text-bg/85">
                          <span className="h-px w-5 bg-bg/80" />
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
                            className="group/btn relative inline-flex items-center gap-1.5 bg-bg px-3 py-1.5 font-sans text-[13px] text-fg transition-colors before:absolute before:-inset-y-[9px] before:inset-x-0 before:content-[''] hover:bg-fg hover:text-bg"
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
                            className="relative inline-flex items-center gap-1.5 border border-bg/40 px-3 py-1.5 font-sans text-[13px] text-bg/90 transition-colors before:absolute before:-inset-y-[9px] before:inset-x-0 before:content-[''] hover:border-bg/80 hover:text-bg"
                          >
                            <Github className="w-3 h-3" />
                            Source
                          </a>
                        )}
                      </div>
                    </m.div>
                  </div>

                  {/* Active accent line */}
                </div>
              </m.div>
            );
          })}
        </m.div>

        {/* Nav buttons — 44px tap targets */}
        <button
          ref={prevBtnRef}
          type="button"
          onClick={goPrev}
          className="absolute left-2 md:left-8 z-30 p-3.5 border border-fg/20 bg-bg/90 hover:bg-fg/10 hover:border-fg/50 transition-colors"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-4 h-4 text-fg/70" />
        </button>
        <button
          ref={nextBtnRef}
          type="button"
          onClick={goNext}
          className="absolute right-2 md:right-8 z-30 p-3.5 border border-fg/20 bg-bg/90 hover:bg-fg/10 hover:border-fg/50 transition-colors"
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
                <m.div
                  key={s.id}
                  className="[grid-area:1/1]"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 4,
                    // Hidden captions must not match find in page or select all
                    transitionEnd: { visibility: isActive ? "visible" : "hidden" },
                  }}
                  transition={fade(0.4)}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                  aria-hidden={!isActive || undefined}
                >
                  {s.question && (
                    <p className="mb-4 max-w-2xl font-sans text-xl font-medium leading-[1.35] tracking-[-0.02em] text-fg text-balance md:text-[1.35rem]">
                      {s.question}
                    </p>
                  )}
                  <p className="max-w-2xl font-sans text-[1.0625rem] leading-[1.6] text-fg text-pretty">
                    {s.description}
                  </p>
                </m.div>
              );
            })}
          </div>
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {slides.map((s, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex items-center gap-4 text-left min-h-[44px] md:min-h-0"
                  >
                    <span
                      className={`text-[10px] tabular-nums transition-colors ${
                        isActive ? "text-fg" : "text-muted"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`h-px transition-all duration-300 ease-[cubic-bezier(0.25,1,0.35,1)] ${
                        isActive
                          ? "w-16 bg-fg"
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
    </LazyMotion>
  );
};

export default Projects3DSlider;
