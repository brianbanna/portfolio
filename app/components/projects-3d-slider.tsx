"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectData {
  title: string;
  description: string;
  url?: string;
  repository?: string;
  image?: string;
}

interface Projects3DSliderProps {
  projects: ProjectData[];
}

export const Projects3DSlider = ({ projects }: Projects3DSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = projects.map((p, i) => ({ ...p, id: i }));

  const slideNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const slidePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (isHovered || slides.length === 0) return;

    const interval = setInterval(() => {
      slideNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, slides.length, slideNext]);

  const getSlideStyle = (index: number) => {
    const totalSlides = slides.length;
    let diff = index - currentIndex;
    
    if (diff > totalSlides / 2) diff -= totalSlides;
    if (diff < -totalSlides / 2) diff += totalSlides;

    const isActive = diff === 0;
    const isAdjacent = Math.abs(diff) === 1;
    const isSecondary = Math.abs(diff) === 2;

    let x = diff * 280;
    let z = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;

    if (isActive) {
      z = 100;
      scale = 1;
      opacity = 1;
    } else if (isAdjacent) {
      x = diff * 320;
      z = -100;
      rotateY = diff * -35;
      scale = 0.85;
      opacity = 0.8;
    } else if (isSecondary) {
      x = diff * 280;
      z = -200;
      rotateY = diff * -45;
      scale = 0.7;
      opacity = 0.5;
    } else {
      x = diff * 250;
      z = -300;
      rotateY = diff * -50;
      scale = 0.5;
      opacity = 0;
    }

    return {
      x,
      z,
      rotateY,
      scale,
      opacity,
      zIndex: 10 - Math.abs(diff),
    };
  };

  const handleCardClick = (slide: typeof slides[0]) => {
    const projectLink = slide.url || (slide.repository ? `https://github.com/${slide.repository}` : undefined);
    if (projectLink) {
      window.open(projectLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-fg/60 text-lg">Projects coming soon.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg z-20 pointer-events-none" />
      
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div 
          className="relative flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="popLayout">
            {slides.map((slide, index) => {
              const style = getSlideStyle(index);
              const projectLink = slide.url || (slide.repository ? `https://github.com/${slide.repository}` : undefined);
              
              return (
                <motion.div
                  key={slide.id}
                  className="absolute cursor-pointer"
                  initial={false}
                  animate={{
                    x: style.x,
                    z: style.z,
                    rotateY: style.rotateY,
                    scale: style.scale,
                    opacity: style.opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                  }}
                  style={{
                    zIndex: style.zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => handleCardClick(slide)}
                >
                  <div 
                    className="relative w-[300px] md:w-[450px] aspect-[4/3] rounded-xl overflow-hidden group"
                    style={{
                      boxShadow: index === currentIndex 
                        ? "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 60px -15px rgba(255,255,255,0.1)"
                        : "0 20px 40px -12px rgba(0,0,0,0.6)",
                    }}
                  >
                    {slide.image ? (
                      <>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="font-display text-lg md:text-xl font-bold text-fg mb-2">
                            {slide.title}
                          </h3>
                          {index === currentIndex && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-fg/70 text-sm leading-relaxed line-clamp-2 mb-3"
                            >
                              {slide.description}
                            </motion.p>
                          )}
                          {projectLink && index === currentIndex && (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="inline-flex items-center gap-2 text-fg/80 group-hover:text-fg text-sm font-medium transition-colors"
                            >
                              {slide.url ? "View Project" : "View Repository"} →
                            </motion.span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-fg/10 to-fg/5 flex flex-col justify-between p-6 md:p-8 border border-fg/20 rounded-xl">
                        <div>
                          <h3 className="font-display text-xl md:text-2xl font-bold text-fg mb-3">
                            {slide.title}
                          </h3>
                          <p className="text-fg/60 text-sm md:text-base leading-relaxed line-clamp-4">
                            {slide.description}
                          </p>
                        </div>
                        
                        {projectLink && index === currentIndex && (
                          <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 text-fg/80 group-hover:text-fg text-sm font-medium transition-colors"
                          >
                            {slide.url ? "View Project" : "View Repository"} →
                          </motion.span>
                        )}
                      </div>
                    )}

                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-fg/10 pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={slidePrev}
        className="absolute left-4 md:left-8 z-30 p-3 rounded-full bg-fg/10 backdrop-blur-sm border border-fg/20 hover:bg-fg/20 transition-all duration-200 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-fg/70 group-hover:text-fg transition-colors" />
      </button>
      
      <button
        onClick={slideNext}
        className="absolute right-4 md:right-8 z-30 p-3 rounded-full bg-fg/10 backdrop-blur-sm border border-fg/20 hover:bg-fg/20 transition-all duration-200 hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-fg/70 group-hover:text-fg transition-colors" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-fg w-6" 
                : "bg-fg/30 hover:bg-fg/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects3DSlider;
