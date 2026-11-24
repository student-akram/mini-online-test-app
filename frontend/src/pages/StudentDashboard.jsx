
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Target,
  Trophy,
  CheckCircle2
} from "lucide-react";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/student/Sidebar";
import TopNavbar from "../components/student/TopNavbar";
import StatCard from "../components/student/StatCard";
import AvailableTest from "../components/student/AvailableTest";
import RecentAttempts from "../components/student/RecentAttempts";

import "./StudentDashboard.css";

const StudentDashboard = () => {
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/history?page=1&limit=5");

        setAttempts(response.data.history || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load your exam history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalAttempts = attempts.length;
  const averageScore = totalAttempts
    ? (
        attempts.reduce(
          (sum, attempt) => sum + (attempt.percentage || 0),
          0
        ) / totalAttempts
      ).toFixed(1)
    : 0;

  const bestScore = totalAttempts
    ? Math.max(...attempts.map((attempt) => attempt.score || 0))
    : 0;

  const totalCorrect = attempts.reduce(
    (sum, attempt) => sum + (attempt.correctCount || 0),
    0
  );

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

        <main className="student-dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <span>YOUR LEARNING SPACE</span>
              <h1>
                Good to see you, {user?.name?.split(" ")[0] || "Student"}!
              </h1>
              <p>
                Keep learning, keep practicing, and track your progress.
              </p>
            </div>

            <div className="welcome-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </div>
          </section>

          <section className="student-stats-grid">
            <StatCard
              title="Exam Attempts"
              value={totalAttempts}
              subtitle="Latest 5 completed attempts"
              icon={ClipboardList}
              color="blue"
            />

            <StatCard
              title="Average Score"
              value={`${averageScore}%`}
              subtitle="Based on displayed attempts"
              icon={Target}
              color="green"
            />

            <StatCard
              title="Best Score"
              value={bestScore}
              subtitle="Highest marks out of 10"
              icon={Trophy}
              color="purple"
            />

            <StatCard
              title="Correct Answers"
              value={totalCorrect}
              subtitle="Across displayed attempts"
              icon={CheckCircle2}
              color="orange"
            />
          </section>

          <AvailableTest />

          <RecentAttempts
            attempts={attempts}
            loading={loading}
            error={error}
          />

          <footer className="student-dashboard-footer">
            © {new Date().getFullYear()} Testify. Keep improving every day.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
