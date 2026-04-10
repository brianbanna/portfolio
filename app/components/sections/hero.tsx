"use client";
import React, { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "framer-motion";
import { HeroCanvas } from "../hero-canvas";

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax
  const { scrollYProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Raw scroll velocity → smoothed spring → normalized number
  const rawVelocity = useVelocity(scrollY);
  const smoothedVel = useSpring(rawVelocity, {
    damping: 28,
    stiffness: 120,
    mass: 0.5,
  });

  // Parent keeps a ref the canvas reads every frame (no re-renders)
  const velocityRef = useRef(0);
  useEffect(() => {
    const unsub = smoothedVel.on("change", (v) => {
      // Normalize: 2500 px/s maps to ~1.0
      velocityRef.current = Math.max(-3, Math.min(3, v / 2500));
    });
    return () => unsub();
  }, [smoothedVel]);

  const getVelocity = () => velocityRef.current;

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const canvasY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-bg flex flex-col"
    >
      {/* Ambient grid */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden
      />

      {/* Bespoke hero canvas — reacts to scroll velocity */}
      <motion.div
        style={{ y: canvasY }}
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_55%,black_10%,transparent_75%)]"
        aria-hidden
      >
        <HeroCanvas
          className="absolute inset-0 w-full h-full"
          getVelocity={getVelocity}
        />
      </motion.div>

      {/* Warm top glow */}
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgb(214_189_145/0.07),transparent_60%)] pointer-events-none"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      {/* Main content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex-1 flex items-center pt-28 md:pt-36"
      >
        <div className="editorial w-full py-16 md:py-24">
          {/* Section marker */}
          <div className="mb-10 md:mb-14 opacity-0 animate-[fade-in_1.2s_ease-out_0.2s_forwards]">
            <span className="section-marker">§ 00 — Index</span>
          </div>

          {/* Display — name (no colored letters) */}
          <motion.div style={{ y: headlineY }}>
            <h1 className="display text-fg leading-[0.86] text-balance">
              <span className="block text-[clamp(3.25rem,10vw,10.5rem)] opacity-0 animate-[rise_1.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
                Brian
              </span>
              <span className="block text-[clamp(3.25rem,10vw,10.5rem)] -mt-2 md:-mt-4 opacity-0 animate-[rise_1.6s_cubic-bezier(0.16,1,0.3,1)_0.25s_forwards]">
                Banna
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <div className="mt-14 md:mt-20 grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-8 opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.8s_forwards]">
              <p className="font-serif text-xl md:text-2xl lg:text-[26px] leading-[1.45] text-fg/85 text-pretty max-w-3xl">
                Quantitative research, systematic trading, and commodity
                markets. I build models and frameworks to study how markets
                move.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end items-end opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_1s_forwards]">
              <a
                href="#projects"
                className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg/55 hover:text-fg transition-colors"
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
        </div>
      </motion.div>
    </section>
  );
};
