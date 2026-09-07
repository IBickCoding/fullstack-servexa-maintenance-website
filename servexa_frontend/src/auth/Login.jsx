import React, { useState } from "react";
import { authAPI } from "../api.js";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const token = response.data;
      if (!token || token.split(".").length !== 3) throw new Error("Invalid token format");
      AuthService.login(token);
      setMessage({ type: "success", text: "Welcome back. Redirecting…" });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "error", text: "Sign-in failed. Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sx-auth" data-testid="login-page">
      <div className="sx-auth-side reveal d-1">
        <div>
          <div className="meta">Servexa · Maintenance OS</div>
          <h1 style={{ marginTop: 24 }}>Sign in.<br /><em>Run the building.</em></h1>
          <p style={{ color: "var(--text-2)", marginTop: 22, maxWidth: 420 }}>
            One workspace for tenants, vendors and admins. Submit, dispatch, resolve — without the friction.
          </p>
        </div>
        <div className="sx-auth-tag">
          <div><span>→</span>&nbsp; Real-time request tracking</div>
          <div><span>→</span>&nbsp; Vendor orchestration</div>
          <div><span>→</span>&nbsp; Role-aware dashboards</div>
        </div>
      </div>

      <div className="sx-auth-card reveal d-2">
        <h2>Welcome back</h2>
        <p className="sub">— Use your work credentials</p>

        <form className="sx-form" onSubmit={handleLogin} data-testid="login-form">
          <div className="sx-field">
            <label className="sx-label">Email address</label>
            <input className="sx-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@servexa.com" data-testid="email-input" />
          </div>
          <div className="sx-field">
            <label className="sx-label">Password</label>
            <input className="sx-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" data-testid="password-input" />
          </div>

          {message.text && <div className={`sx-alert ${message.type === "success" ? "success" : "error"}`}>{message.text}</div>}

          <button type="submit" disabled={loading} className="sx-btn sx-btn-primary sx-btn-lg" data-testid="login-submit-btn" style={{ marginTop: 8, justifyContent: "center" }}>
            {loading ? "Signing in…" : (<>Sign in <Icon name="arrow-right" size={16} /></>)}
          </button>
        </form>
      </div>
    </div>
  );
}
