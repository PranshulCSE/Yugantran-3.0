import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("yugantran_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("yugantran_admin_token");
      localStorage.removeItem("yugantran_admin");
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

// ─── Public APIs ─────────────────────────────────
export const publicApi = {
  getEvents: () => api.get("/api/events"),
  getEvent: (slug: string) => api.get(`/api/events/${slug}`),
  getTeam: (category?: string) => api.get("/api/team", { params: { category } }),
  getSettings: () => api.get("/api/settings"),
  register: (formData: FormData) =>
    api.post("/api/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Admin APIs ──────────────────────────────────
export const adminApi = {
  // Auth
  login: (username: string, password: string) =>
    api.post("/api/auth/login", { username, password }),
  me: () => api.get("/api/auth/me"),

  // Dashboard
  getStats: () => api.get("/api/registrations/admin/stats"),

  // Events
  getAllEvents: () => api.get("/api/events/admin/all"),
  createEvent: (data: any) => api.post("/api/events/admin", data),
  updateEvent: (id: string, data: any) => api.put(`/api/events/admin/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/api/events/admin/${id}`),

  // Registrations
  getRegistrations: (params?: any) => api.get("/api/registrations/admin", { params }),
  updateRegistration: (id: string, data: any) => api.put(`/api/registrations/admin/${id}`, data),
  exportRegistrations: (params?: any) =>
    api.get("/api/registrations/admin/export", {
      params,
      responseType: "blob",
    }),

  // Team
  getAllTeam: () => api.get("/api/team/admin"),
  createTeamMember: (data: any) => api.post("/api/team/admin", data),
  updateTeamMember: (id: string, data: any) => api.put(`/api/team/admin/${id}`, data),
  deleteTeamMember: (id: string) => api.delete(`/api/team/admin/${id}`),

  // Settings
  getSettings: () => api.get("/api/settings/admin"),
  updateSettings: (data: any) => api.put("/api/settings/admin", data),
};

export default api;
