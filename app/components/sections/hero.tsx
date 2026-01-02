import React from "react";
import Particles from "../particles";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-bg via-fg/5 to-bg"
    >
      <Particles
        className="absolute inset-0 z-0 animate-fade-in"
        quantity={300}
      />
      
      <div className="z-10 animate-fade-in mb-6">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-fg/20 shadow-2xl">
          <img 
            src="/profile.jpg" 
            alt="Brian Banna"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-fg/0 via-fg/50 to-fg/0" />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-fg cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
        Brian Banna
      </h1>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-fg/0 via-fg/50 to-fg/0" />
      <div className="my-16 text-center animate-fade-in z-10 max-w-2xl px-6">
        <h2 className="text-base md:text-lg text-fg/50">
          Data Science master's student at EPFL focused on quantitative finance, systematic trading and commodities.
        </h2>
      </div>
    </section>
  );
};

