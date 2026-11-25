
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Authentication
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import QuestionManagement from "./pages/admin/QuestionManagement";

// Student pages
import StudentDashboard from "./pages/StudentDashboard";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Admin protected routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/questions"
              element={<QuestionManagement />}
            />
          </Route>

          {/* Student protected routes */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route
              path="/student"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/exam/:attemptId"
              element={<ExamPage />}
            />

            <Route
              path="/student/results/:attemptId"
              element={<ResultPage />}
            />

            <Route
              path="/student/history"
              element={<HistoryPage />}
            />
          </Route>

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
