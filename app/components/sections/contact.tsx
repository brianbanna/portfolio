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
      aria-labelledby="contact-heading"
      className="relative bg-bg section-rail scroll-mt-24"
    >
      <div className="editorial relative py-16 md:py-24">
        <div className="mb-12 md:mb-16">
          <h2 id="contact-heading" className="chapter text-fg">
            Get in touch
          </h2>
          <p className="mt-5 max-w-[40rem] font-sans text-[1.125rem] leading-[1.6] text-fg">
            Happy to talk about commodity and freight markets, models or project work.
          </p>
        </div>

        <div className="border-t border-hairline">
          {channels.map((c) => {
            const content = (
              <div className="group flex flex-col gap-1 border-b border-hairline py-6 sm:flex-row sm:items-baseline sm:gap-10 md:py-7">
                <div className="w-28 shrink-0 font-sans text-[13px] text-muted">
                  {c.label}
                </div>
                <div className="min-w-0 font-sans text-[1.125rem] font-medium leading-snug text-fg md:text-[1.25rem]">
                  <span className="link-draw">{c.value}</span>
                </div>
              </div>
            );
              return c.onClick ? (
                <button
                  key={c.num}
                  type="button"
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
    </section>
  );
};
