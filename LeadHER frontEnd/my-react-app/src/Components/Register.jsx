import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Pages.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://localhost:7033/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, isAdmin: false })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Registration successful - redirect to login
      navigate("/login", { 
        replace: true,
        state: { message: "Registration successful! Please log in." }
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join our blogging community</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="form-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Create a password (min. 8 characters)"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <button onClick={() => navigate("/login")} className="link-button">Login here</button></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;