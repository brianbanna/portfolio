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
            <div className="section-marker">§ 02 · Selected Work</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-[clamp(2.5rem,6vw,5rem)] text-fg leading-[0.95] text-balance">
              A few things I&apos;ve built.
            </h2>
            <p className="mt-6 max-w-xl font-serif text-lg text-fg/60 leading-relaxed">
              Selected research projects in systematic trading, regime
              detection, and real-time signal processing.
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-16">
        <Projects3DSlider projects={projects} />
      </div>
    </section>
  );
};
