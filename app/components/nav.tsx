"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const atBottomRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  // On tall viewports the last section never reaches the observer band, so
  // page bottom overrides the observer and forces the last section active.
  const [atBottom, setAtBottom] = useState(false);

  // Open menu behaves like a dialog: page scroll locked, Escape closes, focus
  // moves in and back out, and it closes itself if the viewport grows past md.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const root = menuRef.current;
      if (!root) return;
      const items = [
        ...root.querySelectorAll<HTMLElement>("a[href], button"),
      ];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && root.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    firstMenuLinkRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      // Hand focus back to the toggle only when the close dropped it (Escape
      // on a menu link leaves it on body); a menu link click already moved it
      // into the target section and must keep it there.
      const active = document.activeElement;
      if (!active || active === document.body) {
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let rafId = 0;
    let pending = false;
    let maxScroll = 0;
    // scrollHeight forces layout. Read it off the scroll path, then the
    // scroll handler only writes a transform, which stays on the compositor.
    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };
    const paint = () => {
      pending = false;
      const y = window.scrollY;
      const bottom = maxScroll > 0 && y >= maxScroll - 2;
      if (bottom !== atBottomRef.current) {
        atBottomRef.current = bottom;
        setAtBottom(bottom);
      }
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(paint);
    };
    measure();
    paint();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            measure();
            paint();
          })
        : null;
    observer?.observe(document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer?.disconnect();
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
    const el = document.querySelector<HTMLElement>(href);
    if (el) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      // Keep native anchor semantics: URL hash updates and focus lands in the
      // section. Replace (not push) and keep Next's history state: its popstate
      // handler ignores entries with a null state, which would strand Back.
      window.history.replaceState(window.history.state, "", href);
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg">
        <div className="editorial relative flex items-center justify-between py-4">
          <Link
            href={resolveHref("#home")}
            onClick={(e) => handleClick(e, "#home")}
            className="font-sans text-[15px] font-medium tracking-[-0.02em] text-fg"
          >
            Brian Banna
          </Link>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
          >
            {navItems.map((item) => {
              const isActive = item.href.startsWith("#")
                ? onHome && currentSection === item.href.slice(1)
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={resolveHref(item.href)}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`relative py-2 text-[15px] transition-colors ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-px bg-fg" />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-fg p-[11px] -m-[7px] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-40 md:hidden bg-bg"
        >
          <nav className="flex h-full flex-col items-start justify-center gap-1 px-8">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                ref={i === 0 ? firstMenuLinkRef : undefined}
                href={resolveHref(item.href)}
                onClick={(e) => handleClick(e, item.href)}
                className="py-2 font-sans text-[2rem] font-medium tracking-[-0.03em] text-fg"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
