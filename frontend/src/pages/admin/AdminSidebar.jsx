
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  X,
  GraduationCap
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./AdminSidebar.css";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">
            <GraduationCap size={23} />
          </div>

          <div>
            <h2>Testify</h2>
            <span>ADMIN PORTAL</span>
          </div>

          <button
            className="admin-mobile-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-section">
          <span className="admin-sidebar-label">MAIN MENU</span>

          <NavLink
            to="/admin"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/admin/questions"
            onClick={onClose}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <BookOpen size={19} />
            <span>Question Bank</span>
          </NavLink>

          
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="admin-profile-details">
              <strong>{user?.name || "Administrator"}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
