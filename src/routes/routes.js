import { getAbsoluteUrl } from "../utils/urlHelper";

// 1. Define clean browser URL paths
export const PATHS = {
  HOME: "/dashboard",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGIN: "/login",
  ADMIN_USERS: "/admin/users", // <--- Added your route here
};

// 2. Automatically converts each path into a full URL (e.g., https://yourdomain.com/admin/users)
export const FULL_URLS = Object.entries(PATHS).reduce((acc, [key, path]) => {
  acc[key] = getAbsoluteUrl(path);
  return acc;
}, {});
