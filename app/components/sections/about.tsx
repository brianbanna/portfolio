"use client";
import React from "react";

const tools = [
  "Python",
  "C++",
  "R",
  "SQL",
  "Java",
  "NumPy",
  "Pandas",
  "statsmodels",
  "arch",
  "hmmlearn",
  "scikit-learn",
  "PyTorch",
  "vectorbt",
  "Matplotlib",
  "Plotly",
  "Excel (VBA)",
  "Git",
  "CI/CD",
];

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative bg-bg overflow-hidden section-rail scroll-mt-24"
    >
      <div
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      <div className="editorial relative py-16 md:py-24">
        {/* Section heading */}
        <h2 className="display text-3xl md:text-4xl text-fg mb-8 md:mb-10">
          About
        </h2>

        {/* Portrait + prose */}
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          {/* Portrait */}
          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <figure className="relative md:sticky md:top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper border border-fg/10">
                <img
                  src="/profile.jpg"
                  alt="Brian Banna"
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-fg/10 pointer-events-none" />
              </div>
            </figure>
          </div>

          {/* Prose */}
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="space-y-4 text-base leading-[1.62] text-fg/80 max-w-[64ch]">
              <p className="text-[19px] md:text-[21px] leading-[1.5] font-medium text-fg">
                I'm a quant analyst at Cargill in Geneva, working on commodity
                and power markets. I build models that read physical
                fundamentals, storage, trade flows, inventories, and turn them
                into positions on curves and spreads.
              </p>

              <p>
                Before Cargill I built commodity signals at Pareto Economics in
                London and worked on real time signal extraction at VITA in
                Montreal. I'm finishing an MSc in Data Science and Financial
                Engineering at EPFL, after a BSc in Computer Science. Earlier I
                ran Junior Entreprise EPFL as President, leading a 35 person
                team and closing over CHF 430k in projects.
              </p>
            </div>

            {/* Tools: pill tags */}
            <div className="mt-8 pt-6 border-t border-fg/10">
              <div className="label mb-3">Tools</div>
              <div className="flex flex-wrap gap-2.5">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-fg/15 bg-paper px-3.5 py-1.5 text-[13px] leading-none text-fg/70"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
