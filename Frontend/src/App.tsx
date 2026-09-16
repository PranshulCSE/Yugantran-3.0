import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import AdminApp from "./admin/AdminApp";
import CyberBackground from "./components/CyberBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Multi-Page Views
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import TimelinePage from "./pages/TimelinePage";
import AwardsPage from "./pages/AwardsPage";
import TeamPage from "./pages/TeamPage";
import RegisterPage from "./pages/RegisterPage";

// ScrollToTop helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic Cyber Background */}
      <CyberBackground />

      {/* Persistent Multi-Page Navigation Header */}
      <Header />

      {/* Active Page View */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Admin Portal */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Multi-Page Public Portal */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/events"
            element={
              <PublicLayout>
                <EventsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/events/:slug"
            element={
              <PublicLayout>
                <EventDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/timeline"
            element={
              <PublicLayout>
                <TimelinePage />
              </PublicLayout>
            }
          />
          <Route
            path="/awards"
            element={
              <PublicLayout>
                <AwardsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/team"
            element={
              <PublicLayout>
                <TeamPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
