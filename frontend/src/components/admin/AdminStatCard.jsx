
import "./AdminStatCard.css";

const AdminStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue"
}) => {
  return (
    <article className="admin-stat-card">
      <div className={`admin-stat-icon admin-stat-${color}`}>
        <Icon size={22} />
      </div>

      <div className="admin-stat-details">
        <span>{title}</span>
        <strong>{value}</strong>
        <p>{subtitle}</p>
      </div>
    </article>
  );
};

export default AdminStatCard;
