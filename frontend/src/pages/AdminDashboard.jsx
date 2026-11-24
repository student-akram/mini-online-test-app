
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <main className="admin-placeholder">
      <div className="admin-placeholder-card">
        <span className="admin-placeholder-label">
          ADMINISTRATION
        </span>
        <h1>Welcome, {user?.name}</h1>
        <p>Your admin dashboard will be built in the next milestone.</p>
        <button onClick={logout}>Sign out</button>
      </div>
    </main>
  );
};

export default AdminDashboard;
