import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "./components/nav";
import { HeroSection } from "./components/sections/hero";
import { AboutSection } from "./components/sections/about";
import { ProjectsSection } from "./components/sections/projects";
import { ContactSection } from "./components/sections/contact";
import { Footer } from "./components/footer";

export default function Home() {
  const projects = allProjects
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
    .map((p) => ({
      title: p.title,
      description: p.description,
      url: p.url,
      repository: p.repository,
      image: p.image,
    }));

  return (
    <div className="bg-bg transition-colors duration-300">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectsSection projects={projects} />
      <ContactSection />
      <Footer />
    </div>
  );
}
