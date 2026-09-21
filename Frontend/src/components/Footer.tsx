import { Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { NAV_ROUTES } from "../routes";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-[rgba(0,255,65,0.1)] bg-[rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand & Organizing Bodies */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-[#00ff41]" />
              <span className="font-orbitron text-lg gradient-text font-bold">YUGANTRAN 3.0</span>
            </div>
            <p className="text-[rgba(176,255,176,0.55)] text-sm leading-relaxed mb-4 font-body">
              Annual Technical Festival organized by the School of Computer Science & Engineering at Geeta University, Panipat.
            </p>
            <div className="flex items-center gap-3 py-2">
              <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-[rgba(0,255,65,0.2)]">
                <img
                  src="/images/Geeta/univ-1.jpg"
                  alt="SCSE"
                  title="School of Computer Science & Engineering"
                  className="h-9 w-auto rounded bg-white p-0.5 object-contain"
                />
                <img
                  src="/images/Geeta/univ-2.jpg"
                  alt="GU"
                  title="Geeta University"
                  className="h-9 w-auto rounded bg-white p-0.5 object-contain"
                />
                <img
                  src="/images/Geeta/univ-3.jpg"
                  alt="GTH"
                  title="Geeta Technical Hub"
                  className="h-9 w-auto rounded bg-white p-0.5 object-contain"
                />
              </div>
            </div>
            <p className="font-mono-matrix text-xs text-[rgba(0,255,65,0.4)] tracking-widest mt-3">
              SCSE • GU • GTH
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-orbitron text-xs text-[#00ff41] tracking-widest mb-4">NAVIGATION</h3>
            <ul className="space-y-2">
              {NAV_ROUTES.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[rgba(176,255,176,0.45)] hover:text-[#00ff41] font-mono-matrix text-sm tracking-wide transition-colors"
                  >
                    &gt; {item.name.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-orbitron text-xs text-[#00ff41] tracking-widest mb-4">CONTACT</h3>
            <div className="space-y-3 font-mono-matrix text-sm">
              <p className="text-[rgba(176,255,176,0.45)]">
                📍 Geeta University, Panipat–Delhi NCR<br />
                Haryana, India
              </p>
              <a
                href="mailto:yugantran@geetauniversity.edu.in"
                className="block text-[rgba(176,255,176,0.45)] hover:text-[#00ff41] transition-colors"
              >
                📧 yugantran@geetauniversity.edu.in
              </a>
              <a
                href="tel:+919211067540"
                className="block text-[rgba(176,255,176,0.45)] hover:text-[#00ff41] transition-colors"
              >
                📞 +91 9992560407
              </a>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/geetauniversitypanipat/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-lg border border-[rgba(0,255,65,0.2)] flex items-center justify-center text-[rgba(0,255,65,0.5)] hover:border-[#00ff41] hover:text-[#00ff41] transition-all"
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
                className="w-9 h-9 rounded-lg border border-[rgba(0,255,65,0.2)] flex items-center justify-center text-[rgba(0,255,65,0.5)] hover:border-[#00ff41] hover:text-[#00ff41] transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(0,255,65,0.08)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono-matrix text-xs text-[rgba(176,255,176,0.25)] tracking-wider">
            © 2026 SCHOOL OF COMPUTER SCIENCE & ENGINEERING, GEETA UNIVERSITY-PANIPAT ALL RIGHTS RESERVED
          </p>
          <Link to="/admin" className="font-mono-matrix text-xs text-[rgba(0,255,65,0.2)] hover:text-[rgba(0,255,65,0.45)] transition-colors">
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
