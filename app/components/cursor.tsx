"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * Editorial custom cursor. Two layers:
 *  - inner dot: instant follow
 *  - outer ring: lerp follow, scales up on interactive hover
 *
 * Only rendered on devices with a fine pointer (desktops).
 */
export const Cursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const targetX = useRef(0);
  const targetY = useRef(0);
  const ringX = useRef(0);
  const ringY = useRef(0);

  // Detect pointer capability
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("cursor-none");

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        "a, button, [role=button], input, textarea, select, [data-cursor=hover]"
      );
      setHovering(!!interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const loop = () => {
      const lerp = 0.18;
      ringX.current += (targetX.current - ringX.current) * lerp;
      ringY.current += (targetY.current - ringY.current) * lerp;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [enabled, hovering, visible]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] -ml-[2px] -mt-[2px] w-1 h-1 rounded-full bg-accent mix-blend-difference will-change-transform transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9998] w-8 h-8 rounded-full border border-fg/60 mix-blend-difference will-change-transform transition-[opacity,border-color,background-color,width,height] duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        } ${hovering ? "bg-fg/10" : ""}`}
      />
    </>
  );
};

export default Cursor;
