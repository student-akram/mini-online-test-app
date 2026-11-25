
import { Clock3, BookOpen, AlertCircle } from "lucide-react";
import "./ExamHeader.css";

const ExamHeader = ({ timeLeft, answeredCount, totalQuestions }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft <= 60;

  return (
    <header className="exam-header">
      <div className="exam-header-brand">
        <div className="exam-header-icon">
          <BookOpen size={21} />
        </div>
        <div>
          <h2>Testify</h2>
          <span>ONLINE ASSESSMENT</span>
        </div>
      </div>

      <div className="exam-header-progress">
        <span>Questions answered</span>
        <strong>{answeredCount}/{totalQuestions}</strong>
      </div>

      <div className={`exam-timer ${isUrgent ? "timer-urgent" : ""}`}>
        {isUrgent ? <AlertCircle size={20} /> : <Clock3 size={20} />}
        <div>
          <span>TIME REMAINING</span>
          <strong>
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </strong>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
