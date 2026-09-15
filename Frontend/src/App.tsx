import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminApp from "./admin/AdminApp";
import MatrixRain from "./components/MatrixRain";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Timeline from "./components/Timeline";
import Events from "./components/Events";
import Awards from "./components/Awards";
import Register from "./components/Register";
import Team from "./components/Team";
import SubTeam from "./components/subTeam";
import Footer from "./components/Footer";
import "./styles/globals.css";

function PublicSite() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-[#b0ffb0] overflow-x-hidden">
      <MatrixRain />
      <Header />
      <main className="relative z-10">
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
