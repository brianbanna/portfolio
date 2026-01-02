"use client";
import React from "react";

interface LogoItem {
  name: string;
  icon?: string;
}

interface LogoMarqueeProps {
  items: LogoItem[];
  speed?: number;
  direction?: "left" | "right";
}

export const LogoMarquee: React.FC<LogoMarqueeProps> = ({
  items,
  speed = 50,
  direction = "left",
}) => {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg to-transparent z-10" />
      <div 
        className={`flex gap-6 ${direction === "left" ? "animate-marquee" : "animate-marquee-reverse"}`} 
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-fg/5 border border-fg/10 hover:border-fg/30 hover:bg-fg/10 transition-all duration-200"
            title={item.name}
          >
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.name}
                className="w-7 h-7"
              />
            ) : (
              <span className="text-xs text-fg/60 font-medium px-1 text-center">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

