"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { num: "01", name: "Index", href: "#home" },
  { num: "02", name: "About", href: "#about" },
  { num: "03", name: "Work", href: "#projects" },
  { num: "04", name: "Contact", href: "#contact" },
];

export const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 40);
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sections = navItems.map((item) => item.href.slice(1));
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveSection(id),
        { rootMargin: "-40% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-bg/70 backdrop-blur-xl border-b border-fg/5"
            : "bg-transparent"
        }`}
      >
        <div className="editorial flex items-center justify-between py-5">
          {/* Monogram — no colored letters */}
          <Link
            href="#home"
            onClick={(e) => handleClick(e, "#home")}
            className="group flex items-baseline gap-2"
          >
            <span className="display text-[22px] tracking-tighter text-fg">
              Brian Banna
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`group relative px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors rounded-full ${
                    isActive ? "bg-fg/[0.06]" : "hover:bg-fg/[0.03]"
                  }`}
                >
                  <span
                    className={`mr-1.5 tabular-nums ${
                      isActive ? "text-accent" : "text-fg/35"
                    } transition-colors`}
                  >
                    {item.num}
                  </span>
                  <span
                    className={`${
                      isActive ? "text-fg" : "text-fg/55 group-hover:text-fg"
                    } transition-colors`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-fg p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            {/* Spacer to balance the monogram width on desktop */}
            <div className="hidden md:block w-[96px]" />
          </div>
        </div>

        {/* Scroll progress hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-fg/5">
          <div
            className="h-full bg-accent/80 origin-left will-change-transform"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-bg/98 backdrop-blur-xl">
          <div className="flex flex-col items-start justify-center h-full gap-1 px-8">
            <div className="label mb-8">Navigation</div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="group flex items-baseline gap-5 py-2"
              >
                <span className="font-mono text-xs text-accent tabular-nums">
                  §{item.num}
                </span>
                <span className="display text-5xl text-fg transition-all">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
