import { Route, Routes } from "react-router-dom";

// Your imports
import UserManagement from "../pages/admin/UserManagement";
// ... import your other page components here

// Import PATHS from routes.js
import { PATHS } from "./routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Your admin users route using the PATHS object */}
      <Route path={PATHS.ADMIN_USERS} element={<UserManagement />} />

      {/* Other routes... */}
      <Route path={PATHS.HOME} element={<Dashboard />} />
      <Route path={PATHS.LOGIN} element={<Login />} />
    </Routes>
  );
}
