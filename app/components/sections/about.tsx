import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative bg-bg section-rail scroll-mt-24"
    >
      <div className="editorial relative py-16 md:py-24">
        <h2 id="about-heading" className="chapter text-fg mb-8 md:mb-12">
          About
        </h2>

        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <figure className="relative md:sticky md:top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper border border-fg/10">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/profile-480.webp 480w, /profile.webp 800w"
                    sizes="(max-width: 768px) 92vw, 420px"
                  />
                  <img
                    src="/profile.jpg"
                    alt="Brian Banna"
                    width={800}
                    height={800}
                    sizes="(max-width: 768px) 92vw, 420px"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
            </figure>
          </div>

          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="max-w-[40rem] space-y-5 font-sans text-[1.125rem] leading-[1.6] text-fg">
              <p>
                Quant analyst (freight trading desk) at Cargill in Geneva.
              </p>

              <p>
                My work focuses on translating physical fundamentals in freight,
                commodity and power markets (S&amp;D balances, storage, trade
                flows, inventories) into signals on price formation, relative
                value and volatility.
              </p>

              <p>
                Previously, I served as President and Head of Sales at Junior
                Entreprise EPFL, Switzerland&apos;s largest student run
                consultancy, where I led a 35 person team. I personally closed
                CHF 430k in projects across commodities and energy, and managed
                more than CHF 500k in total volume, driving 22% YoY revenue
                growth.
              </p>

              <p>
                Outside of work, I&apos;m interested in financial history and
                its links to global politics, philosophy (classical and
                practical), horology and tennis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
