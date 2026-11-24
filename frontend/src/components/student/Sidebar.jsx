
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  History,
  Award,
  BookOpen,
  X
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/student",
      icon: LayoutDashboard,
      end: true
    },
    {
      label: "Take Test",
      path: "/student/test",
      icon: ClipboardList
    },
    {
      label: "My Results",
      path: "/student/results",
      icon: Award
    },
    {
      label: "Exam History",
      path: "/student/history",
      icon: History
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`student-sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <BookOpen size={23} />
          </div>

          <div className="sidebar-brand-text">
            <h2>Testify</h2>
            <span>ONLINE ASSESSMENT</span>
          </div>

          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">MENU</div>

        <nav className="sidebar-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help-card">
            <div className="help-icon">
              <BookOpen size={19} />
            </div>
            <strong>Keep learning!</strong>
            <p>Practice regularly to improve your performance.</p>
          </div>

          <div className="sidebar-version">
            Testify Student Portal · v1.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
