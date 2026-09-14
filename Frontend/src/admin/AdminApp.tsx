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

export default function AdminApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#00ff41] font-mono-matrix text-sm tracking-widest">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020902] text-[#b0ffb0]">
      <Routes>
        <Route path="login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <AdminSidebar />
                <div className="admin-content flex-1">
                  <AdminHeader />
                  <div className="p-6">
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="events" element={<EventsManager />} />
                      <Route path="registrations" element={<RegistrationsManager />} />
                      <Route path="team" element={<TeamManager />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
