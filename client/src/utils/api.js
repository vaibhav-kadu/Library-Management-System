import axios from "axios";

// Detect which base URL to use
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL;

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 10000, // 10s timeout
});

// Optional: Fallback if Railway is down
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (
      error.code === "ERR_NETWORK" &&
      import.meta.env.VITE_API_URL &&
      import.meta.env.VITE_API_URL_LOCAL
    ) {
      console.warn("⚠️ Render not reachable, falling back to localhost...");
      return axios({
        ...error.config,
        baseURL: import.meta.env.VITE_API_URL_LOCAL,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
