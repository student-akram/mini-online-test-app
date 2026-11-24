
import { Menu, Bell, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./TopNavbar.css";

const TopNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="student-topbar">
      <div className="topbar-left">
        <button className="mobile-menu-button" onClick={onMenuClick}>
          <Menu size={22} />
        </button>

        <div>
          <span className="topbar-label">STUDENT PORTAL</span>
          <h2>My Dashboard</h2>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="topbar-icon-button" title="Notifications">
          <Bell size={19} />
        </button>

        <div className="topbar-divider" />

        <div className="topbar-user">
          <div className="topbar-avatar">
            {initials || <UserRound size={19} />}
          </div>

          <div className="topbar-user-info">
            <strong>{user?.name}</strong>
            <span>Student</span>
          </div>
        </div>

        <button
          className="topbar-logout"
          onClick={logout}
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
