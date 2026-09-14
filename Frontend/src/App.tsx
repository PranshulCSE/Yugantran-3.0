import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Public components
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Events from "./components/Events";
import Register from "./components/Register";
import Timeline from "./components/Timeline";
import Awards from "./components/Awards";
import Team from "./components/Team";
import SubTeam from "./components/SubTeam";
import Footer from "./components/Footer";
import MatrixRain from "./components/MatrixRain";

// Admin components
import AdminApp from "./admin/AdminApp";

import "./styles/globals.css";

// ─── Public Site ──────────────────────────────
function PublicSite() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#b0ffb0] overflow-x-hidden relative">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <Timeline />
          <Events />
          <Awards />
          <Register />
          <Team />
          <SubTeam />
        </main>
        <Footer />
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<PublicSite />} />

          {/* Admin panel — all /admin/* routes handled by AdminApp */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
