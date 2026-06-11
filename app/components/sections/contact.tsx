"use client";
import React from "react";

const getEmail = () => {
  const user = "briannbanna";
  const domain = "gmail";
  const tld = "com";
  return `${user}@${domain}.${tld}`;
};

const handleEmailClick = (e: React.MouseEvent) => {
  e.preventDefault();
  window.location.href = `mailto:${getEmail()}`;
};

type Channel = {
  num: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

const channels: Channel[] = [
  {
    num: "01",
    label: "Email",
    value: "briannbanna [at] gmail.com",
    href: "#",
    onClick: handleEmailClick,
  },
  {
    num: "02",
    label: "LinkedIn",
    value: "/in/brianbanna",
    href: "https://linkedin.com/in/brianbanna",
    external: true,
  },
  {
    num: "03",
    label: "GitHub",
    value: "/brianbanna",
    href: "https://github.com/brianbanna",
    external: true,
  },
];

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative bg-bg overflow-hidden section-rail scroll-mt-24"
    >
      <div
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute -bottom-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[70vh] bg-[radial-gradient(ellipse_at_center,rgb(212_206_192/0.05),transparent_60%)] pointer-events-none"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      <div className="editorial relative py-28 md:py-44">
        {/* Section header */}
        <div className="mb-14 md:mb-20">
          <div className="section-marker mb-10">§ 03 · Contact</div>
          <h2 className="display text-[clamp(2.4rem,7vw,5.8rem)] text-fg leading-[0.88]">
            Let&apos;s talk.
          </h2>
          <p className="mt-8 max-w-xl font-serif text-xl md:text-2xl text-fg/65 leading-[1.5]">
            Happy to talk about commodity markets, models or project work.
          </p>
        </div>

        {/* Channels — hairline ledger, mono num replaces the icon column */}
        <div className="mt-16 md:mt-20">
          <div className="border-t border-fg/15">
            {channels.map((c) => {
              const content = (
                <div className="group grid grid-cols-[2.5rem,1fr,2rem] md:grid-cols-12 gap-3 sm:gap-4 md:gap-6 items-center py-6 sm:py-7 md:py-8 border-b border-fg/15 transition-colors hover:bg-fg/[0.02]">
                  <div className="md:col-span-1 font-mono text-[11px] tabular-nums text-fg/40 group-hover:text-accent transition-colors">
                    {c.num}
                  </div>
                  <div className="min-w-0 md:col-span-10 md:grid md:grid-cols-10 md:gap-6 md:items-center">
                    <div className="md:col-span-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-fg/55 group-hover:text-fg transition-colors">
                      {c.label}
                    </div>
                    <div className="md:col-span-7 display text-[18px] sm:text-2xl md:text-[32px] text-fg/90 group-hover:text-fg tracking-tight leading-tight break-words">
                      <span className="link-draw">{c.value}</span>
                    </div>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <span
                      aria-hidden
                      className="arrow-glyph font-mono text-base text-fg/35 group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              );
              return c.onClick ? (
                <button
                  key={c.num}
                  onClick={c.onClick}
                  className="w-full text-left"
                >
                  {content}
                </button>
              ) : (
                <a
                  key={c.num}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
