import React from "react";
import { HeroCanvas } from "../hero-canvas";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-bg flex flex-col"
    >
      <div
        className="hero-field absolute inset-0"
        aria-hidden
      >
        <HeroCanvas className="absolute inset-0 w-full h-full" />
      </div>

      <div className="relative z-10 flex-1 flex items-center pt-28 md:pt-32">
        <div className="editorial w-full py-16 md:py-24">
          <h1 className="display text-fg leading-[0.98] text-balance">
            <span className="block text-[clamp(2.75rem,5.5vw,4.25rem)] opacity-0 animate-[rise_1.15s_cubic-bezier(0.22,1,0.36,1)_0.04s_forwards]">
              Brian
            </span>
            <span className="block text-[clamp(2.75rem,5.5vw,4.25rem)] -mt-1 md:-mt-2 opacity-0 animate-[rise_1.15s_cubic-bezier(0.22,1,0.36,1)_0.1s_forwards]">
              Banna
            </span>
          </h1>

          <p className="mt-8 max-w-[40rem] font-sans text-[1.0625rem] md:text-[1.125rem] leading-snug text-fg text-pretty opacity-0 animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_0.28s_forwards]">
            Quant analyst (freight trading desk) at Cargill in Geneva.
          </p>
        </div>
      </div>
    </section>
  );
};
