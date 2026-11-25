
import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Trophy,
  Target,
  RefreshCw,
  CalendarDays,
  ArrowRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import Sidebar from "../components/student/Sidebar";
import TopNavbar from "../components/student/TopNavbar";

import "./HistoryPage.css";

const HistoryPage = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const limit = 8;

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/history?page=${page}&limit=${limit}`
      );

      const data = response.data;

      const history = data.history || [];

      setAttempts(history);

      setTotalPages(
        Math.max(
          1,
          data.totalPages ??
          data.pagination?.totalPages ??
          1
        )
      );

      setTotalAttempts(
        data.totalAttempts ??
        data.total ??
        data.pagination?.total ??
        history.length
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your examination history."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const averagePercentage = attempts.length
    ? (
        attempts.reduce(
          (sum, attempt) =>
            sum + Number(attempt.percentage || 0),
          0
        ) / attempts.length
      ).toFixed(1)
    : "0.0";

  const highestPercentage = attempts.length
    ? Math.max(
        ...attempts.map((attempt) =>
          Number(attempt.percentage || 0)
        )
      )
    : 0;

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
    <div className="student-dashboard">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="student-dashboard-main">

        <TopNavbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="history-page-content">

          {/* Page Heading */}
          <section className="history-page-heading">
            <div>
              <span>YOUR PERFORMANCE</span>

              <h1>Exam History</h1>

              <p>
                Review your previous examinations and track
                your learning progress.
              </p>
            </div>

            <button
              className="history-refresh-button"
              onClick={fetchHistory}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? "history-refreshing" : ""}
              />
              Refresh
            </button>
          </section>

          {/* Statistics */}
          <section className="history-overview">

            <div className="history-overview-card">
              <div className="history-overview-icon overview-blue">
                <ClipboardList size={21} />
              </div>

              <div>
                <span>Total Attempts</span>
                <strong>{totalAttempts}</strong>
              </div>
            </div>

            <div className="history-overview-card">
              <div className="history-overview-icon overview-green">
                <Target size={21} />
              </div>

              <div>
                <span>Average Score</span>
                <strong>{averagePercentage}%</strong>
              </div>
            </div>

            <div className="history-overview-card">
              <div className="history-overview-icon overview-purple">
                <Trophy size={21} />
              </div>

              <div>
                <span>Best Percentage</span>
                <strong>{highestPercentage}%</strong>
              </div>
            </div>

          </section>

          {/* History Table */}
          <section className="history-list-section">

            <div className="history-list-heading">
              <div>
                <h2>All Examinations</h2>
                <p>
                  Your previous completed examination attempts
                </p>
              </div>

              <span className="history-count">
                {totalAttempts} attempts
              </span>
            </div>

            {loading ? (
              <div className="history-loading">
                <div className="history-spinner" />
                <p>Loading your examination history...</p>
              </div>
            ) : error ? (
              <div className="history-error">
                <p>{error}</p>

                <button onClick={fetchHistory}>
                  Try Again
                </button>
              </div>
            ) : attempts.length === 0 ? (
              <div className="history-empty">
                <ClipboardList size={42} />

                <h3>No examination history yet</h3>

                <p>
                  Complete your first examination to see
                  your results here.
                </p>

                <button
                  onClick={() => navigate("/student")}
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>EXAMINATION</th>
                        <th>DATE</th>
                        <th>SCORE</th>
                        <th>PERFORMANCE</th>
                        <th>SUBMISSION</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attempts.map((attempt, index) => {
                        const percentage = Number(
                          attempt.percentage ?? 0
                        );

                        return (
                          <tr key={attempt.attemptId || index}>

                            <td>
                              <div className="history-exam-name">
                                <div className="history-exam-icon">
                                  <ClipboardList size={18} />
                                </div>

                                <div>
                                  <strong>Online Assessment</strong>
                                  <span>
                                    Attempt #{index + 1}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="history-date">
                                <CalendarDays size={15} />

                                {formatDate(
                                  attempt.submittedAt ||
                                  attempt.createdAt
                                )}
                              </div>
                            </td>

                            <td>
                              <strong className="history-score">
                                {attempt.score}/
                                {attempt.totalQuestions}
                              </strong>
                            </td>

                            <td>
                              <div className="history-performance">
                                <strong>{percentage}%</strong>

                                <div className="history-progress">
                                  <div
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(0, percentage)
                                      )}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td>
                              <span
                                className={`history-submission ${
                                  attempt.submissionType === "auto"
                                    ? "submission-auto"
                                    : "submission-manual"
                                }`}
                              >
                                {attempt.submissionType === "auto"
                                  ? "Auto submitted"
                                  : "Manual"}
                              </span>
                            </td>

                            <td>
                              <button
                                className="history-view-button"
                                onClick={() =>
                                  navigate(
                                    `/student/results/${attempt.attemptId}`
                                  )
                                }
                              >
                                View <ArrowRight size={15} />
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="history-mobile-list">
                  {attempts.map((attempt, index) => (
                    <article
                      className="history-mobile-card"
                      key={attempt.attemptId || index}
                    >
                      <div className="history-mobile-top">
                        <div className="history-exam-icon">
                          <ClipboardList size={18} />
                        </div>

                        <div>
                          <strong>Online Assessment</strong>
                          <span>
                            {formatDate(
                              attempt.submittedAt ||
                              attempt.createdAt
                            )}
                          </span>
                        </div>

                        <strong className="history-mobile-score">
                          {attempt.score}/{attempt.totalQuestions}
                        </strong>
                      </div>

                      <div className="history-mobile-details">
                        <span>
                          {attempt.percentage ?? 0}% score
                        </span>

                        <span>
                          {attempt.submissionType === "auto"
                            ? "Auto submitted"
                            : "Manual"}
                        </span>
                      </div>

                      <button
                        className="history-mobile-view"
                        onClick={() =>
                          navigate(
                            `/student/results/${attempt.attemptId}`
                          )
                        }
                      >
                        View Detailed Result
                        <ArrowRight size={15} />
                      </button>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="history-pagination">
                    <span>
                      Page {page} of {totalPages}
                    </span>

                    <div>
                      <button
                        disabled={page === 1}
                        onClick={() =>
                          setPage((current) => current - 1)
                        }
                      >
                        Previous
                      </button>

                      <button
                        disabled={page >= totalPages}
                        onClick={() =>
                          setPage((current) => current + 1)
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </section>

          <footer className="student-dashboard-footer">
            © {new Date().getFullYear()} Testify.
            Keep improving every day.
          </footer>

        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
