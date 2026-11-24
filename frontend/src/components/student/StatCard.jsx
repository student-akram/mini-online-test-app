
import "./StatCard.css";

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <article className="student-stat-card">
      <div className={`stat-icon stat-${color}`}>
        <Icon size={21} />
      </div>

      <div className="stat-details">
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{subtitle}</span>
      </div>
    </article>
  );
};

export default StatCard;
