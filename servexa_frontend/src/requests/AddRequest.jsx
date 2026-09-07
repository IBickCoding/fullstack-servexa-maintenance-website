import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestAPI, tenantAPI, vendorAPI } from "../api";
import AuthService from "../auth/AuthService";
import Select from "react-select";
import Icon from "../Icon";

export default function AddRequest() {
  const navigate = useNavigate();
  const userRole = AuthService.getUserRole();
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({ tenantId: "", vendorId: "", urgency: "", submissionDate: "", description: "", division: "" });
  const selectedTenant = tenants.find(t => t.tenantId === Number(formData.tenantId));

  const tenantOptions = tenants.map(t => ({ value: t.tenantId, label: `${t.firstName} ${t.lastName} — Unit ${t.unitNumber}` }));
  const vendorOptions = vendors.map(v => ({ value: v.vendorId, label: `${v.name} — ${v.serviceType}` }));

  useEffect(() => {
    tenantAPI.getAll().then(res => setTenants(res.data || [])).catch(err => console.error(err));
    vendorAPI.getAll().then(res => setVendors(res.data || [])).catch(err => console.error(err));
    if (userRole === "TENANT") setFormData(prev => ({ ...prev, tenantId: AuthService.getTenantId() }));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [year, month, day] = formData.submissionDate.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    const requestBody = {
      tenant: formData.tenantId ? { tenantId: parseInt(formData.tenantId) } : null,
      vendor: formData.vendorId ? { vendorId: parseInt(formData.vendorId) } : null,
      status: "Pending",
      urgency: formData.urgency, submissionDate: formattedDate,
      description: formData.description, division: formData.division,
    };
    setSubmitting(true); setFeedback({ type: "", message: "" });
    try {
      await requestAPI.create(requestBody);
      setFeedback({ type: "success", message: "Service request submitted. Redirecting…" });
      setTimeout(() => navigate("/Dashboard"), 1500);
    } catch (err) { console.error(err); setFeedback({ type: "error", message: "Failed to submit request." }); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="sx-page" style={{ maxWidth: 820 }} data-testid="add-request-page">
      <div className="sx-page-head reveal">
        <h1>New <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--cyan)" }}>service request</em></h1>
        <p className="sub">— Log a new maintenance issue</p>
      </div>

      <form className="sx-form sx-glass reveal d-1" onSubmit={handleSubmit} data-testid="add-request-form">
        {userRole !== "TENANT" && (
          <div className="sx-field">
            <label className="sx-label">Tenant</label>
            {userRole === "TENANT" ? (
              <input className="sx-input" type="text" disabled value={selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName} — Unit ${selectedTenant.unitNumber}` : "Loading…"} />
            ) : (
              <Select className="sx-rs" classNamePrefix="rs" name="tenantId" required maxMenuHeight={200}
                value={tenantOptions.find(t => t.value === formData.tenantId)}
                onChange={(opt) => setFormData({ ...formData, tenantId: opt.value })}
                options={tenantOptions} placeholder="Select tenant…" />
            )}
          </div>
        )}

        {userRole !== "TENANT" && (
          <div className="sx-field">
            <label className="sx-label">Assign vendor</label>
            <Select className="sx-rs" classNamePrefix="rs" name="vendorId" required maxMenuHeight={200}
              value={vendorOptions.find(v => v.value === formData.vendorId)}
              onChange={(opt) => setFormData({ ...formData, vendorId: opt.value })}
              options={vendorOptions} placeholder="Select vendor…" />
          </div>
        )}

        <div className="sx-field">
          <label className="sx-label">Submission date</label>
          <input className="sx-input" type="date" name="submissionDate" required value={formData.submissionDate} onChange={handleChange} />
        </div>

        <div className="sx-field">
          <label className="sx-label">Description</label>
          <textarea className="sx-textarea" name="description" rows="5" required value={formData.description} onChange={handleChange} placeholder="Describe the maintenance issue…" />
        </div>

        <div className="sx-field">
          <label className="sx-label">Division</label>
          <div className="sx-pills">
            {["Plumbing", "Electrical", "HVAC", "General"].map(div => (
              <label key={div} className={`sx-pill ${formData.division === div ? "checked" : ""}`}>
                <input type="radio" name="division" value={div} checked={formData.division === div} onChange={handleChange} />{div}
              </label>
            ))}
          </div>
        </div>

        <div className="sx-field">
          <label className="sx-label">Urgency</label>
          <div className="sx-pills">
            {["Low", "Medium", "High"].map(level => (
              <label key={level} className={`sx-pill ${formData.urgency === level ? "checked" : ""}`}>
                <input type="radio" name="urgency" value={level} checked={formData.urgency === level} onChange={handleChange} />{level}
              </label>
            ))}
          </div>
        </div>

        {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="sx-btn sx-btn-primary" disabled={submitting} data-testid="submit-request-btn">
            {submitting ? "Submitting…" : (<>Submit request <Icon name="arrow-right" size={14} /></>)}
          </button>
          <Link to="/Dashboard" className="sx-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
