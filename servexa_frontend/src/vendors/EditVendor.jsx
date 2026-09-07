import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { vendorAPI } from "../api";
import Icon from "../Icon";

export default function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [vendor, setVendor] = useState({ name: "", serviceType: "", addressLine1: "", addressLine2: "", addressCity: "", addressZip: "", contactFirstName: "", contactLastName: "", phone: "", email: "" });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    vendorAPI.getById(id).then(res => { setVendor(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  const handleChange = (e) => setVendor(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleOpenEditConfirm = (e) => { e.preventDefault(); setShowEditConfirm(true); };
  const confirmEdit = async () => {
    setFeedback({ type: "", message: "" });
    try { await vendorAPI.update(id, vendor); setShowEditConfirm(false);
      setFeedback({ type: "success", message: "Vendor updated. Redirecting…" });
      setTimeout(() => navigate("/Vendors"), 1500);
    } catch (err) { console.error(err); setShowEditConfirm(false); setFeedback({ type: "error", message: "Update failed." }); }
  };

  if (loading) return <div className="sx-page"><p style={{ color: "var(--text-3)" }}>Loading…</p></div>;

  return (
    <div className="sx-page" style={{ maxWidth: 720 }}>
      <div className="sx-page-head reveal">
        <h1>Edit <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--lime)" }}>vendor</em> <span style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.6em" }}>#{id}</span></h1>
        <p className="sub">— Update vendor details</p>
      </div>
      <form className="sx-form sx-glass reveal d-1" onSubmit={handleOpenEditConfirm}>
        <div className="sx-field"><label className="sx-label">Vendor name</label><input className="sx-input" name="name" required value={vendor.name} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Service type</label>
          <select className="sx-select" name="serviceType" required value={vendor.serviceType} onChange={handleChange}>
            <option value="">Select…</option><option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option><option value="HVAC">HVAC</option><option value="General">General</option>
          </select>
        </div>
        <div className="sx-field"><label className="sx-label">Address line 1</label><input className="sx-input" name="addressLine1" required value={vendor.addressLine1} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Address line 2</label><input className="sx-input" name="addressLine2" value={vendor.addressLine2 || ""} onChange={handleChange} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div className="sx-field"><label className="sx-label">City</label><input className="sx-input" name="addressCity" value={vendor.addressCity || ""} onChange={handleChange} /></div>
          <div className="sx-field"><label className="sx-label">Zip</label><input className="sx-input" name="addressZip" value={vendor.addressZip || ""} onChange={handleChange} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="sx-field"><label className="sx-label">Contact first</label><input className="sx-input" name="contactFirstName" value={vendor.contactFirstName || ""} onChange={handleChange} /></div>
          <div className="sx-field"><label className="sx-label">Contact last</label><input className="sx-input" name="contactLastName" value={vendor.contactLastName || ""} onChange={handleChange} /></div>
        </div>
        <div className="sx-field"><label className="sx-label">Phone</label><input className="sx-input" name="phone" value={vendor.phone || ""} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Email</label><input className="sx-input" name="email" type="email" value={vendor.email || ""} onChange={handleChange} /></div>
        {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="sx-btn sx-btn-primary"><Icon name="edit" size={14} /> Update vendor</button>
          <Link to="/Vendors" className="sx-btn">Cancel</Link>
        </div>
      </form>

      {showEditConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowEditConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head warn"><h3>Save changes?</h3>
              <button className="sx-modal-close" onClick={() => setShowEditConfirm(false)}><Icon name="close" size={16} /></button></div>
            <div className="sx-modal-body"><p>Update <strong>{vendor.name}</strong>?</p></div>
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
