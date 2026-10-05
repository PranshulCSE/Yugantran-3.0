import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-cyan-500 selection:text-black">

      {/* Layered Cyber Backgrounds */}
      <MatrixRain />
      
      {/* Global Shared Navigation */}
      <Header />
      <ScrollToTop />

      {/* Main Routed Content */}
      <main className="relative z-10 min-h-screen flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
