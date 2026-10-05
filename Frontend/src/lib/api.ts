/// <reference types="vite/client" />
import axios from "axios";
import {
  FALLBACK_EVENTS,
  FALLBACK_DOMAINS,
  FALLBACK_AWARDS,
  FALLBACK_SETTINGS,
} from "../data/fallbackData";
import coreTeamData from "../data/team.json";
import { Event, TeamMember, Award, Domain, Registration } from "../types";


const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5005").replace(/\/+$/, "");

// ─── Axios instances ───────────────────────────────────────────────────────────

const api = axios.create({ baseURL: BASE_URL, timeout: 60000 });

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
      console.warn("API returned empty events, using fallback.");
      return { data: FALLBACK_EVENTS };
    } catch (err) {
      console.error("Failed to fetch events from API:", err);
      return { data: FALLBACK_EVENTS };
    }
  },

  getEventBySlug: async (slug: string) => {
    try {
      const res = await api.get(`/api/events/${slug}`);
      if (res.data) return res;
      const found = FALLBACK_EVENTS.find((e) => e.slug === slug);
      console.warn(`Event ${slug} not found via API, using fallback.`);
      return { data: found || null };
    } catch (err) {
      console.error(`Failed to fetch event ${slug} from API:`, err);
      const found = FALLBACK_EVENTS.find((e) => e.slug === slug);
      return { data: found || null };
    }
  },

  getTeam: async (category?: string) => {
    try {
      const res = await api.get("/api/team", { params: category ? { category } : {} });
      if (Array.isArray(res.data)) return res;
      console.warn("API returned empty team, using fallback.");
      return { data: [] };
    } catch (err) {
      console.error("Failed to fetch team from API:", err);
      let filtered = coreTeamData as unknown as TeamMember[];
      if (category) {
        filtered = filtered.filter((m) => (m.category || "core") === category);
      }
      return { data: filtered };
    }
  },

  getSettings: async () => {
    try {
      const res = await api.get("/api/settings");
      if (res.data) return res;
      console.warn("API returned empty settings, using fallback.");
      return { data: FALLBACK_SETTINGS };
    } catch (err) {
      console.error("Failed to fetch settings from API:", err);
      return { data: FALLBACK_SETTINGS };
    }
  },

  getAwards: async () => {
    try {
      const res = await api.get("/api/awards");
      if (Array.isArray(res.data) && res.data.length > 0) return res;
      console.warn("API returned empty awards, using fallback.");
      return { data: FALLBACK_AWARDS };
    } catch (err) {
      console.error("Failed to fetch awards from API:", err);
      return { data: FALLBACK_AWARDS };
    }
  },

  getDomains: async () => {
    try {
      const res = await api.get("/api/domains");
      if (Array.isArray(res.data) && res.data.length > 0) return res;
      console.warn("API returned empty domains, using fallback.");
      return { data: FALLBACK_DOMAINS };
    } catch (err) {
      console.error("Failed to fetch domains from API:", err);
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
  getAllEvents: () => api.get<Event[]>("/api/events/admin/all"),
  createEvent: (data: Partial<Event>) => api.post("/api/events/admin", data),
  updateEvent: (id: string, data: Partial<Event>) => api.put(`/api/events/admin/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/api/events/admin/${id}`),

  // Registrations
  getRegistrations: (params?: Record<string, unknown>) => api.get<{ registrations: Registration[], total: number }>("/api/registrations/admin", { params }),
  updateRegistration: (id: string, data: Partial<Registration>) => api.put(`/api/registrations/admin/${id}`, data),
  sendConfirmationEmail: (id: string) => api.post(`/api/registrations/admin/send-email/${id}`),
  syncRegistrationToSheet: (id: string) => api.post(`/api/registrations/admin/sync-sheet/${id}`),
  syncAllToSheets: () => api.post("/api/registrations/admin/sync-all", {}, { timeout: 120000 }),
  exportRegistrations: (params?: Record<string, unknown>) =>
    api.get("/api/registrations/admin/export", { params, responseType: "blob" }),
  getStats: () => api.get("/api/registrations/admin/stats"),

  // Team
  getAllTeam: () => api.get<TeamMember[]>("/api/team/admin"),
  createTeamMember: (data: Partial<TeamMember>) => api.post("/api/team/admin", data),
  updateTeamMember: (id: string, data: Partial<TeamMember>) => api.put(`/api/team/admin/${id}`, data),
  deleteTeamMember: (id: string) => api.delete(`/api/team/admin/${id}`),

  // Settings
  getSettings: () => api.get("/api/settings/admin"),
  updateSettings: (data: Record<string, unknown>) => api.put("/api/settings/admin", data),

  // Awards
  getAllAwards: () => api.get<Award[]>("/api/awards/admin"),
  createAward: (data: Partial<Award>) => api.post("/api/awards/admin", data),
  updateAward: (id: string, data: Partial<Award>) => api.put(`/api/awards/admin/${id}`, data),
  deleteAward: (id: string) => api.delete(`/api/awards/admin/${id}`),

  // Domains
  getAllDomains: () => api.get<Domain[]>("/api/domains/admin"),
  createDomain: (data: Partial<Domain>) => api.post("/api/domains/admin", data),
  updateDomain: (id: string, data: Partial<Domain>) => api.put(`/api/domains/admin/${id}`, data),
  deleteDomain: (id: string) => api.delete(`/api/domains/admin/${id}`),
};

export default api;
