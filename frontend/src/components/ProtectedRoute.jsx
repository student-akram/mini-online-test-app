
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./ProtectedRoute.css";

const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-spinner"></div>
        <p>Restoring your session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/student"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
