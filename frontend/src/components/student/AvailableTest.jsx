
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock3,
  FileQuestion,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import API from "../../api/axios";
import "./AvailableTest.css";

const AvailableTest = () => {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const handleStartExam = async () => {
    setStarting(true);
    setError("");

    try {
      const response = await API.post("/exam/start");

      const attemptId = response.data.attempt?.attemptId;

      if (!attemptId) {
        throw new Error("Exam attempt ID was not returned");
      }

      navigate(`/student/exam/${attemptId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to start the exam."
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <section className="available-test-card">
      <div className="available-test-content">
        <span className="available-test-label">
          AVAILABLE ASSESSMENT
        </span>

        <h2>Ready to test your knowledge?</h2>

        <p>
          Challenge yourself with our online assessment.
          Complete all questions within the given time.
        </p>

        <div className="test-information">
          <span><FileQuestion size={16} /> 10 Questions</span>
          <span><Clock3 size={16} /> 10 Minutes</span>
          <span><ShieldCheck size={16} /> Instant Results</span>
        </div>

        {error && (
          <div className="available-test-error" role="alert">
            {error}
          </div>
        )}

        <button
          className="start-test-button"
          onClick={handleStartExam}
          disabled={starting}
        >
          {starting ? "Starting exam..." : "Start Test"}
          {!starting && <ArrowRight size={18} />}
        </button>
      </div>

      <div className="available-test-decoration">
        <div className="test-decoration-circle">
          <FileQuestion size={65} strokeWidth={1.3} />
        </div>
        <span className="decoration-dot dot-one" />
        <span className="decoration-dot dot-two" />
      </div>
    </section>
  );
};

export default AvailableTest;
