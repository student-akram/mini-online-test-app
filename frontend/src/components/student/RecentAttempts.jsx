
import { Clock3, ArrowUpRight, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./RecentAttempts.css";

const RecentAttempts = ({ attempts = [], loading, error }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <section className="recent-attempts-card">
      <div className="recent-attempts-header">
        <div>
          <h3>Recent Attempts</h3>
          <p>Your latest examination activity</p>
        </div>

        <button
          className="view-history-button"
          onClick={() => navigate("/student/history")}
        >
          View all <ArrowUpRight size={15} />
        </button>
      </div>

      {loading ? (
        <div className="attempts-message">
          Loading your exam history...
        </div>
      ) : error ? (
        <div className="attempts-message attempts-error">
          {error}
        </div>
      ) : attempts.length === 0 ? (
        <div className="attempts-empty">
          <ClipboardCheck size={35} />
          <strong>No exam attempts yet</strong>
          <p>Your completed exams will appear here.</p>
        </div>
      ) : (
        <div className="attempts-list">
          {attempts.map((attempt) => {
            const percentage = attempt.percentage ?? 0;

            return (
              <div className="attempt-row" key={attempt.attemptId}>
                <div className="attempt-subject-icon">
                  <ClipboardCheck size={19} />
                </div>

                <div className="attempt-main">
                  <strong>Online Assessment</strong>
                  <span>
                    <Clock3 size={13} />
                    {formatDate(attempt.submittedAt)}
                  </span>
                </div>

                <div className="attempt-score">
                  <strong>
                    {attempt.score}/{attempt.totalQuestions}
                  </strong>
                  <span>{percentage}%</span>
                </div>

                <button
                  className="attempt-view-button"
                  onClick={() =>
                    navigate(
                      `/student/results/${attempt.attemptId}`
                    )
                  }
                  title="View result"
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentAttempts;
