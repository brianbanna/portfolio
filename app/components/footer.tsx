"use client";
import React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

// Obfuscated email - decoded only on click
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

const socials = [
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: "https://linkedin.com/in/brianbanna",
    label: "LinkedIn",
    isEmail: false,
  },
  {
    icon: <Github className="w-5 h-5" />,
    href: "https://github.com/brianbanna",
    label: "GitHub",
    isEmail: false,
  },
  {
    icon: <Mail className="w-5 h-5" />,
    href: "#",
    label: "Email",
    isEmail: true,
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-fg/10 bg-bg">
      <div className="container px-4 py-12 mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-6">
            {socials.map((social) =>
              social.isEmail ? (
                <button
                  key={social.label}
                  onClick={handleEmailClick}
                  className="text-fg/60 hover:text-fg transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ) : (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg/60 hover:text-fg transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              )
            )}
          </div>

          <div className="text-fg/50 text-sm">
            © {new Date().getFullYear()} Brian Banna. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
