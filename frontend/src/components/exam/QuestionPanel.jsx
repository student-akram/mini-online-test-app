
import { CheckCircle2 } from "lucide-react";
import "./QuestionPanel.css";

const QuestionPanel = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  disabled
}) => {
  if (!question) return null;

  return (
    <section className="question-panel">
      <div className="question-panel-top">
        <span className="question-number">
          QUESTION {questionNumber} OF {totalQuestions}
        </span>

        {selectedAnswer && (
          <span className="answer-saved-label">
            <CheckCircle2 size={15} /> Answer selected
          </span>
        )}
      </div>

      <div className="question-progress-track">
        <div
          className="question-progress-fill"
          style={{
            width: `${(questionNumber / totalQuestions) * 100}%`
          }}
        />
      </div>

      <h2 className="question-text">
        {question.questionText}
      </h2>

      <p className="question-instruction">
        Select one correct answer from the options below.
      </p>

      <div className="question-options">
        {question.options.map((option, index) => {
          const selected = selectedAnswer === option;

          return (
            <button
              type="button"
              key={index}
              disabled={disabled}
              className={`question-option ${selected ? "option-selected" : ""}`}
              onClick={() => onAnswer(question.questionId, option)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="option-text">{option}</span>

              <span className="option-radio">
                {selected && <span />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="question-panel-footer">
        <span><CheckCircle2 size={15} /> One option can be selected</span>
      </div>
    </section>
  );
};

export default QuestionPanel;
