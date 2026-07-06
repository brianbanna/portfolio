import React from "react";
import { Projects3DSlider } from "../projects-3d-slider";

interface ProjectsProject {
  title: string;
  description: string;
  question?: string;
  url?: string;
  repository?: string;
  image?: string;
  imageAlt?: string;
  date?: string;
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
      className="relative bg-bg section-rail scroll-mt-24"
    >
      <div className="noise" aria-hidden />

      {/* Section header */}
      <div className="editorial pt-20 md:pt-28 pb-10 md:pb-14">
        <h2 className="display text-[clamp(2.5rem,6vw,5rem)] text-fg leading-[0.98] text-balance">
          Selected work
        </h2>
        <p className="mt-6 max-w-xl text-lg text-fg/60 leading-relaxed">
          Projects across European power markets, futures curve factors,
          commodity spreads and market regime detection.
        </p>
      </div>

      {/* 3D project slider */}
      <div className="py-16 md:py-24">
        <Projects3DSlider projects={projects} />
      </div>
    </section>
  );
};
