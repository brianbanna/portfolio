"use client";
import { Github, Mail, Linkedin } from "lucide-react";
import { Card } from "../card";

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
    icon: <Linkedin size={24} />,
    href: "https://linkedin.com/in/brianbanna",
    label: "LinkedIn",
    isEmail: false,
  },
  {
    icon: <Github size={24} />,
    href: "https://github.com/brianbanna",
    label: "GitHub",
    isEmail: false,
  },
  {
    icon: <Mail size={24} />,
    href: "#",
    label: "Email",
    isEmail: true,
  },
];

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative py-24 bg-gradient-to-tl from-bg/0 via-bg to-bg/0"
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl mb-4">
            Get in Touch
          </h2>
          <p className="text-fg/60">
            Feel free to reach out for collaborations or just a friendly chat.
          </p>
        </div>
        
        <div className="grid w-full grid-cols-1 gap-8 mx-auto sm:grid-cols-3 lg:gap-16 max-w-4xl">
          {socials.map((s) => (
            <Card key={s.label}>
              {s.isEmail ? (
                <button
                  onClick={handleEmailClick}
                  className="aspect-square w-full relative flex flex-col items-center justify-center gap-6 duration-700 group p-8"
                >
                  <span
                    className="absolute w-px h-1/2 bg-gradient-to-b from-fg/50 via-fg/25 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center justify-center w-14 h-14 text-sm duration-1000 border rounded-full text-fg/80 group-hover:text-fg group-hover:bg-bg border-fg/50 bg-bg group-hover:border-fg drop-shadow-orange">
                    {s.icon}
                  </span>
                  <span className="z-10 lg:text-xl font-medium duration-150 xl:text-3xl text-fg/80 group-hover:text-fg font-display">
                    {s.label}
                  </span>
                </button>
              ) : (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square relative flex flex-col items-center justify-center gap-6 duration-700 group p-8"
                >
                  <span
                    className="absolute w-px h-1/2 bg-gradient-to-b from-fg/50 via-fg/25 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center justify-center w-14 h-14 text-sm duration-1000 border rounded-full text-fg/80 group-hover:text-fg group-hover:bg-bg border-fg/50 bg-bg group-hover:border-fg drop-shadow-orange">
                    {s.icon}
                  </span>
                  <span className="z-10 lg:text-xl font-medium duration-150 xl:text-3xl text-fg/80 group-hover:text-fg font-display">
                    {s.label}
                  </span>
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
