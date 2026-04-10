"use client";
import React from "react";

const stack = {
  Languages: ["Python", "R", "Scala", "Java", "TypeScript", "SQL"],
  "Quant / ML": [
    "NumPy",
    "Pandas",
    "scikit-learn",
    "PyTorch",
    "TensorFlow",
    "statsmodels",
  ],
  "Data / Infra": ["PostgreSQL", "Jupyter", "Git", "Docker", "Linux", "Plotly"],
};

const timeline = [
  {
    year: "2024 — Now",
    role: "MSc Data Science",
    org: "EPFL — Financial Engineering minor",
  },
  {
    year: "2024",
    role: "Quantitative Research",
    org: "Commodity markets · production & trade flow signals",
  },
  {
    year: "2023 — 2024",
    role: "President · Head of Sales",
    org: "Junior Entreprise EPFL · CHF 500k project volume",
  },
  {
    year: "2022 — 2024",
    role: "BSc Communication Systems",
    org: "EPFL",
  },
];

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
        <div className="grid grid-cols-12 gap-6 mb-20 md:mb-28">
          <div className="col-span-12 md:col-span-3">
            <div className="section-marker">§ 01 — About</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-[clamp(2.5rem,6vw,5.25rem)] text-fg text-balance leading-[0.95]">
              A <span className="italic-accent text-accent">researcher</span> at
              the intersection of data, markets, and models.
            </h2>
          </div>
        </div>

        {/* Portrait + prose */}
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* Portrait column */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper border border-fg/10">
                <img
                  src="/profile.jpg"
                  alt="Brian Banna"
                  className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-fg/10 pointer-events-none" />
              </div>
              <figcaption className="mt-3 flex items-center justify-between label">
                <span>Fig. 01</span>
                <span>Lausanne, 2026</span>
              </figcaption>
            </figure>
          </div>

          {/* Prose + timeline */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              <div className="col-span-12 lg:col-span-7">
                <p className="font-serif text-2xl md:text-[28px] leading-[1.35] text-fg text-pretty mb-8">
                  <span className="italic-accent text-accent">"</span>
                  I build systematic models and research frameworks to study
                  market dynamics — with a particular interest in commodities
                  and trading strategies.
                  <span className="italic-accent text-accent">"</span>
                </p>

                <div className="space-y-5 text-fg/65 leading-[1.75] text-[15px] max-w-prose">
                  <p>
                    Previously I worked in quantitative research on commodity
                    markets, building market signals from production data,
                    refining capacity, and global trade flows. In parallel I
                    developed several research projects around systematic
                    trading — market regime modelling, futures curve factor
                    strategies, and statistical arbitrage on cointegrated
                    spreads.
                  </p>
                  <p>
                    Before research I served as President and Head of Sales at
                    Junior Entreprise EPFL, Switzerland's largest student-run
                    consultancy — leading a 35-person team, managing more than
                    CHF 500k in project volume, driving 22% YoY revenue
                    growth, and personally closing CHF 430k across finance,
                    commodities and energy mandates.
                  </p>
                  <p>
                    Outside of work: financial history and its links to global
                    politics, classical and practical philosophy, horology, and
                    tennis.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="col-span-12 lg:col-span-5">
                <div className="label mb-6">Trajectory</div>
                <ol className="relative space-y-6 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-fg/10">
                  {timeline.map((t) => (
                    <li key={t.year + t.role} className="relative pl-5 group">
                      <span className="absolute left-0 top-2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent/70 group-hover:bg-accent group-hover:scale-150 transition-transform" />
                      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg/45 tabular-nums mb-1">
                        {t.year}
                      </div>
                      <div className="font-serif text-lg text-fg leading-tight">
                        {t.role}
                      </div>
                      <div className="text-[13px] text-fg/55 mt-0.5">
                        {t.org}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Stack tableau */}
        <div className="mt-24 md:mt-32">
          <div className="hairline mb-10" />
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-3">
              <div className="section-marker mb-2">§ 01.1 — Stack</div>
              <div className="font-serif text-2xl text-fg/90 leading-tight mt-4">
                Tools of the <span className="italic-accent text-accent">trade</span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {Object.entries(stack).map(([group, items]) => (
                  <div key={group}>
                    <div className="label mb-4 pb-3 border-b border-fg/10">
                      {group}
                    </div>
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-3 font-mono text-[13px] text-fg/75"
                        >
                          <span className="text-fg/30 tabular-nums text-[10px]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="group-hover:text-fg">{item}</span>
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
