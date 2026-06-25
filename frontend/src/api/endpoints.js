import api from "./client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function authenticatedVideoUrl(path) {
  const token = localStorage.getItem("visiontrace_token");
  const url = new URL(`${apiBaseUrl}${path}`);
  if (token) {
    url.searchParams.set("access_token", token);
  }
  return url.toString();
}

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const videoApi = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/video/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },
  startProcessing: (sessionId) => api.post(`/video/start-processing/${sessionId}`),
  session: (sessionId) => api.get(`/video/session/${sessionId}`),
  sessions: () => api.get("/video/sessions"),
  videoUrl: authenticatedVideoUrl,
};

export const analyticsApi = {
  dashboardSummary: () => api.get("/analytics/dashboard-summary"),
  trafficStats: (sessionId) => api.get(`/analytics/traffic-stats/${sessionId}`),
  alerts: (sessionId) => api.get(`/analytics/alerts/${sessionId}`),
};
