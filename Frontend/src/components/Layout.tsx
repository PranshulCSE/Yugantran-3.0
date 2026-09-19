import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import MatrixRain from "./MatrixRain";
import Header from "./Header";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#b0ffb0] overflow-x-hidden">
      <MatrixRain />
      <Header />
      <ScrollToTop />
      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Outlet />
          </div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
