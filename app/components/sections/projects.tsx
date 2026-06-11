import React from "react";
import { ArrowUpRight, Github } from "lucide-react";

interface ProjectsProject {
  title: string;
  description: string;
  question?: string;
  url?: string;
  repository?: string;
  image?: string;
  date?: string;
}

interface ProjectsSectionProps {
  projects: ProjectsProject[];
}

// Shared project metadata
const meta: Record<
  string,
  { tag: string; domain: string; highlight?: string; theme: string }
> = {
  "Market Regime Modeling for Systematic Trading": {
    tag: "Regime Detection",
    domain: "US Equities",
    highlight: "20y data · 0.70 Sharpe · lower drawdown vs SPY",
    theme: "violet",
  },
  "Cross-Border Price Transmission in European Power Markets": {
    tag: "Power Markets / Transmission",
    domain: "European Electricity",
    highlight: "ENTSO-E · 301k observations · 5 bidding zones",
    theme: "steel",
  },
  "Commodity Futures Curve Modeling and Factor Trading": {
    tag: "Futures Curves / Factors",
    domain: "Commodity Futures",
    highlight: "19 markets · 2.4M observations · cost aware backtests",
    theme: "gold",
  },
  "Adaptive Statistical Arbitrage in Commodity Spreads": {
    tag: "Stat Arb / Cointegration",
    domain: "Commodity Pairs",
    highlight: "Adaptive hedge ratio",
    theme: "jade",
  },
  AirJav: {
    tag: "Signal Processing",
    domain: "ADS-B / Aviation",
    highlight: "Real time flight tracking",
    theme: "stone",
  },
};

// Same date format as the notes index
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
}) => {
  const total = String(projects.length).padStart(2, "0");

  return (
    <section
      id="projects"
      data-theme="gold"
      className="relative bg-bg section-rail"
    >
      <div className="noise" aria-hidden />

      {/* Section header */}
      <div className="editorial pt-[clamp(36px,5.5vh,64px)] pb-8 md:pb-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="section-marker">§ 02 · Selected Work</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-[clamp(2.5rem,6vw,5rem)] text-fg leading-[0.95] text-balance">
              Selected quantitative work.
            </h2>
            <p className="mt-6 max-w-xl font-serif text-lg text-fg/60 leading-relaxed">
              Projects across European power markets, futures curve factors,
              commodity spreads and market regime detection.
            </p>
          </div>
        </div>
      </div>

      {/* Index rail */}
      <div className="editorial pb-10 md:pb-14">
        <div className="label mb-4">Index</div>
        <div className="flex flex-col gap-1">
          {projects.map((p, i) => (
            <a
              key={p.title}
              href={`#project-${String(i + 1).padStart(2, "0")}`}
              className="group flex items-center gap-4 text-left min-h-[44px]"
            >
              <span className="font-mono text-[10px] tabular-nums text-fg/35 group-hover:text-section transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-fg/20 transition-all duration-500 group-hover:w-16 group-hover:bg-section" />
              <span className="font-serif text-sm md:text-base leading-tight text-fg/45 group-hover:text-fg transition-colors text-balance">
                {p.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Flat editorial sequence — 1 row per project */}
      <div className="editorial flex flex-col">
        {projects.map((project, index) => {
          const m = meta[project.title];
          const num = String(index + 1).padStart(2, "0");
          return (
            <article
              key={project.title}
              id={`project-${num}`}
              data-theme={m?.theme ?? "stone"}
              className="section-rail py-[clamp(36px,5.5vh,64px)] scroll-mt-24"
            >
              {/* Metadata header — research plate caption */}
              <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex items-center gap-5 label">
                  <span className="text-section tabular-nums">({num})</span>
                  <span>{m?.tag || "Project"}</span>
                  <span className="text-fg/25">/</span>
                  <span className="hidden md:inline">{m?.domain}</span>
                </div>
                <div className="flex items-center gap-6 label tabular-nums">
                  {project.date && (
                    <span className="uppercase">
                      {dateFmt.format(new Date(project.date))}
                    </span>
                  )}
                  <span>
                    {num} / {total}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8 md:gap-12 items-start">
                {/* Framed screenshot */}
                <div className="col-span-12 md:col-span-7">
                  <figure className="plate">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto"
                        draggable={false}
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-paper flex items-center justify-center">
                        <span className="display text-9xl text-fg/10 tabular-nums">
                          {num}
                        </span>
                      </div>
                    )}
                  </figure>
                </div>

                {/* Title, question, description, metrics, actions */}
                <div className="col-span-12 md:col-span-5">
                  <h3 className="display text-2xl md:text-[2rem] text-fg leading-[1.05] text-balance">
                    {project.title}
                  </h3>

                  {project.question && (
                    <p className="mt-6 font-serif italic text-xl md:text-2xl leading-[1.35] text-fg text-balance">
                      {project.question}
                    </p>
                  )}

                  <p className="mt-4 font-serif text-lg leading-[1.55] text-fg/80 text-pretty">
                    {project.description}
                  </p>

                  {m?.highlight && (
                    <div className="mt-6 flex items-center gap-2 font-mono text-[10px] text-section uppercase tracking-wide">
                      <span className="w-5 h-px bg-section/60" />
                      {m.highlight}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-fg text-bg font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-section transition-colors before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-['']"
                      >
                        Live
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    {project.repository && (
                      <a
                        href={`https://github.com/${project.repository}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 border border-fg/25 text-fg/80 hover:text-fg hover:border-fg/60 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-['']"
                      >
                        <Github className="w-3 h-3" />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
