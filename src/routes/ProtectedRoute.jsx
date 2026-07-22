import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 1. Wait while Supabase verifies the token and checks allowed_users
  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", color: "#fff" }}>
        <p>Verifying access permissions...</p>
      </div>
    );
  }

  // 2. If verification fails or user is null, send back to Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. User is authorized, render Dashboard
  return children;
}