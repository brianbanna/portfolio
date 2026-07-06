import React from "react";
import { HeroCanvas } from "../hero-canvas";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-bg flex flex-col"
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden
      />

      {/* Bespoke hero canvas — term structure ribbon */}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_55%,black_10%,transparent_75%)]"
        aria-hidden
      >
        <HeroCanvas className="absolute inset-0 w-full h-full" />
      </div>

      {/* Warm top glow */}
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgb(166_72_42/0.04),transparent_60%)] pointer-events-none"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center pt-28 md:pt-36">
        <div className="editorial w-full py-16 md:py-24">
          {/* Display — name, capped at showcase scale */}
          <h1 className="display text-fg leading-[0.95] text-balance">
            <span className="block text-[clamp(2.6rem,7vw,5.8rem)] opacity-0 animate-[rise_1.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
              Brian
            </span>
            <span className="block text-[clamp(2.6rem,7vw,5.8rem)] -mt-1 md:-mt-2 opacity-0 animate-[rise_1.6s_cubic-bezier(0.16,1,0.3,1)_0.25s_forwards]">
              Banna
            </span>
          </h1>

          {/* Tagline */}
          <div className="mt-14 md:mt-20 opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.8s_forwards]">
            <p className="text-xl md:text-2xl lg:text-[26px] leading-[1.45] text-fg/85 text-pretty max-w-3xl">
              I'm a quant analyst at Cargill, working on commodity and power
              markets. I turn supply and demand into views on futures curves
              and spreads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
