
import { CheckCircle2, Circle, CircleHelp } from "lucide-react";
import "./QuestionPalette.css";

const QuestionPalette = ({
  questions,
  answers,
  currentIndex,
  onSelect
}) => {
  const answeredCount = Object.keys(answers).length;

  return (
    <aside className="question-palette">
      <h3>Question Overview</h3>
      <p>Navigate between questions</p>

      <div className="palette-grid">
        {questions.map((question, index) => {
          const answered = Boolean(answers[question.questionId]);
          const current = currentIndex === index;

          return (
            <button
              key={question.questionId}
              className={[
                "palette-number",
                answered ? "palette-answered" : "",
                current ? "palette-current" : ""
              ].join(" ")}
              onClick={() => onSelect(index)}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="palette-legend">
        <span><CheckCircle2 size={15} /> Answered</span>
        <span><Circle size={15} /> Not answered</span>
        <span><CircleHelp size={15} /> Current</span>
      </div>

      <div className="palette-summary">
        <div>
          <span>Answered</span>
          <strong>{answeredCount}</strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong>{questions.length - answeredCount}</strong>
        </div>
      </div>
    </aside>
  );
};

export default QuestionPalette;
