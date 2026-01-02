import React from "react";
import { Projects3DSlider } from "../projects-3d-slider";

interface ProjectsProject {
  title: string;
  description: string;
  url?: string;
  repository?: string;
}

interface ProjectsSectionProps {
  projects: ProjectsProject[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
}) => {
  return (
    <section id="projects" className="relative py-24 bg-gradient-to-tl from-bg via-fg/5 to-bg">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl mb-4">
            Projects
          </h2>
          <p className="text-fg/60">
            A collection of my work in quantitative finance and systematic trading.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Projects3DSlider projects={projects} />
        </div>
      </div>
    </section>
  );
};

