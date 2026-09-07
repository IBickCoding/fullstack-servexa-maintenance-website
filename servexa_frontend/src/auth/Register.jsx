import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import Icon from "../Icon";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const currentUserRole = AuthService.getUserRole();
  const navigate = useNavigate();

  useEffect(() => { if (role !== "TENANT") setTenantId(""); }, [role]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!role) return setMessage({ type: "error", text: "Please select a role." });
    setLoading(true);
    try {
      await AuthService.register(email, password, role, tenantId);
      setMessage({ type: "success", text: "Registration successful. Redirecting…" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error?.response?.data || error?.message || "Registration failed.",
      });
    } finally { setLoading(false); }
  };

  return (
    <div className="sx-auth" data-testid="register-page">
      <div className="sx-auth-side reveal d-1">
        <div>
          <div className="meta">Servexa · Onboarding</div>
          <h1 style={{ marginTop: 24 }}>Add a<br /><em>new operator.</em></h1>
          <p style={{ color: "var(--text-2)", marginTop: 22, maxWidth: 420 }}>
            Provision an account with the right role. Tenants get a self-serve portal; admins get the full command surface.
          </p>
        </div>
        <div className="sx-auth-tag">
          <div><span>→</span>&nbsp; Role-based access</div>
          <div><span>→</span>&nbsp; Tenant linking by ID</div>
          <div><span>→</span>&nbsp; Audit-ready creation</div>
        </div>
      </div>

      <div className="sx-auth-card reveal d-2">
        <h2>Create account</h2>
        <p className="sub">— Provision a new user</p>

        <form className="sx-form" onSubmit={handleRegister}>
          <div className="sx-field">
            <label className="sx-label">Email</label>
            <input className="sx-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@servexa.com" />
          </div>
          <div className="sx-field">
            <label className="sx-label">Password</label>
            <input className="sx-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="sx-field">
            <label className="sx-label">Role</label>
            <select className="sx-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select a role…</option>
              {currentUserRole === "ADMIN" && (<>
                <option value="ADMIN">Admin</option>
                <option value="PRIVILEGED_USER">Privileged User</option>
                <option value="TENANT">Tenant</option>
              </>)}
              {currentUserRole === "PRIVILEGED_USER" && <option value="TENANT">Tenant</option>}
            </select>
          </div>
          <div className="sx-field">
            <label className="sx-label">Tenant ID {role !== "TENANT" && <span style={{ color: "var(--text-4)", textTransform: "none", letterSpacing: 0 }}>(tenants only)</span>}</label>
            <input className="sx-input" type="text" placeholder="e.g. 1024" value={tenantId} onChange={(e) => setTenantId(e.target.value)} disabled={role !== "TENANT"} />
          </div>

          {message.text && <div className={`sx-alert ${message.type === "success" ? "success" : "error"}`}>{message.text}</div>}

          <button type="submit" disabled={loading} className="sx-btn sx-btn-primary sx-btn-lg" style={{ marginTop: 8, justifyContent: "center" }}>
            {loading ? "Creating…" : (<>Create account <Icon name="arrow-right" size={16} /></>)}
          </button>
        </form>
      </div>
    </div>
  );
}
