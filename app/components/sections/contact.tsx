"use client";
import React from "react";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";

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
  icon?: React.ReactNode;
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
    icon: <Linkedin className="w-4 h-4" />,
  },
  {
    num: "03",
    label: "GitHub",
    value: "/brianbanna",
    href: "https://github.com/brianbanna",
    external: true,
    icon: <Github className="w-4 h-4" />,
  },
];

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative bg-bg overflow-hidden border-t border-fg/5"
    >
      <div
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute -bottom-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[70vh] bg-[radial-gradient(ellipse_at_center,rgb(247_185_85/0.08),transparent_60%)] pointer-events-none"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      <div className="editorial relative py-28 md:py-44">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-3">
            <div className="section-marker">§ 03 — Contact</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-[clamp(3rem,9vw,9rem)] text-fg leading-[0.88] text-balance">
              Let's <span className="italic-accent text-accent">talk</span>.
            </h2>
            <p className="mt-8 max-w-xl font-serif text-xl md:text-2xl text-fg/60 leading-[1.5]">
              Open to research collaborations, systematic trading discussions,
              and quant-oriented mandates — or just a conversation about
              markets.
            </p>
          </div>
        </div>

        {/* Channels tableau */}
        <div className="grid grid-cols-12 gap-6 mt-20">
          <div className="hidden md:block md:col-span-3" />
          <div className="col-span-12 md:col-span-9">
            <div className="border-t border-fg/15">
              {channels.map((c) => {
                const content = (
                  <div className="group grid grid-cols-12 gap-4 md:gap-6 items-center py-7 md:py-8 border-b border-fg/15 transition-colors hover:bg-fg/[0.02]">
                    <div className="col-span-2 md:col-span-1 font-mono text-[11px] text-fg/35 tabular-nums">
                      ({c.num})
                    </div>
                    <div className="col-span-10 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fg/55 group-hover:text-accent transition-colors">
                      {c.label}
                    </div>
                    <div className="col-span-10 col-start-3 md:col-start-auto md:col-span-7 display text-2xl md:text-[32px] text-fg/90 group-hover:text-fg tracking-tight leading-none">
                      <span className="link-draw">{c.value}</span>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <ArrowUpRight className="w-5 h-5 text-fg/40 group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
      </div>
    </section>
  );
};
