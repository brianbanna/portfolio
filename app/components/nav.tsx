"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const baseNavItems = [
  { num: "01", name: "Index", href: "#home" },
  { num: "02", name: "About", href: "#about" },
  { num: "03", name: "Work", href: "#projects" },
  { num: "04", name: "Contact", href: "#contact" },
];

interface NavigationProps {
  notesEnabled?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  notesEnabled = false,
}) => {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const navItems = notesEnabled
    ? [...baseNavItems, { num: "05", name: "Notes", href: "/notes" }]
    : baseNavItems;
  const [activeSection, setActiveSection] = useState("home");
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // On tall viewports the last section never reaches the observer band, so
  // page bottom overrides the observer and forces the last section active.
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.max(0, Math.min(1, p)));
      setAtBottom(docHeight > 0 && scrollTop >= docHeight - 2);
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
    const sections = baseNavItems.map((item) => item.href.slice(1));
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

  const lastSectionId =
    baseNavItems[baseNavItems.length - 1].href.slice(1);
  const currentSection = atBottom ? lastSectionId : activeSection;

  const resolveHref = (href: string) =>
    href.startsWith("#") && !onHome ? `/${href}` : href;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#") || !onHome) {
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-bg/70 backdrop-blur-xl border-b border-fg/5">
        <div className="editorial flex items-center justify-between py-5">
          {/* Monogram — no colored letters */}
          <Link
            href={resolveHref("#home")}
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
              const isActive = item.href.startsWith("#")
                ? onHome && currentSection === item.href.slice(1)
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={resolveHref(item.href)}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`group relative px-4 py-2 text-[11px] tracking-[0.14em] uppercase transition-colors rounded-[2px] border before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] ${
                    isActive
                      ? "border-fg/20 bg-fg/[0.05]"
                      : "border-transparent hover:border-fg/15 hover:bg-fg/[0.03]"
                  }`}
                >
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
              className="md:hidden text-fg p-[11px] -m-[7px]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            {/* Spacer to balance the monogram width on desktop */}
            <div className="hidden md:block w-[96px]" />
          </div>
        </div>

        {/* Scroll progress hairline with chapter tick notches */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-fg/5">
          <div
            className="h-full bg-accent/80 origin-left will-change-transform"
            style={{ transform: `scaleX(${progress})` }}
          />
          {baseNavItems.slice(1).map((item, i) => (
            <span
              key={item.href}
              aria-hidden
              className="absolute top-0 w-px h-[4px] bg-fg/25"
              style={{ left: `${((i + 1) / baseNavItems.length) * 100}%` }}
            />
          ))}
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
                href={resolveHref(item.href)}
                onClick={(e) => handleClick(e, item.href)}
                className="group flex items-baseline gap-5 py-2"
              >
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
