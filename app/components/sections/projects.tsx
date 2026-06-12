import React from "react";
import { Projects3DSlider } from "../projects-3d-slider";

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

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
}) => {
  return (
    <section
      id="projects"
      data-theme="gold"
      className="relative bg-bg section-rail scroll-mt-24"
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

      {/* 3D project slider */}
      <div className="py-12 md:py-16">
        <Projects3DSlider projects={projects} />
      </div>
    </section>
  );
};
