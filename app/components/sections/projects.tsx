import React from "react";
import { Projects3DSlider } from "../projects-3d-slider";

interface ProjectsProject {
  title: string;
  description: string;
  url?: string;
  repository?: string;
  image?: string;
}

interface ProjectsSectionProps {
  projects: ProjectsProject[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
}) => {
  return (
    <section
      id="projects"
      className="relative bg-bg border-t border-fg/5"
    >
      <div className="noise" aria-hidden />

      {/* Section header */}
      <div className="editorial pt-28 md:pt-40 pb-8 md:pb-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="section-marker">§ 02 — Selected Work</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-[clamp(2.5rem,6vw,5.25rem)] text-fg leading-[0.95] text-balance">
              Research in <span className="italic-accent text-accent">systematic</span> trading
              &{" "}
              <br className="hidden md:block" />
              quantitative modelling.
            </h2>
            <p className="mt-8 max-w-xl font-serif text-lg text-fg/60 leading-relaxed">
              Four selected projects across regime detection, factor construction,
              statistical arbitrage, and real-time signal processing.
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-16">
        <Projects3DSlider projects={projects} />
      </div>

      {/* Trailing marker */}
      <div className="editorial py-16 border-t border-fg/10">
        <div className="flex items-center justify-between label">
          <span>END § 02</span>
          <span className="text-accent">◆</span>
          <span>↓ CONTINUE</span>
        </div>
      </div>
    </section>
  );
};
