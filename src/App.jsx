import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";
import UserManagement from "./pages/admin/UserManagement";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PartnerList from "./pages/partners/PartnerList.jsx";
import PartnerRegistration from "./pages/partners/PartnerRegistration";
import MyProfile from "./pages/profile/MyProfile";

// Simplified Authentication Guard Component
const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Application Area */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard Layout Shell */}
            <Route element={<Dashboard />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/therapists" element={<div>Therapists Page</div>} />
              <Route path="/clients" element={<div>Clients Page</div>} />
              <Route
                path="/partner-registration"
                element={<PartnerRegistration />}
              />
              <Route path="/existing-partners" element={<PartnerList />} />

              {/* User Management Routes */}
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/create" element={<CreateUser />} />
              <Route path="/admin/users/edit/:id" element={<EditUser />} />
            </Route>
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}