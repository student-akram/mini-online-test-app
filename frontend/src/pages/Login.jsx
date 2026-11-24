
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BookOpen, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/student"}
        replace
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login(email, password);

      navigate(
        loggedInUser.role === "admin" ? "/admin" : "/student",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to sign in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="brand-logo">
            <BookOpen size={28} />
          </div>

          <span className="brand-eyebrow">
            ONLINE ASSESSMENT PLATFORM
          </span>

          <h1>
            Test your knowledge.
            <br />
            Track your progress.
          </h1>

          <p>
            A simple and focused platform to take assessments,
            evaluate your skills, and monitor your performance.
          </p>

          <div className="brand-footer">
            Learn. Practice. Improve.
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mobile-brand-logo">
            <BookOpen size={25} />
          </div>

          <span className="form-eyebrow">WELCOME BACK</span>

          <h2>Sign in to your account</h2>

          <p className="form-description">
            Enter your credentials to access your dashboard.
          </p>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <label htmlFor="email">Email address</label>

          <div className="login-input-wrapper">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="login-input-wrapper">
            <LockKeyhole size={18} />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="login-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="login-security-note">
            Secure access for students and administrators.
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
