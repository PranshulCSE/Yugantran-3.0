import { motion } from "motion/react";

export interface PartnerLogo {
  id: string;
  name: string;
  image: string;
}

// Easy list for user to add more logos anytime
export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    id: "scse",
    name: "School of Computer Science & Engineering",
    image: "/images/Geeta/univ-1.jpg",
  },
  {
    id: "gu",
    name: "Geeta University",
    image: "/images/Geeta/univ-2.png",
  },
  {
    id: "gth",
    name: "Geeta Technical Hub",
    image: "/images/Geeta/univ-3.jpg",
  },
  // Seamless loop duplicates
  {
    id: "scse-2",
    name: "School of Computer Science & Engineering",
    image: "/images/Geeta/univ-1.jpg",
  },
  {
    id: "gu-2",
    name: "Geeta University",
    image: "/images/Geeta/univ-2.png",
  },
  {
    id: "gth-2",
    name: "Geeta Technical Hub",
    image: "/images/Geeta/univ-3.jpg",
  },
];

export default function LogoTicker() {
  // Duplicate array 3 times for a seamless infinite loop marquee
  const tickerItems = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className="w-full py-4 relative">
      <div className="text-center mb-3">
        <span className="font-mono-matrix text-[11px] sm:text-xs text-cyan-400 font-bold uppercase tracking-[0.25em] px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.15)] inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          ORGANIZING INSTITUTIONS & PARTNERS
        </span>
      </div>

      {/* Infinite Scrolling Marquee Track with Gradient Edge Masking */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-3">
          {tickerItems.map((logo, idx) => (
            <div
              key={`${logo.id}-${idx}`}
              className="flex-shrink-0 flex items-center justify-center h-16 sm:h-20 min-w-[160px] sm:min-w-[200px] px-6 py-2.5 rounded-2xl bg-white/95 border border-cyan-400/40 shadow-[0_4px_25px_rgba(0,242,254,0.2)] hover:scale-105 hover:border-cyan-300 transition-all duration-300"
              title={logo.name}
            >
              <img
                src={logo.image}
                alt={logo.name}
                className="h-10 sm:h-14 w-auto max-w-[170px] object-contain select-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
