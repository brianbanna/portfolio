"use client";
import React from "react";
import { LogoMarquee } from "../logo-marquee";

const skillsRow1 = [
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "R", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Scala", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
  { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
  { name: "scikit-learn", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
];

const skillsRow2 = [
  { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "Matplotlib", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" },
  { name: "Plotly", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/plotly/plotly-original.svg" },
  { name: "Jupyter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 bg-bg overflow-hidden">
      <div className="container px-6 mx-auto max-w-5xl">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl mb-4">About</h2>
        </div>
        
        <div className="grid md:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-stretch">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-full h-full min-h-[280px] rounded-2xl bg-gradient-to-br from-fg/20 to-fg/5 border border-fg/20 flex items-center justify-center overflow-hidden shadow-2xl">
              <img 
                src="/profile.jpg" 
                alt="Brian Banna"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-5xl text-fg/30">BB</span>';
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between min-w-0 gap-8">
            <div className="space-y-4 text-fg/70 leading-relaxed text-justify">
              <p>
                I work on quantitative research and systematic modeling, mainly in commodities 
                and macro markets. I'm pursuing a Master's in Data Science with a minor in 
                Financial Engineering at EPFL.
              </p>
              <p>
                I use statistical methods, time series analysis, and financial mathematics to 
                build models that support data driven decisions in trading and market analysis.
              </p>
              <p>
                My work focuses on designing strategies, studying market behavior, and backtesting 
                ideas using clear data and financial logic.
              </p>
              <p>
                I have built and tested projects across commodities, equities, and macro markets.
              </p>
            </div>

            <div className="overflow-hidden">
              <h3 className="text-lg font-semibold text-fg mb-4">Tech Stack</h3>
              <div className="space-y-3">
                <LogoMarquee items={skillsRow1} speed={33} direction="left" />
                <LogoMarquee items={skillsRow2} speed={33} direction="right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
