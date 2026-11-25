
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./AdminSidebar.css";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <GraduationCap size={25} />
            </div>

            <div>
              <h2>ExamPortal</h2>
              <span>ADMIN PANEL</span>
            </div>
          </div>

          <button
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        <div className="admin-sidebar-section">
          <p className="admin-sidebar-label">MAIN MENU</p>

          <nav className="admin-sidebar-nav">
            <NavLink
              to="/admin"
              end
              onClick={handleNavigation}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={19} />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/admin/questions"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <BookOpen size={19} />
              <span>Question Bank</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="admin-user-details">
              <strong>{user?.name || "Administrator"}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
