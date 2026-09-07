import React from "react";
import { Navigate, useLocation, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { C, FONT } from "@/tokens";

interface ProtectedRouteProps {
  requiredRole?: "student" | "admin";
  children?: React.ReactNode;
}

export default function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          background: C.bg,
          fontFamily: FONT.body,
        }}
      >
        <div style={{ position: "relative", width: 64, height: 64, marginBottom: 20 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${C.border}`,
              borderTopColor: C.accent,
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <img
            src="/gyanmarg_logo.jpg"
            alt="GyanMarg AI"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              position: "absolute",
              top: 10,
              left: 10,
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>
          Authenticating session...
        </div>
        <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>
          GyanMarg Competency Intelligence
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.role && profile.role !== requiredRole) {
    const target = profile.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
    return <Navigate to={target} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
