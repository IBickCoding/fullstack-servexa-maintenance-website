import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tenantAPI } from "../api";
import Icon from "../Icon";

export default function EditTenant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [tenant, setTenant] = useState({ firstName: "", lastName: "", unitNumber: "", phone: "", email: "" });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    tenantAPI.getById(id).then(res => { setTenant(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  const handleChange = (e) => setTenant({ ...tenant, [e.target.name]: e.target.value });
  const handleOpenEditConfirm = (e) => { e.preventDefault(); setShowEditConfirm(true); };
  const confirmEdit = async () => {
    setFeedback({ type: "", message: "" });
    try { await tenantAPI.update(id, tenant); setShowEditConfirm(false);
      setFeedback({ type: "success", message: "Tenant updated. Redirecting…" });
      setTimeout(() => navigate("/Tenants"), 1500);
    } catch (err) { console.error(err); setShowEditConfirm(false); setFeedback({ type: "error", message: "Update failed." }); }
  };

  if (loading) return <div className="sx-page"><p style={{ color: "var(--text-3)" }}>Loading…</p></div>;

  return (
    <div className="sx-page" style={{ maxWidth: 720 }}>
      <div className="sx-page-head reveal">
        <h1>Edit <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--violet)" }}>tenant</em> <span style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.6em" }}>#{id}</span></h1>
        <p className="sub">— Update tenant details</p>
      </div>
      <form className="sx-form sx-glass reveal d-1" onSubmit={handleOpenEditConfirm}>
        <div className="sx-field"><label className="sx-label">First name</label><input className="sx-input" name="firstName" required value={tenant.firstName} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Last name</label><input className="sx-input" name="lastName" required value={tenant.lastName} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Unit number</label><input className="sx-input" name="unitNumber" required value={tenant.unitNumber} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Phone</label><input className="sx-input" name="phone" type="tel" value={tenant.phone} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Email</label><input className="sx-input" name="email" type="email" required value={tenant.email} onChange={handleChange} /></div>
        {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="sx-btn sx-btn-primary"><Icon name="edit" size={14} /> Update tenant</button>
          <Link to="/Tenants" className="sx-btn">Cancel</Link>
        </div>
      </form>

      {showEditConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowEditConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head warn"><h3>Save changes?</h3>
              <button className="sx-modal-close" onClick={() => setShowEditConfirm(false)}><Icon name="close" size={16} /></button></div>
            <div className="sx-modal-body"><p>Update <strong>{tenant.firstName} {tenant.lastName}</strong>?</p></div>
            <div className="sx-modal-foot">
              <button className="sx-btn" onClick={() => setShowEditConfirm(false)}>Cancel</button>
              <button className="sx-btn sx-btn-primary" onClick={confirmEdit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
