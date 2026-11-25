
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  LoaderCircle
} from "lucide-react";

import API from "../api/axios";
import "./ResultPage.css";

const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchResult = async () => {
      try {
        const response = await API.get(
          `/submissions/${attemptId}/result`
        );

        if (!cancelled) {
          setResult(response.data.result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to retrieve your result."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResult();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="result-loading">
        <LoaderCircle size={34} />
        <p>Calculating your result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="result-error">
        <h2>Result unavailable</h2>
        <p>{error || "No result found."}</p>
        <button onClick={() => navigate("/student")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const percentage = result.totalQuestions
    ? Math.round((result.score / result.totalQuestions) * 100)
    : 0;

  return (
    <main className="result-page">
      <div className="result-container">
        <button
          className="result-back-button"
          onClick={() => navigate("/student")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <section className="result-summary-card">
          <div className="result-trophy-icon">
            <Trophy size={35} />
          </div>

          <span className="result-eyebrow">EXAMINATION COMPLETED</span>

          <h1>Your result is ready!</h1>

          <p>Here is your performance summary.</p>

          <div className="result-score">
            <strong>{result.score}</strong>
            <span>/ {result.totalQuestions}</span>
          </div>

          <div className="result-percentage">
            {percentage}% Overall Score
          </div>

          <div className="result-progress-track">
            <div
              className="result-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="result-submission-type">
            Submitted {result.submissionType === "auto"
              ? "automatically"
              : "manually"}
          </span>
        </section>

        <section className="result-stat-grid">
          <div className="result-stat result-correct">
            <CheckCircle2 size={22} />
            <span>Correct</span>
            <strong>{result.correctCount}</strong>
          </div>

          <div className="result-stat result-incorrect">
            <XCircle size={22} />
            <span>Incorrect</span>
            <strong>{result.incorrectCount}</strong>
          </div>

          <div className="result-stat result-unanswered">
            <MinusCircle size={22} />
            <span>Unanswered</span>
            <strong>{result.unansweredCount}</strong>
          </div>
        </section>

        <section className="result-review-card">
          <div className="result-review-heading">
            <h2>Answer Review</h2>
            <span>{result.totalQuestions} Questions</span>
          </div>

          {result.questions.map((question, index) => {
            const isCorrect = question.isCorrect;
            const isUnanswered = !question.selectedAnswer;

            return (
              <article
                className="result-question"
                key={question.questionId}
              >
                <div className="result-question-heading">
                  <span>QUESTION {index + 1}</span>

                  <strong className={
                    isUnanswered
                      ? "review-unanswered"
                      : isCorrect
                        ? "review-correct"
                        : "review-incorrect"
                  }>
                    {isUnanswered
                      ? "Unanswered"
                      : isCorrect
                        ? "Correct"
                        : "Incorrect"}
                  </strong>
                </div>

                <h3>{question.questionText}</h3>

                <div className="result-answer-details">
                  <p>
                    Your answer:{" "}
                    <strong>{question.selectedAnswer || "Not answered"}</strong>
                  </p>

                  <p>
                    Correct answer:{" "}
                    <strong>{question.correctAnswer}</strong>
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <button
          className="result-dashboard-button"
          onClick={() => navigate("/student")}
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
};

export default ResultPage;
