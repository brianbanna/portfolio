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
 * Inexpensive — canvas2D, GPU-compositable, single RAF loop. Degrades to
 * blank on reduced motion.
 */
export const HeroCanvas: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Term-structure model
    const TENORS = 13; // 13 contract months along x
    const CURVES = 14; // number of stacked snapshots in depth

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
      speed: 0.0002 + Math.random() * 0.00025,
      regime: Math.sin((i / CURVES) * Math.PI * 2),
      slope: 0.35 + Math.random() * 0.2,
      curvature: 0.25 + Math.random() * 0.3,
    }));

    // Term-structure function for a given curve at time t
    const priceAt = (c: CurveParams, x: number, t: number) => {
      // x in 0..1 (tenor)
      const regime = Math.sin(c.phase + t * c.speed); // slow oscillation
      const slope = regime * c.slope;
      // asymmetric curvature to feel organic
      const curvature =
        c.curvature * Math.sin(x * Math.PI) * (0.6 + 0.4 * Math.cos(t * 0.0003));
      // gentle wobble at long end
      const wobble = 0.035 * Math.sin(x * 6 + c.phase + t * 0.0006);
      return slope * (x - 0.5) + curvature + wobble;
    };

    let raf = 0;
    let startTime = performance.now();

    const draw = (now: number) => {
      const t = prefersReduced ? 0 : now - startTime;

      ctx.clearRect(0, 0, w, h);

      // Layout padding
      const padX = w * 0.06;
      const padY = h * 0.18;
      const plotW = w - padX * 2;
      const plotH = h - padY * 2;

      // Vertical tenor gridlines
      ctx.lineWidth = 1;
      for (let i = 0; i < TENORS; i++) {
        const x = padX + (i / (TENORS - 1)) * plotW;
        ctx.strokeStyle = `rgba(237, 233, 224, ${i === 0 || i === TENORS - 1 ? 0.06 : 0.025})`;
        ctx.beginPath();
        ctx.moveTo(x, padY * 0.4);
        ctx.lineTo(x, h - padY * 0.4);
        ctx.stroke();
      }

      // Horizontal zero line
      ctx.strokeStyle = "rgba(237, 233, 224, 0.04)";
      ctx.beginPath();
      ctx.moveTo(padX, h / 2);
      ctx.lineTo(w - padX, h / 2);
      ctx.stroke();

      // Draw curves from back to front
      curves.forEach((c, i) => {
        const depth = i / (CURVES - 1); // 0 back, 1 front
        const isActive = i === CURVES - 1;

        // Stack offset — newer curves shift down slightly for depth
        const yOffset = (depth - 0.5) * plotH * 0.55;

        // Opacity by depth
        const alpha = 0.04 + depth * 0.28;

        ctx.lineWidth = isActive ? 1.4 : 0.8 + depth * 0.4;

        if (isActive) {
          ctx.strokeStyle = `rgba(247, 185, 85, 0.85)`;
          ctx.shadowColor = "rgba(247, 185, 85, 0.5)";
          ctx.shadowBlur = 14;
        } else {
          ctx.strokeStyle = `rgba(237, 233, 224, ${alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        const segments = 80;
        for (let s = 0; s <= segments; s++) {
          const x01 = s / segments;
          const price = priceAt(c, x01, t + i * 120);
          const px = padX + x01 * plotW;
          const py = h / 2 + yOffset - price * plotH * 0.42;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Tenor ticks on active curve
        if (isActive) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(247, 185, 85, 0.85)";
          for (let i2 = 0; i2 < TENORS; i2 += 2) {
            const x01 = i2 / (TENORS - 1);
            const price = priceAt(c, x01, t + CURVES * 120);
            const px = padX + x01 * plotW;
            const py = h / 2 + yOffset - price * plotH * 0.42;
            ctx.beginPath();
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      ctx.shadowBlur = 0;

      if (!prefersReduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
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
