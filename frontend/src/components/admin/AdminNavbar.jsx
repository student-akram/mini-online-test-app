
import { Menu, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="admin-navbar">
      <button
        className="admin-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      <div className="admin-navbar-title">
        <h3>Admin Workspace</h3>
        <span>Manage your online examination platform</span>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-security-label">
          <ShieldCheck size={16} />
          <span>Secure Admin</span>
        </div>

        <div className="admin-navbar-user">
          <div className="admin-navbar-avatar">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.name || "Administrator"}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
