"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDark]);

  useEffect(() => {
    const sections = navItems.map((item) => item.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/80 backdrop-blur-md border-b border-fg/10"
            : "bg-transparent"
        }`}
      >
        <nav className="container flex items-center justify-center px-6 py-4 mx-auto max-w-7xl relative">
          <div className="hidden md:flex items-center gap-1 bg-fg/5 rounded-full px-2 py-1 border border-fg/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeSection === item.href.slice(1)
                    ? "text-fg bg-fg/10"
                    : "text-fg/60 hover:text-fg hover:bg-fg/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="absolute right-6 flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full text-fg/60 hover:text-fg hover:bg-fg/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-fg p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-bg/95 backdrop-blur-lg">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`text-2xl font-medium transition-colors duration-200 ${
                  activeSection === item.href.slice(1)
                    ? "text-fg"
                    : "text-fg/60 hover:text-fg"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={(e) => handleClick(e, "#contact")}
              className="px-8 py-4 text-lg font-medium text-bg bg-fg rounded-full hover:opacity-90 transition-all duration-200 shadow-lg shadow-fg/20"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
