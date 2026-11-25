
import { useCallback, useEffect, useState } from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Filter,
  Power,
} from "lucide-react";

import API from "../../api/axios";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import QuestionForm from "./QuestionForm";

import "./QuestionManagement.css";

const QuestionManagement = () => {
  // Questions and loading states
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sidebar and modal
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Search and filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Selected subject is a string
  const [subject, setSubject] = useState("");

  // Available subjects are stored in an array
  const [subjects, setSubjects] = useState([]);

  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const limit = 10;

  // ==========================================
  // FETCH ALL AVAILABLE SUBJECTS
  // ==========================================

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await API.get("/admin/questions", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      const allQuestions = Array.isArray(response.data.questions)
        ? response.data.questions
        : [];

      const uniqueSubjects = [
        ...new Map(
          allQuestions
            .map((question) => question.subject?.trim())
            .filter(Boolean)
            .map((name) => [name.toLowerCase(), name])
        ).values(),
      ].sort((a, b) => a.localeCompare(b));

      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error("Unable to load subjects:", err);
    }
  }, []);

  // ==========================================
  // FETCH QUESTIONS
  // ==========================================

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/questions", {
        params: {
          page,
          limit,
          search: search || undefined,
          subject: subject || undefined,
          difficulty: difficulty || undefined,
          status: status || undefined,
        },
      });

      const data = response.data;

      const questionList = Array.isArray(data.questions)
        ? data.questions
        : [];

      setQuestions(questionList);

      setTotalQuestions(
        data.totalQuestions ?? questionList.length
      );

      setTotalPages(
        Math.max(1, data.totalPages ?? 1)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, subject, difficulty, status]);

  // Load subjects when page opens
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Load questions whenever filters or page change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setSubject("");
    setDifficulty("");
    setStatus("");
    setPage(1);
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  // ==========================================
  // AFTER ADD OR EDIT SUCCESS
  // ==========================================

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingQuestion(null);

    await Promise.all([
      fetchQuestions(),
      fetchSubjects(),
    ]);
  };

  // ==========================================
  // DELETE QUESTION
  // ==========================================

  const handleDelete = async (question) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this question?\n\n"${question.question}"`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/admin/questions/${question._id}`);

      // If last question on current page, go back one page
      if (questions.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await Promise.all([
          fetchQuestions(),
          fetchSubjects(),
        ]);
      }
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Unable to delete this question."
      );
    }
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE QUESTION
  // ==========================================

  const handleStatusToggle = async (question) => {
    try {
      await API.patch(
        `/admin/questions/${question._id}/status`,
        {
          isActive: !question.isActive,
        }
      );

      await fetchQuestions();
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Unable to update question status."
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="question-management-page">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="question-management-main">

        {/* Navbar */}
        <AdminNavbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="question-management-content">

          {/* PAGE HEADER */}
          <div className="question-page-heading">

            <div>
              <span className="question-page-eyebrow">
                ADMINISTRATION
              </span>

              <h1>Question Bank</h1>

              <p>
                Manage, organize and maintain your examination questions.
              </p>
            </div>

            <button
              className="question-add-button"
              onClick={openAddForm}
            >
              <Plus size={18} />
              Add Question
            </button>

          </div>

          {/* SUMMARY CARDS */}
          <div className="question-summary-row">

            <div className="question-summary-card">

              <div className="question-summary-icon">
                <BookOpen size={21} />
              </div>

              <div>
                <span>Total Questions</span>
                <strong>{totalQuestions}</strong>
              </div>

            </div>

            <div className="question-summary-card">

              <div className="question-summary-icon question-summary-purple">
                <Filter size={21} />
              </div>

              <div>
                <span>Current Page</span>
                <strong>
                  {page} / {totalPages}
                </strong>
              </div>

            </div>

          </div>

          {/* QUESTION TABLE CARD */}
          <section className="question-table-card">

            {/* TABLE HEADER */}
            <div className="question-table-heading">

              <div>
                <h2>All Questions</h2>
                <p>Search and manage your question bank.</p>
              </div>

              <button
                className="question-refresh-button"
                onClick={() => {
                  fetchQuestions();
                  fetchSubjects();
                }}
                disabled={loading}
                title="Refresh questions"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "question-spinning" : ""}
                />

                Refresh
              </button>

            </div>

            {/* FILTER BAR */}
            <div className="question-filter-bar">

              {/* SEARCH */}
              <form
                className="question-search-form"
                onSubmit={handleSearch}
              >
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search question..."
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                />

                <button type="submit">
                  Search
                </button>
              </form>

              {/* SUBJECT FILTER */}
              <select
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by subject"
              >
                <option value="">
                  All Subjects
                </option>

                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* DIFFICULTY FILTER */}
              <select
                value={difficulty}
                onChange={(event) => {
                  setDifficulty(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by difficulty"
              >
                <option value="">
                  All Difficulties
                </option>

                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* STATUS FILTER */}
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
              >
                <option value="">
                  All Statuses
                </option>

                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* CLEAR FILTERS */}
              <button
                className="question-clear-filters"
                onClick={resetFilters}
                type="button"
              >
                Clear
              </button>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="question-page-error">

                <AlertCircle size={18} />

                <span>{error}</span>

                <button onClick={fetchQuestions}>
                  Retry
                </button>

              </div>
            )}

            {/* QUESTION TABLE */}
            <div className="question-table-wrapper">

              <table className="question-table">

                <thead>
                  <tr>
                    <th>QUESTION</th>
                    <th>SUBJECT</th>
                    <th>DIFFICULTY</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td
                        colSpan="6"
                        className="question-table-message"
                      >
                        Loading questions...
                      </td>
                    </tr>

                  ) : questions.length === 0 ? (

                    <tr>
                      <td
                        colSpan="6"
                        className="question-table-message"
                      >
                        No questions found. Try changing your filters or add a
                        new question.
                      </td>
                    </tr>

                  ) : (

                    questions.map((question) => (

                      <tr key={question._id}>

                        {/* QUESTION */}
                        <td className="question-table-text">

                          <strong>
                            {question.question}
                          </strong>

                          <span>
                            {question.options?.length || 0} answer options
                          </span>

                        </td>

                        {/* SUBJECT */}
                        <td>
                          {question.subject}
                        </td>

                        {/* DIFFICULTY */}
                        <td>

                          <span
                            className={`question-difficulty difficulty-${question.difficulty}`}
                          >
                            {question.difficulty}
                          </span>

                        </td>

                        {/* STATUS */}
                        <td>

                          <span
                            className={`question-status ${
                              question.isActive
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {question.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* CREATED DATE */}
                        <td>
                          {formatDate(question.createdAt)}
                        </td>

                        {/* ACTIONS */}
                        <td>

                          <div className="question-row-actions">

                            <button
                              className="question-action-edit"
                              onClick={() =>
                                openEditForm(question)
                              }
                              title="Edit question"
                              aria-label="Edit question"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              className="question-action-toggle"
                              onClick={() =>
                                handleStatusToggle(question)
                              }
                              title={
                                question.isActive
                                  ? "Deactivate question"
                                  : "Activate question"
                              }
                              aria-label="Toggle question status"
                            >
                              <Power size={16} />
                            </button>

                            <button
                              className="question-action-delete"
                              onClick={() =>
                                handleDelete(question)
                              }
                              title="Delete question"
                              aria-label="Delete question"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}
            <div className="question-pagination">

              <span>
                Showing {questions.length} of {totalQuestions} questions
              </span>

              <div className="question-pagination-controls">

                <button
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={page <= 1 || loading}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((previous) =>
                      Math.min(totalPages, previous + 1)
                    )
                  }
                  disabled={page >= totalPages || loading}
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>

          </section>

          {/* FOOTER */}
          <footer className="question-management-footer">
            © {new Date().getFullYear()} Testify Admin Portal.
          </footer>

        </main>

      </div>

      {/* QUESTION FORM MODAL */}
      {showForm && (
        <QuestionForm
          editingQuestion={editingQuestion}
          onClose={() => {
            setShowForm(false);
            setEditingQuestion(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

    </div>
  );
};

export default QuestionManagement;
