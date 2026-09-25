import { Terminal, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { NAV_ROUTES } from "../routes";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-cyan-500/20 bg-[#020617]/90 backdrop-blur-2xl z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-12">
          {/* Brand & Organizing Bodies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-orbitron text-xl gradient-text font-black">YUGANTRAN 3.0</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed font-body">
              Annual Technical Festival organized by the{" "}
              <strong className="text-cyan-300 font-semibold">School of Computer Science & Engineering</strong> at{" "}
              <strong className="text-white font-semibold">Geeta University</strong>, Panipat-Delhi NCR.
            </p>

            {/* University & Department Logo Badges */}
            <div className="pt-2">
              <div className="text-[11px] font-mono-matrix text-cyan-400/80 uppercase tracking-widest mb-2">
                Organizing Institutions
              </div>
              <div className="inline-flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-2xl border border-cyan-500/20 shadow-md">
                <img
                  src="/images/Geeta/univ-1.jpg"
                  alt="SCSE"
                  title="School of Computer Science & Engineering"
                  className="h-8 w-auto rounded bg-white p-0.5 object-contain"
                />
                <img
                  src="/images/Geeta/univ-2.jpg"
                  alt="GU"
                  title="Geeta University"
                  className="h-8 w-auto rounded bg-white p-0.5 object-contain"
                />
                <img
                  src="/images/Geeta/univ-3.jpg"
                  alt="GTH"
                  title="Geeta Technical Hub"
                  className="h-8 w-auto rounded bg-white p-0.5 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-orbitron text-xs text-cyan-400 font-bold tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              PORTAL NAVIGATION
            </h3>
            <ul className="grid grid-cols-2 gap-2.5">
              {NAV_ROUTES.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-cyan-300 font-mono-matrix text-xs tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="text-cyan-500/60">&gt;</span> {item.name.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="font-orbitron text-xs text-cyan-400 font-bold tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              CAMPUS & CONNECT
            </h3>
            <div className="space-y-3 font-space text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Geeta University, NH-71A, Naultha, Panipat-Delhi NCR, Haryana, India</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a
                  href="mailto:yugantran@geetauniversity.edu.in"
                  className="hover:text-cyan-300 transition-colors truncate"
                >
                  yugantran@geetauniversity.edu.in
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href="tel:+919992560407" className="hover:text-cyan-300 transition-colors">
                  +91 99925 60407 / +91 92110 67540
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/geetauniversitypanipat/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-10 h-10 rounded-xl border border-cyan-500/30 bg-cyan-950/40 flex items-center justify-center text-cyan-400 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/geetauniversitypanipat/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-10 h-10 rounded-xl border border-cyan-500/30 bg-cyan-950/40 flex items-center justify-center text-cyan-400 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-mono-matrix text-xs text-slate-400 tracking-wider">
            © 2026 SCHOOL OF COMPUTER SCIENCE & ENGINEERING, GEETA UNIVERSITY. ALL RIGHTS RESERVED.
          </p>
          <Link
            to="/admin"
            className="font-mono-matrix text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            [ ADMIN PORTAL ]
          </Link>
        </div>
      </div>
    </footer>
  );
}
