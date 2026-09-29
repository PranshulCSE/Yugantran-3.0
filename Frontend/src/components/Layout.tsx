import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MatrixRain from "./MatrixRain";
import Header from "./Header";
import Footer from "./Footer";
import FloatingBot from "./FloatingBot";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black transition-colors duration-300">
      {/* Unique Dark Mode Blueprint Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #00f2fe 1.5px, transparent 1px), linear-gradient(to bottom, #00f2fe 1.5px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 15%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 15%, transparent 70%)'
          }}
        />
      </div>

      {/* Layered Cyber Backgrounds */}
      <MatrixRain />
      
      {/* Global Shared Navigation */}
      <Header />
      <ScrollToTop />

      {/* Main Routed Content */}
      <main className="relative z-10 min-h-screen flex flex-col">
        <Outlet />
      </main>

      {/* Global Shared Footer */}
      <Footer />

      {/* YUGA-BOT Mascot Quick Assistant */}
      <FloatingBot />
    </div>
  );
}
