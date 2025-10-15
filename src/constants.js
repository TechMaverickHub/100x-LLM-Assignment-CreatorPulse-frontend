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
  
  // Mail Routes
  MAIL_USER_LIST: "mail/user-list-filter",
  MAIL_COUNT: "mail/count-newsletter-received",
  MAIL_LATEST: "mail/latest-newsletter",
  
  // Topics Routes
  TOPICS_LIST: "topic/list",
  USER_TOPICS_LIST: "topic/user-topic-list",
  USER_TOPICS_UPDATE: "topic/user-topic-update",
  
  // Admin Routes
  ADMIN_SOURCES: "admin/sources/",
};

// Role Dictionary - Maps role IDs to role names
export const ROLE_DICTIONARY = {
  1: 'superadmin',
  2: 'user'
};

// Helper function to get role name from role ID
export const getRoleName = (roleId) => {
  return ROLE_DICTIONARY[roleId] || 'user';
};

// Helper function to check if user is admin
export const isAdmin = (roleId) => {
  return roleId === 1; // superadmin
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
  MAIL_USER_LIST: buildApiUrl(API_ROUTES.MAIL_USER_LIST),
  MAIL_COUNT: buildApiUrl(API_ROUTES.MAIL_COUNT),
  MAIL_LATEST: buildApiUrl(API_ROUTES.MAIL_LATEST),
  TOPICS_LIST: buildApiUrl(API_ROUTES.TOPICS_LIST),
  USER_TOPICS_LIST: buildApiUrl(API_ROUTES.USER_TOPICS_LIST),
  USER_TOPICS_UPDATE: buildApiUrl(API_ROUTES.USER_TOPICS_UPDATE),
  ADMIN_SOURCES: buildApiUrl(API_ROUTES.ADMIN_SOURCES),
};
