import { Link } from "react-router-dom";
import { Sparkles, Zap, MapPin, Mail, Phone, ExternalLink, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative border-t border-cyan-500/20 bg-[#02050e]/95 backdrop-blur-2xl text-slate-300 pt-20 pb-12 overflow-hidden"
    >
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.4)]">
                <Zap className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-orbitron text-xl font-black tracking-wider text-white">
                  YUGANTRAN 3.0
                </span>
                <span className="block text-[10px] font-mono-matrix text-cyan-400 tracking-widest">
                  NEXTGEN TECH FESTIVAL
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm font-body leading-relaxed max-w-sm">
              The flagship annual technical festival of the School of Computer Science &
              Engineering, Geeta University. Bringing together 500+ student developers and hackers.
            </p>

            <div className="pt-2">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-xs font-mono-matrix text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                INNOVATE • BUILD • COMPETE • TRANSFORM
              </span>
            </div>
          </div>

          {/* Col 2: Multi-Page Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-orbitron font-bold text-xs text-white tracking-widest uppercase">
              EXPLORE PAGES
            </h4>

            <ul className="space-y-2.5 font-space text-sm">
              {[
                { name: "Home Portal", path: "/" },
                { name: "About Fest & Vision", path: "/about" },
                { name: "All 14 Competitions", path: "/events" },
                { name: "Event Schedule (Timeline)", path: "/timeline" },
                { name: "Bounties & Awards", path: "/awards" },
                { name: "Organizing Committee", path: "/team" },
                { name: "Squad Registration", path: "/register" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-cyan-500 opacity-60 group-hover:opacity-100">&gt;</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Campus & Contact */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-orbitron font-bold text-xs text-white tracking-widest uppercase">
              CAMPUS & DESK
            </h4>

            <div className="space-y-3.5 font-space text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                <span>
                  Geeta University Campus, NH-44, GT Road, Panipat-Delhi NCR, Haryana 132145, India
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a
                  href="mailto:yugantran@geetauniversity.edu.in"
                  className="hover:text-cyan-300 transition-colors"
                >
                  yugantran@geetauniversity.edu.in
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href="tel:+919211067540" className="hover:text-cyan-300 transition-colors">
                  +91 92110 67540
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/geetauniversitypanipat/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-space font-semibold text-slate-300 hover:border-cyan-400 hover:text-white transition-all shadow-md"
              >
                <span>Instagram @geetauniversity</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-space text-slate-400">
          <p>© 2026 YUGANTRAN 3.0 • SCSE • GEETA UNIVERSITY. ALL RIGHTS RESERVED.</p>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-slate-400 hover:text-cyan-400 transition-colors font-mono-matrix text-xs flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Terminal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
