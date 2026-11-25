
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

import API from "../api/axios";

import ExamHeader from "../components/exam/ExamHeader";
import QuestionPanel from "../components/exam/QuestionPanel";
import QuestionPalette from "../components/exam/QuestionPalette";
import SubmitModal from "../components/exam/SubmitModal";

import "./ExamPage.css";

const ExamPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [error, setError] = useState("");

  const submissionStarted = useRef(false);
  const answersRef = useRef({});

  const questions = attempt?.questions || [];
  const currentQuestion = questions[currentIndex];

  const answeredCount = Object.keys(answers).length;

  // Load the existing active exam
  useEffect(() => {
    let cancelled = false;

    const loadExam = async () => {
      try {
        const response = await API.get("/exam/current");

        if (cancelled) return;

        if (response.data.expired) {
          navigate(`/student/results/${attemptId}`, {
            replace: true
          });
          return;
        }

        const activeAttempt = response.data.attempt;

        if (activeAttempt.attemptId !== attemptId) {
          navigate("/student", { replace: true });
          return;
        }

        const restoredAnswers = {};

        activeAttempt.questions.forEach((question) => {
          if (question.selectedAnswer) {
            restoredAnswers[question.questionId] =
              question.selectedAnswer;
          }
        });

        answersRef.current = restoredAnswers;
        setAnswers(restoredAnswers);
        setAttempt(activeAttempt);

        const remaining = Math.max(
          0,
          Math.ceil(
            (new Date(activeAttempt.expiresAt).getTime() - Date.now()) /
              1000
          )
        );

        setTimeLeft(remaining);

        if (remaining === 0) {
          navigate(`/student/results/${attemptId}`, {
            replace: true
          });
        }
      } catch (err) {
  if (cancelled) return;

  // The scheduler may have already submitted this attempt
  if (err.response?.status === 404) {
    try {
      await API.get(`/submissions/${attemptId}/result`);

      if (!cancelled) {
        navigate(`/student/results/${attemptId}`, {
          replace: true
        });
      }

      return;
    } catch {
      // No submitted result exists
    }
  }

  setError(
    err.response?.data?.message ||
    "Unable to load your examination."
  );
} finally {
  if (!cancelled) setLoading(false);
}
    };

    loadExam();

    return () => {
      cancelled = true;
    };
  }, [attemptId, navigate]);

  // Submit exam through the backend
  const submitExam = useCallback(async () => {
    if (submissionStarted.current) return;

    submissionStarted.current = true;
    setSubmitting(true);
    setError("");

    try {
      await API.post(`/submissions/${attemptId}/submit`);

      navigate(`/student/results/${attemptId}`, {
        replace: true
      });
    } catch (err) {
      submissionStarted.current = false;
      setError(
        err.response?.data?.message ||
        "Unable to submit exam. Please try again."
      );
      setSubmitting(false);
    }
  }, [attemptId, navigate]);

  // Countdown is calculated from the original backend expiry time
  useEffect(() => {
    if (!attempt || submissionStarted.current) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(attempt.expiresAt).getTime() - Date.now()) / 1000
        )
      );

      setTimeLeft(remaining);

      if (remaining === 0) {
        submitExam();
      }
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [attempt, submitExam]);

  // Save selected answer in MongoDB
  const handleAnswer = async (questionId, selectedAnswer) => {
    if (timeLeft <= 0 || saving || submitting) return;

    const previousAnswers = { ...answersRef.current };

    const updatedAnswers = {
      ...previousAnswers,
      [questionId]: selectedAnswer
    };

    answersRef.current = updatedAnswers;
    setAnswers(updatedAnswers);
    setSaving(true);
    setError("");

    try {
      await API.patch(`/answers/${attemptId}`, {
        questionId,
        selectedAnswer
      });
    } catch (err) {
      // Restore previous local selection if saving failed
      answersRef.current = previousAnswers;
      setAnswers(previousAnswers);

      setError(
        err.response?.data?.message ||
        "Unable to save your answer. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleManualSubmit = async () => {
    setShowSubmitModal(false);
    await submitExam();
  };

  if (loading) {
    return (
      <div className="exam-loading">
        <LoaderCircle className="exam-loading-icon" size={34} />
        <p>Loading your examination...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="exam-error-page">
        <h2>Unable to open examination</h2>
        <p>{error || "No active examination was found."}</p>
        <button onClick={() => navigate("/student")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="exam-page">
      <ExamHeader
        timeLeft={timeLeft}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />

      <main className="exam-page-content">
        <div className="exam-page-title">
          <div>
            <span>ONLINE ASSESSMENT</span>
            <h1>Examination</h1>
            <p>Read each question carefully and select your answer.</p>
          </div>

          <div className="exam-attempt-status">
            <span className="exam-live-dot" />
            Exam in progress
          </div>
        </div>

        {error && (
          <div className="exam-error-message" role="alert">
            {error}
          </div>
        )}

        <div className="exam-layout">
          <div className="exam-main-column">
            <QuestionPanel
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={
                answers[currentQuestion?.questionId] || null
              }
              onAnswer={handleAnswer}
              disabled={timeLeft <= 0 || submitting}
            />

            <div className="exam-navigation">
              <button
                className="exam-previous-button"
                disabled={currentIndex === 0}
                onClick={() =>
                  setCurrentIndex((index) => index - 1)
                }
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  className="exam-next-button"
                  onClick={() =>
                    setCurrentIndex((index) => index + 1)
                  }
                >
                  Next Question
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  className="exam-submit-button"
                  onClick={() => setShowSubmitModal(true)}
                  disabled={submitting}
                >
                  Submit Exam
                </button>
              )}
            </div>

            {saving && (
              <p className="exam-saving-status">
                Saving your answer...
              </p>
            )}
          </div>

          <div className="exam-side-column">
            <QuestionPalette
              questions={questions}
              answers={answers}
              currentIndex={currentIndex}
              onSelect={setCurrentIndex}
            />

            <button
              className="exam-final-submit-button"
              onClick={() => setShowSubmitModal(true)}
              disabled={submitting}
            >
              Submit Examination
            </button>
          </div>
        </div>
      </main>

      <SubmitModal
        open={showSubmitModal}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        submitting={submitting}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={handleManualSubmit}
      />
    </div>
  );
};

export default ExamPage;
