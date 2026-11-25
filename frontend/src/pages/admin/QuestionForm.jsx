
import { useEffect, useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import API from "../../api/axios";
import "./QuestionForm.css";

const emptyForm = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  subject: "",
  difficulty: "easy",
};

const QuestionForm = ({ editingQuestion, onClose, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      setForm({
        question: editingQuestion.question || "",
        options: editingQuestion.options?.length === 4
          ? [...editingQuestion.options]
          : ["", "", "", ""],
        correctAnswer: editingQuestion.correctAnswer || "",
        subject: editingQuestion.subject || "",
        difficulty: editingQuestion.difficulty || "easy",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingQuestion]);

  const updateOption = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;

    setForm((previous) => ({
      ...previous,
      options: updatedOptions,
      correctAnswer: updatedOptions.includes(previous.correctAnswer)
        ? previous.correctAnswer
        : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const question = form.question.trim();
    const subject = form.subject.trim();
    const options = form.options.map((option) => option.trim());

    if (!question || !subject) {
      setError("Please enter the question and subject.");
      return;
    }

    if (options.some((option) => !option)) {
      setError("Please fill in all four options.");
      return;
    }

    if (new Set(options.map((option) => option.toLowerCase())).size !== 4) {
      setError("All four options must be different.");
      return;
    }

    if (!form.correctAnswer || !options.includes(form.correctAnswer.trim())) {
      setError("Please select a valid correct answer.");
      return;
    }

    const payload = {
      question,
      subject,
      options,
      correctAnswer: form.correctAnswer.trim(),
      difficulty: form.difficulty,
    };

    try {
      setLoading(true);

      if (editingQuestion?._id) {
        await API.put(
          `/admin/questions/${editingQuestion._id}`,
          payload
        );
      } else {
        await API.post("/admin/questions", payload);
      }

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save the question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-modal-overlay" onMouseDown={onClose}>
      <div
        className="question-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="question-modal-header">
          <div>
            <h2>{editingQuestion ? "Edit Question" : "Add New Question"}</h2>
            <p>
              {editingQuestion
                ? "Update the question details below."
                : "Enter the question and its four answer options."}
            </p>
          </div>

          <button
            type="button"
            className="question-modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="question-form">
          <div className="question-form-group">
            <label htmlFor="question-text">Question</label>
            <textarea
              id="question-text"
              rows="3"
              placeholder="Enter your question..."
              value={form.question}
              onChange={(event) =>
                setForm({ ...form, question: event.target.value })
              }
              required
            />
          </div>

          <div className="question-options-heading">
            <label>Answer Options</label>
            <span>Enter exactly four different options</span>
          </div>

          <div className="question-options-grid">
            {form.options.map((option, index) => (
              <div className="question-form-group" key={index}>
                <label htmlFor={`option-${index}`}>
                  Option {index + 1}
                </label>
                <div className="question-option-input">
                  <span>{String.fromCharCode(65 + index)}</span>
                  <input
                    id={`option-${index}`}
                    type="text"
                    placeholder={`Enter option ${index + 1}`}
                    value={option}
                    onChange={(event) =>
                      updateOption(index, event.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="question-form-row">
            <div className="question-form-group">
              <label htmlFor="correct-answer">Correct Answer</label>
              <select
                id="correct-answer"
                value={form.correctAnswer}
                onChange={(event) =>
                  setForm({ ...form, correctAnswer: event.target.value })
                }
                required
              >
                <option value="">Select correct answer</option>
                {form.options.map((option, index) => (
                  <option
                    key={index}
                    value={option.trim()}
                    disabled={!option.trim()}
                  >
                    {String.fromCharCode(65 + index)} - {option.trim() || "Empty option"}
                  </option>
                ))}
              </select>
            </div>

            <div className="question-form-group">
              <label htmlFor="question-subject">Subject</label>
              <input
                id="question-subject"
                type="text"
                placeholder="e.g. JavaScript"
                value={form.subject}
                onChange={(event) =>
                  setForm({ ...form, subject: event.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="question-form-group">
            <label htmlFor="question-difficulty">Difficulty</label>
            <select
              id="question-difficulty"
              value={form.difficulty}
              onChange={(event) =>
                setForm({ ...form, difficulty: event.target.value })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {error && <div className="question-form-error">{error}</div>}

          <div className="question-form-actions">
            <button
              type="button"
              className="question-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="question-save-button"
              disabled={loading}
            >
              <Save size={17} />
              {loading
                ? "Saving..."
                : editingQuestion
                  ? "Update Question"
                  : "Save Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
