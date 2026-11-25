
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Layers,
  AlertCircle,
  ArrowRight,
  Plus,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminStatCard from "../components/admin/AdminStatCard";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
const fetchQuestions = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const limit = 100;

    // Fetch the first page
    const firstResponse = await API.get("/admin/questions", {
      params: {
        page: 1,
        limit,
      },
    });

    const firstData = firstResponse.data;
    const firstPageQuestions = firstData.questions || [];
    const totalPages = firstData.totalPages || 1;

    // Fetch remaining pages if they exist
    let remainingQuestions = [];

    if (totalPages > 1) {
      const pageRequests = Array.from(
        { length: totalPages - 1 },
        (_, index) =>
          API.get("/admin/questions", {
            params: {
              page: index + 2,
              limit,
            },
          })
      );

      const responses = await Promise.all(pageRequests);

      remainingQuestions = responses.flatMap(
        (response) => response.data.questions || []
      );
    }

    // Combine every page
    const allQuestions = [
      ...firstPageQuestions,
      ...remainingQuestions,
    ];

    setQuestions(allQuestions);

    setTotalQuestions(
      firstData.totalQuestions ?? allQuestions.length
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to load dashboard statistics."
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const activeQuestions = questions.filter(
    (question) => question.isActive
  ).length;

  const inactiveQuestions = questions.filter(
    (question) => !question.isActive
  ).length;

  const subjects = new Set(
    questions.map((question) => question.subject)
  ).size;

  const difficultyCounts = {
    easy: questions.filter((q) => q.difficulty === "easy").length,
    medium: questions.filter((q) => q.difficulty === "medium").length,
    hard: questions.filter((q) => q.difficulty === "hard").length
  };

  const recentQuestions = [...questions]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "Recently added";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="admin-dashboard-main">
        <AdminNavbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="admin-dashboard-content">

          <section className="admin-welcome">
            <div>
              <span>ADMINISTRATION</span>
              <h1>Dashboard Overview</h1>
              <p>
                Manage your examination platform and question bank.
              </p>
            </div>

            <div className="admin-welcome-actions">
              <button
                className="admin-refresh-button"
                onClick={fetchQuestions}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "admin-refreshing" : ""}
                />
                Refresh
              </button>

              <button
                className="admin-add-button"
                onClick={() => navigate("/admin/questions")}
              >
                <Plus size={17} />
                Manage Questions
              </button>
            </div>
          </section>

          {error && (
            <div className="admin-dashboard-error">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={fetchQuestions}>Retry</button>
            </div>
          )}

          <section className="admin-stats-grid">
            <AdminStatCard
              title="Total Questions"
              value={loading ? "—" : totalQuestions}
              subtitle="Questions in the question bank"
              icon={BookOpen}
              color="blue"
            />

            <AdminStatCard
              title="Active Questions"
              value={loading ? "—" : activeQuestions}
              subtitle="Available for examinations"
              icon={CheckCircle2}
              color="green"
            />

            <AdminStatCard
              title="Inactive Questions"
              value={loading ? "—" : inactiveQuestions}
              subtitle="Currently unavailable"
              icon={AlertCircle}
              color="orange"
            />

            <AdminStatCard
              title="Subjects"
              value={loading ? "—" : subjects}
              subtitle="Subjects represented in loaded questions"
              icon={Layers}
              color="purple"
            />
          </section>

          <section className="admin-dashboard-grid">

            <div className="admin-dashboard-card">
              <div className="admin-card-heading">
                <div>
                  <h2>Recent Questions</h2>
                  <p>Recently added questions</p>
                </div>

                <button
                  onClick={() => navigate("/admin/questions")}
                >
                  View all <ArrowRight size={15} />
                </button>
              </div>

              {loading ? (
                <div className="admin-empty-message">
                  Loading questions...
                </div>
              ) : recentQuestions.length === 0 ? (
                <div className="admin-empty-message">
                  No questions found. Add your first question.
                </div>
              ) : (
                <div className="admin-recent-list">
                  {recentQuestions.map((question) => (
                    <div
                      className="admin-recent-question"
                      key={question._id}
                    >
                      <div className="admin-question-symbol">
                        <BookOpen size={18} />
                      </div>

                      <div className="admin-recent-question-info">
                        <strong>{question.question}</strong>
                        <span>
                          {question.subject} · {formatDate(question.createdAt)}
                        </span>
                      </div>

                      <span
                        className={`admin-question-status ${
                          question.isActive
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {question.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-dashboard-card admin-difficulty-card">
              <div className="admin-card-heading">
                <div>
                  <h2>Question Difficulty</h2>
                  <p>Distribution of loaded questions</p>
                </div>
              </div>

              {loading ? (
                <div className="admin-empty-message">
                  Loading...
                </div>
              ) : (
                <div className="admin-difficulty-list">
                  {[
                    { name: "Easy", key: "easy", color: "difficulty-easy" },
                    { name: "Medium", key: "medium", color: "difficulty-medium" },
                    { name: "Hard", key: "hard", color: "difficulty-hard" }
                  ].map((item) => {
                    const count = difficultyCounts[item.key];

                    const percentage = questions.length
                      ? (count / questions.length) * 100
                      : 0;

                    return (
                      <div className="difficulty-item" key={item.key}>
                        <div className="difficulty-label">
                          <span>{item.name}</span>
                          <strong>{count}</strong>
                        </div>

                        <div className="difficulty-track">
                          <div
                            className={item.color}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="admin-manage-link"
                onClick={() => navigate("/admin/questions")}
              >
                Manage Question Bank
                <ArrowRight size={16} />
              </button>
            </div>

          </section>

          <footer className="admin-dashboard-footer">
            © {new Date().getFullYear()} Testify Admin Portal.
            Manage your examinations efficiently.
          </footer>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
