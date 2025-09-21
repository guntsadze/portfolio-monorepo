export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    REFRESH: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
    PROFILE: "/api/v1/auth/profile",
  },
  USERS: {
    PROFILE: "/api/v1/users/profile",
  },
} as const;
