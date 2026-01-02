import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";

export default function ProjectsPage() {
  const sorted = allProjects
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            A collection of my work and side projects.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-zinc-400 text-lg">Projects coming soon.</p>
            <p className="text-zinc-500 text-sm mt-2">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
            <div className="grid grid-cols-1 gap-4">
              {sorted
                .filter((_, i) => i % 3 === 0)
                .map((project) => (
                  <Card key={project.slug}>
                    <Article project={project} views={0} />
                  </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {sorted
                .filter((_, i) => i % 3 === 1)
                .map((project) => (
                  <Card key={project.slug}>
                    <Article project={project} views={0} />
                  </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {sorted
                .filter((_, i) => i % 3 === 2)
                .map((project) => (
                  <Card key={project.slug}>
                    <Article project={project} views={0} />
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
