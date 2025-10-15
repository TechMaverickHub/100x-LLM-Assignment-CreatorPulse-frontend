import axios from "axios";
import { API_BASE_URL } from "../constants.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// Request interceptor to add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
