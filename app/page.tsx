import React from "react";
import { allNotes, allProjects } from "contentlayer/generated";
import { Navigation } from "./components/nav";
import { HeroSection } from "./components/sections/hero";
import { AboutSection } from "./components/sections/about";
import { ProjectsSection } from "./components/sections/projects";
import { ContactSection } from "./components/sections/contact";
import { Footer } from "./components/footer";
import { Cursor } from "./components/cursor";

export default function Home() {
  const projects = allProjects
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        (a.order ?? Number.POSITIVE_INFINITY) -
        (b.order ?? Number.POSITIVE_INFINITY)
    )
    .map((p) => ({
      title: p.title,
      description: p.description,
      question: p.question,
      url: p.url,
      repository: p.repository,
      image: p.image,
    }));

  const notesEnabled = allNotes.some((n) => n.published);

  return (
    <div className="bg-bg transition-colors duration-300">
      <Cursor />
      <Navigation notesEnabled={notesEnabled} />
      <HeroSection />
      <AboutSection />
      <ProjectsSection projects={projects} />
      <ContactSection />
      <Footer />
    </div>
  );
}
