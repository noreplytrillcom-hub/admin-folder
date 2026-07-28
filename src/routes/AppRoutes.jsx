import { Navigate, Route, Routes } from "react-router-dom";

// Layout & Pages
import UserManagement from "../pages/admin/UserManagement";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardHome from "../pages/dashboard/DashboardHome";
import ExistingPartners from "../pages/partners/PartnerList";
import PartnerRegistration from "../pages/partners/PartnerRegistration";
import MyProfile from "../pages/profile/MyProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* 
        PATHLESS LAYOUT ROUTE:
        By omitting the 'path' prop here, Dashboard acts purely as a wrapper.
        All child routes below will render inside Dashboard's <Outlet />.
      */}
      <Route element={<Dashboard />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/therapists" element={<div>Therapists Component</div>} />
        <Route path="/clients" element={<div>Clients Component</div>} />
        <Route path="/partner-registration" element={<PartnerRegistration />} />
        <Route path="/existing-partners" element={<ExistingPartners />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
