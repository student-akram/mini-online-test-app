
import { AlertTriangle, X } from "lucide-react";
import "./SubmitModal.css";

const SubmitModal = ({
  open,
  answeredCount,
  totalQuestions,
  submitting,
  onCancel,
  onConfirm
}) => {
  if (!open) return null;

  const unanswered = totalQuestions - answeredCount;

  return (
    <div className="submit-modal-overlay">
      <section className="submit-modal">
        <button
          className="submit-modal-close"
          onClick={onCancel}
          disabled={submitting}
        >
          <X size={19} />
        </button>

        <div className="submit-modal-icon">
          <AlertTriangle size={27} />
        </div>

        <h2>Submit your examination?</h2>

        <p>
          Are you sure you want to submit your answers?
          You cannot make changes after submission.
        </p>

        <div className="submit-modal-summary">
          <div>
            <span>Answered</span>
            <strong>{answeredCount}</strong>
          </div>

          <div>
            <span>Unanswered</span>
            <strong>{unanswered}</strong>
          </div>
        </div>

        {unanswered > 0 && (
          <p className="submit-modal-warning">
            You still have {unanswered} unanswered questions.
          </p>
        )}

        <div className="submit-modal-actions">
          <button
            className="submit-cancel-button"
            onClick={onCancel}
            disabled={submitting}
          >
            Continue Exam
          </button>

          <button
            className="submit-confirm-button"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SubmitModal;
