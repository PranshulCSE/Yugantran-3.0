import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventsManager from "./pages/EventsManager";
import RegistrationsManager from "./pages/RegistrationsManager";
import TeamManager from "./pages/TeamManager";
import SettingsPage from "./pages/Settings";
import AwardsManager from "./pages/AwardsManager";
import DomainsManager from "./pages/DomainsManager";

export default function AdminApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-cyan-400 font-orbitron text-xs tracking-widest uppercase">INITIALIZING COMMAND TERMINAL...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-space selection:bg-cyan-500/30 selection:text-cyan-200">
      <Routes>
        {/* Login */}
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />}
        />

        {/* Protected admin routes */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <AdminSidebar
                  collapsed={sidebarCollapsed}
                  setCollapsed={setSidebarCollapsed}
                />
                <div className="admin-content flex-1 flex flex-col min-w-0">
                  <AdminHeader
                    onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
                  />
                  <main className="p-3 sm:p-4 md:p-5 flex-1 min-w-0 overflow-x-hidden">
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="events" element={<EventsManager />} />
                      <Route path="registrations" element={<RegistrationsManager />} />
                      <Route path="team" element={<TeamManager />} />
                      <Route path="awards" element={<AwardsManager />} />
                      <Route path="about-tracks" element={<DomainsManager />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
