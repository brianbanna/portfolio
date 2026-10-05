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
      aria-labelledby="projects-heading"
      className="relative bg-bg section-rail scroll-mt-24"
    >
      <div className="editorial pt-16 md:pt-24 pb-2">
        <h2 id="projects-heading" className="chapter text-fg text-balance">
          Selected work
        </h2>
        <p className="mt-5 max-w-[40rem] font-sans text-[1.125rem] leading-[1.6] text-fg">
          Projects across commodity relative value, power price formation,
          volatility, futures curve factors and market regime detection.
        </p>
      </div>

      <div className="pt-8 pb-16 md:pb-24">
        <Projects3DSlider projects={projects} />
      </div>
    </section>
  );
};
