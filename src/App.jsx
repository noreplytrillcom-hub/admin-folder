import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#080c14",
          color: "#818cf8",
        }}
      >
        <p>Verifying session...</p>
      </div>
    );
  }

  // FIXED: Standard Navigate component syntax
  return user ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Login Page */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
