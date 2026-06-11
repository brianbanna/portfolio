"use client";
import React from "react";

const stack = {
  Languages: ["Python", "C++", "R", "SQL", "Java", "Scala"],
  "Quant / ML": [
    "NumPy",
    "Pandas",
    "statsmodels",
    "arch",
    "hmmlearn",
    "scikit-learn",
    "PyTorch",
    "vectorbt",
  ],
  "Tools / Viz": ["Matplotlib", "Plotly", "Excel (VBA)", "Git", "CI/CD"],
};

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative bg-bg overflow-hidden border-t border-fg/5"
    >
      <div
        className="absolute inset-0 bg-grid-fg bg-grid-64 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div className="noise" aria-hidden />

      <div className="editorial relative py-28 md:py-40">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <div className="section-marker">§ 01 · About</div>
        </div>

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
              <figcaption className="mt-3 flex items-center justify-between label">
                <span>Fig. 01</span>
                <span>Brian Banna</span>
              </figcaption>
            </figure>
          </div>

          {/* Prose */}
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="space-y-6 font-serif text-[18px] md:text-[19px] leading-[1.7] text-fg/85 max-w-[62ch]">
              <p className="text-[22px] md:text-[24px] leading-[1.5] text-fg">
                I'm currently a Quant Analyst Intern at Cargill in Geneva for
                the summer. In parallel, I'm pursuing my MSc in Data Science
                with a minor in Financial Engineering at EPFL, after a BSc in
                Computer Science and Engineering, also at EPFL.
              </p>

              <p>
                My work focuses on quantitative modelling in commodity and
                power markets, translating physical fundamentals (S&amp;D
                balances, storage, trade flows, inventories) into signals
                across futures curves, spreads and differentials.
              </p>

              <p>
                Before Cargill, I completed a Quantitative Analyst internship
                at Pareto Economics in London, building commodity market
                signals from production data, refining throughputs and global
                trade flows to analyse supply and demand dynamics, market
                exposures and asset dependencies.
              </p>

              <p>
                Previously, I served as President and Head of Sales at Junior
                Entreprise EPFL, Switzerland's largest student run consultancy,
                where I led a 35 person team. I personally closed CHF 430k in
                projects across finance, commodities and energy, and managed
                more than CHF 500k in total volume, driving 22% YoY revenue
                growth.
              </p>

              <p>
                Outside of work, I'm interested in financial history and its
                links to global politics, classical and practical philosophy,
                horology and tennis.
              </p>
            </div>
          </div>
        </div>

        {/* Stack tableau */}
        <div className="mt-24 md:mt-32">
          <div className="hairline mb-10" />
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-3">
              <div className="label mb-4">§ 01.1 · Stack</div>
              <div className="font-serif text-2xl text-fg/90 leading-tight">
                Tools I work with.
              </div>
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {Object.entries(stack).map(([group, items]) => (
                  <div key={group}>
                    <div className="label mb-4 pb-3 border-b border-fg/10">
                      {group}
                    </div>
                    <ul className="space-y-1">
                      {items.map((item, i) => (
                        <li
                          key={item}
                          className="group flex items-baseline gap-3 font-mono text-[13px] text-fg/70 py-1 px-2 -mx-2 rounded hover:bg-fg/[0.035] hover:text-fg transition-colors"
                        >
                          <span className="text-fg/30 group-hover:text-accent tabular-nums text-[10px] transition-colors">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
