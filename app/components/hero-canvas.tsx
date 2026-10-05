"use client";
import React, { useEffect, useRef } from "react";

/**
 * Animated commodity term-structure ribbon.
 *
 * Draws a stack of forward curves (price vs tenor) that smoothly morph
 * between contango and backwardation regimes. Each curve represents a
 * snapshot in time; the stack evokes the evolution of a forward curve.
 * One curve is highlighted in the accent color as the "current" state.
 *
 * Canvas2D, one RAF loop at display refresh. The bitmap is capped so a
 * retina laptop does not redraw a full 2x viewport, but every frame is
 * painted so the curves do not step. Degrades to one static frame on
 * reduced motion.
 *
 * getVelocity is optional. The homepage does not pass it, so the curves
 * are not tied to scroll.
 */
export const HeroCanvas: React.FC<{
  className?: string;
  getVelocity?: () => number;
}> = ({ className = "", getVelocity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Keep a ref to the latest getVelocity so we never re-run the effect.
  const getVelocityRef = useRef(getVelocity);
  getVelocityRef.current = getVelocity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let dpr = 1;
    let w = 0;
    let h = 0;

    // Cap the bitmap so a retina laptop is not clearing ~6MP a frame, but
    // stay above 1x. Thin strokes at 1x shimmer as they move.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const area = Math.max(w * h, 1);
      let next = Math.min(window.devicePixelRatio || 1, 2);
      const pixels = area * next * next;
      const cap = 2_600_000;
      if (pixels > cap) next *= Math.sqrt(cap / pixels);
      dpr = Math.max(1, next);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Term-structure model
    const TENORS = 13; // 13 contract months along x
    const CURVES = 10; // stacked snapshots in depth

    // Each curve has its own phase, regime (contango ↔ backwardation), curvature
    type CurveParams = {
      phase: number;
      speed: number;
      regime: number; // -1 backwardation, +1 contango
      slope: number;
      curvature: number;
    };

    const curves: CurveParams[] = Array.from({ length: CURVES }, (_, i) => ({
      phase: (i / CURVES) * Math.PI * 2,
      speed: 0.00026 + Math.random() * 0.0002,
      regime: Math.sin((i / CURVES) * Math.PI * 2),
      slope: 0.35 + Math.random() * 0.2,
      curvature: 0.25 + Math.random() * 0.3,
    }));

    // Smoothed scroll velocity — mutated in place inside the RAF loop.
    // Negative sign on the input flips "scroll down = tilt right-downward".
    let smoothedVel = 0;

    // Term-structure function for a given curve at time t.
    // velBias is added to slope so fast scrolling flattens/steepens curves.
    const priceAt = (
      c: CurveParams,
      x: number,
      t: number,
      velBias: number,
    ) => {
      // x in 0..1 (tenor)
      const regime = Math.sin(c.phase + t * c.speed); // slow oscillation
      const slope = regime * c.slope + velBias;
      // asymmetric curvature to feel organic
      const curvature =
        c.curvature * Math.sin(x * Math.PI) * (0.6 + 0.4 * Math.cos(t * 0.0003));
      // gentle wobble at long end
      const wobble = 0.016 * Math.sin(x * 4 + c.phase + t * 0.00035);
      return slope * (x - 0.5) + curvature + wobble;
    };

    let raf = 0;
    let startTime = performance.now();
    // The loop only runs while the hero is on screen in a visible tab; the
    // clock is shifted on resume so the curves continue instead of jumping.
    let running = false;
    let pausedAt = 0;
    let inView = true;

    // One buffer, reused every frame. Allocating inside the loop would
    // hitch the animation on garbage collection.
    const SEGMENTS = 96;
    const pts = new Float32Array((SEGMENTS + 1) * 2);

    // Sample the model, then stroke through midpoints so the ribbon is a
    // curve rather than a faceted polyline.
    const trace = (
      c: CurveParams,
      i: number,
      t: number,
      velBias: number,
      yOffset: number,
      plotW: number,
      plotH: number,
      padX: number,
    ) => {
      for (let s = 0; s <= SEGMENTS; s++) {
        const x01 = s / SEGMENTS;
        const price = priceAt(c, x01, t + i * 120, velBias);
        pts[s * 2] = padX + x01 * plotW;
        pts[s * 2 + 1] = midY + yOffset - price * plotH * 0.42;
      }
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (let s = 1; s < SEGMENTS - 1; s++) {
        const i2 = s * 2;
        const mx = (pts[i2] + pts[i2 + 2]) / 2;
        const my = (pts[i2 + 1] + pts[i2 + 3]) / 2;
        ctx.quadraticCurveTo(pts[i2], pts[i2 + 1], mx, my);
      }
      ctx.lineTo(pts[SEGMENTS * 2], pts[SEGMENTS * 2 + 1]);
    };

    let midY = 0;

    const draw = (now: number) => {
      if (running) raf = requestAnimationFrame(draw);
      const t = prefersReduced ? 0 : now - startTime;

      // Read + smooth velocity. Reduced-motion users get a hard zero.
      if (prefersReduced) {
        smoothedVel = 0;
      } else {
        // Invert so positive scroll-down produces a downward-right tilt.
        const raw = -(getVelocityRef.current?.() ?? 0);
        // Clamp incoming to the documented range to avoid extreme values.
        const clamped = raw < -3 ? -3 : raw > 3 ? 3 : raw;
        smoothedVel += (clamped - smoothedVel) * 0.06;
      }

      const velBias = smoothedVel * 0.05;
      const absVel = Math.abs(smoothedVel);
      const glowBoost = 6 + Math.min(absVel, 2) * 5;
      const dotScale = 1 + Math.min(absVel, 1.5) * 0.8;

      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Layout padding
      const padX = w * 0.06;
      const padY = h * 0.18;
      const plotW = w - padX * 2;
      const plotH = h - padY * 2;
      // Phones have no empty right margin, so the ribbon sits above the name.
      midY = w < 720 ? h * 0.2 : h / 2;

      // Vertical tenor gridlines
      ctx.lineWidth = 1;
      for (let i = 0; i < TENORS; i++) {
        const x = padX + (i / (TENORS - 1)) * plotW;
        ctx.strokeStyle = `rgba(17, 19, 22, ${i === 0 || i === TENORS - 1 ? 0.06 : 0.022})`;
        ctx.beginPath();
        ctx.moveTo(x, padY * 0.4);
        ctx.lineTo(x, h - padY * 0.4);
        ctx.stroke();
      }

      // Horizontal zero line
      ctx.strokeStyle = "rgba(17, 19, 22, 0.05)";
      ctx.beginPath();
      ctx.moveTo(padX, midY);
      ctx.lineTo(w - padX, midY);
      ctx.stroke();

      // Draw curves from back to front
      curves.forEach((c, i) => {
        const depth = i / (CURVES - 1); // 0 back, 1 front
        const isActive = i === CURVES - 1;

        // Stack offset — newer curves shift down slightly for depth
        const yOffset = (depth - 0.5) * plotH * 0.55;

        // Opacity by depth
        const alpha = 0.04 + depth * 0.28;

        trace(c, i, t, velBias, yOffset, plotW, plotH, padX);

        if (isActive) {
          // Glow as 3 wide, very low alpha strokes of the same path, stacked so
          // the falloff has no visible steps. shadowBlur blurred a full viewport
          // layer every frame, which is expensive wherever the canvas is
          // rasterised in software.
          // save/restore keeps the round caps and joins to the halo only (the
          // current path is not part of the saved state, so it survives)
          ctx.save();
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          for (const [alphaStep, widthFactor] of [
            [0.018, 1.0],
            [0.028, 0.55],
            [0.04, 0.25],
          ]) {
            ctx.strokeStyle = `rgba(30, 72, 120, ${alphaStep})`;
            ctx.lineWidth = 1.2 + glowBoost * widthFactor;
            ctx.stroke();
          }
          ctx.restore();
          ctx.strokeStyle = "rgba(30, 72, 120, 0.92)";
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = `rgba(17, 19, 22, ${alpha})`;
          ctx.lineWidth = 0.7 + depth * 0.32;
        }
        ctx.stroke();

        // Tenor ticks on active curve
        if (isActive) {
          ctx.fillStyle = "rgba(30, 72, 120, 0.92)";
          const dotR = 1.3 * dotScale;
          for (let i2 = 0; i2 < TENORS; i2 += 2) {
            const x01 = i2 / (TENORS - 1);
            const price = priceAt(c, x01, t + CURVES * 120, velBias);
            const px = padX + x01 * plotW;
            const py = midY + yOffset - price * plotH * 0.42;
            ctx.beginPath();
            ctx.arc(px, py, dotR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

    };

    const start = () => {
      if (running) return;
      running = true;
      if (pausedAt) {
        startTime += performance.now() - pausedAt;
        pausedAt = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      pausedAt = performance.now();
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (inView && document.visibilityState === "visible") start();
      else stop();
    };

    if (prefersReduced) {
      // One static frame, no loop
      raf = requestAnimationFrame(draw);
    } else {
      sync();
    }

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            if (!prefersReduced) sync();
          })
        : null;
    observer?.observe(canvas);
    const onVisibility = () => {
      if (!prefersReduced) sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
};

export default HeroCanvas;
