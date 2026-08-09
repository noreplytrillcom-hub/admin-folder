// src/routes/AppRoutes.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import UserManagement from "../pages/admin/UserManagement";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardHome from "../pages/dashboard/DashboardHome";
import ExistingPartners from "../pages/partners/PartnerList";
import PartnerRegistration from "../pages/partners/PartnerRegistration";
import PartnerContracts from "../pages/partners/PartnerContracts";
import MyProfile from "../pages/profile/MyProfile";

// Log Pages
import ErrorLogs from "../pages/exceptions/ErrorLogs";
import JobLogs from "../pages/job-logs/JobLogs";

export default function AppRoutes() {
  return (
    // ❌ NO <BrowserRouter> HERE! Start directly with <Routes>
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Main Dashboard Layout Wrapper */}
      <Route element={<Dashboard />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/clients" element={<div>Clients Component</div>} />
        <Route path="/partner-registration" element={<PartnerRegistration />} />
        <Route path="/existing-partners" element={<ExistingPartners />} />
        <Route path="/partner-contracts" element={<PartnerContracts />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* System Logs */}
        <Route path="/admin/error-logs" element={<ErrorLogs />} />
        <Route path="/admin/job-logs" element={<JobLogs />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
