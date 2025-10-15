// API Configuration Constants
export const API_BASE_URL = "http://localhost:8000/api";

// API Routes
export const API_ROUTES = {
  // User Authentication Routes
  USER_LOGIN: "user/login/",
  USER_REGISTER: "user/register/",
  USER_REFRESH: "user/refresh/",
  USER_TOPICS: "user/topics/",
  
  // Newsletter Routes
  NEWSLETTER_LATEST: "newsletter/latest/",
  NEWSLETTER_BY_DATE: "newsletter/", // Will be used with date parameter
  NEWSLETTER_HISTORY: "newsletter/history/",
  
  // Topics Routes
  TOPICS: "topics/",
  
  // Admin Routes
  ADMIN_SOURCES: "admin/sources/",
};

// Helper function to build full API URLs
export const buildApiUrl = (route) => {
  return `${API_BASE_URL}/${route}`;
};

// Pre-built full URLs for commonly used endpoints
export const FULL_API_URLS = {
  USER_LOGIN: buildApiUrl(API_ROUTES.USER_LOGIN),
  USER_REGISTER: buildApiUrl(API_ROUTES.USER_REGISTER),
  USER_REFRESH: buildApiUrl(API_ROUTES.USER_REFRESH),
  USER_TOPICS: buildApiUrl(API_ROUTES.USER_TOPICS),
  NEWSLETTER_LATEST: buildApiUrl(API_ROUTES.NEWSLETTER_LATEST),
  NEWSLETTER_HISTORY: buildApiUrl(API_ROUTES.NEWSLETTER_HISTORY),
  TOPICS: buildApiUrl(API_ROUTES.TOPICS),
  ADMIN_SOURCES: buildApiUrl(API_ROUTES.ADMIN_SOURCES),
};
