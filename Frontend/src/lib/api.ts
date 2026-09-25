import axios from "axios";
import {
  FALLBACK_EVENTS,
  FALLBACK_DOMAINS,
  FALLBACK_AWARDS,
  FALLBACK_SETTINGS,
} from "../data/fallbackData";
import coreTeamData from "../data/team.json";
import subTeamData from "../data/sub.json";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ─── Axios instances ───────────────────────────────────────────────────────────

const api = axios.create({ baseURL: BASE_URL, timeout: 3500 });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("yugantran_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("yugantran_admin_token");
      localStorage.removeItem("yugantran_admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

// ─── Public API ────────────────────────────────────────────────────────────────

export const publicApi = {
  getEvents: async () => {
    try {
      const res = await api.get("/api/events");
      if (Array.isArray(res.data) && res.data.length > 0) return res;
      return { data: FALLBACK_EVENTS };
    } catch {
      return { data: FALLBACK_EVENTS };
    }
  },

  getEventBySlug: async (slug: string) => {
    try {
      const res = await api.get(`/api/events/${slug}`);
      if (res.data) return res;
      const found = FALLBACK_EVENTS.find((e) => e.slug === slug);
      return { data: found || null };
    } catch {
      const found = FALLBACK_EVENTS.find((e) => e.slug === slug);
      return { data: found || null };
    }
  },

  getTeam: async (category?: string) => {
    try {
      const res = await api.get("/api/team", { params: category ? { category } : {} });
      if (Array.isArray(res.data) && res.data.length > 0) return res;
      if (category === "subteam") return { data: subTeamData };
      return { data: coreTeamData };
    } catch {
      if (category === "subteam") return { data: subTeamData };
      return { data: coreTeamData };
    }
  },

  getSettings: async () => {
    try {
      const res = await api.get("/api/settings");
      if (res.data) return res;
      return { data: FALLBACK_SETTINGS };
    } catch {
      return { data: FALLBACK_SETTINGS };
    }
  },

  getAwards: async () => {
    try {
      const res = await api.get("/api/awards");
      if (Array.isArray(res.data) && res.data.length > 0) return res;
      return { data: FALLBACK_AWARDS };
    } catch {
      return { data: FALLBACK_AWARDS };
    }
  },

  getDomains: async () => {
    try {
      const res = await api.get("/api/domains");
      if (Array.isArray(res.data) && res.data.length > 0) return res;
      return { data: FALLBACK_DOMAINS };
    } catch {
      return { data: FALLBACK_DOMAINS };
    }
  },

  register: (formData: FormData) =>
    api.post("/api/register", formData, { headers: { "Content-Type": "multipart/form-data" } }),
};

// ─── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {
  // Auth
  login: (username: string, password: string) =>
    api.post("/api/auth/login", { username, password }),
  me: () => api.get("/api/auth/me"),

  // Events
  getAllEvents: () => api.get("/api/events/admin/all"),
  createEvent: (data: any) => api.post("/api/events/admin", data),
  updateEvent: (id: string, data: any) => api.put(`/api/events/admin/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/api/events/admin/${id}`),

  // Registrations
  getRegistrations: (params?: any) => api.get("/api/registrations/admin", { params }),
  updateRegistration: (id: string, data: any) => api.put(`/api/registrations/admin/${id}`, data),
  exportRegistrations: (params?: any) =>
    api.get("/api/registrations/admin/export", { params, responseType: "blob" }),
  getStats: () => api.get("/api/registrations/admin/stats"),

  // Team
  getAllTeam: () => api.get("/api/team/admin"),
  createTeamMember: (data: any) => api.post("/api/team/admin", data),
  updateTeamMember: (id: string, data: any) => api.put(`/api/team/admin/${id}`, data),
  deleteTeamMember: (id: string) => api.delete(`/api/team/admin/${id}`),

  // Settings
  getSettings: () => api.get("/api/settings/admin"),
  updateSettings: (data: any) => api.put("/api/settings/admin", data),

  // Awards
  getAllAwards: () => api.get("/api/awards/admin"),
  createAward: (data: any) => api.post("/api/awards/admin", data),
  updateAward: (id: string, data: any) => api.put(`/api/awards/admin/${id}`, data),
  deleteAward: (id: string) => api.delete(`/api/awards/admin/${id}`),

  // Domains
  getAllDomains: () => api.get("/api/domains/admin"),
  createDomain: (data: any) => api.post("/api/domains/admin", data),
  updateDomain: (id: string, data: any) => api.put(`/api/domains/admin/${id}`, data),
  deleteDomain: (id: string) => api.delete(`/api/domains/admin/${id}`),
};

export default api;
