import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vendorAPI } from "../api";
import Icon from "../Icon";

export default function AddVendor() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({ name: "", serviceType: "", addressLine1: "", addressLine2: "", addressCity: "", addressZip: "", contactFirstName: "", contactLastName: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const handleChange = (e) => setVendor({ ...vendor, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setFeedback({ type: "", message: "" });
    try { await vendorAPI.create(vendor);
      setFeedback({ type: "success", message: "Vendor added. Redirecting…" });
      setTimeout(() => navigate("/vendors"), 1500);
    } catch (err) { console.error(err); setFeedback({ type: "error", message: "Failed to add vendor." }); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="sx-page" style={{ maxWidth: 720 }}>
      <div className="sx-page-head reveal">
        <h1>Add <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--lime)" }}>vendor</em></h1>
        <p className="sub">— Onboard a new service partner</p>
      </div>
      <form className="sx-form sx-glass reveal d-1" onSubmit={handleSubmit}>
        <div className="sx-field"><label className="sx-label">Vendor name</label><input className="sx-input" name="name" required value={vendor.name} onChange={handleChange} placeholder="Acme HVAC" /></div>
        <div className="sx-field"><label className="sx-label">Service type</label>
          <select className="sx-select" name="serviceType" required value={vendor.serviceType} onChange={handleChange}>
            <option value="">Select…</option><option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option><option value="HVAC">HVAC</option><option value="General">General</option>
          </select>
        </div>
        <div className="sx-field"><label className="sx-label">Address line 1</label><input className="sx-input" name="addressLine1" required value={vendor.addressLine1} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Address line 2</label><input className="sx-input" name="addressLine2" value={vendor.addressLine2} onChange={handleChange} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div className="sx-field"><label className="sx-label">City</label><input className="sx-input" name="addressCity" value={vendor.addressCity} onChange={handleChange} /></div>
          <div className="sx-field"><label className="sx-label">Zip</label><input className="sx-input" name="addressZip" value={vendor.addressZip} onChange={handleChange} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="sx-field"><label className="sx-label">Contact first</label><input className="sx-input" name="contactFirstName" value={vendor.contactFirstName} onChange={handleChange} /></div>
          <div className="sx-field"><label className="sx-label">Contact last</label><input className="sx-input" name="contactLastName" value={vendor.contactLastName} onChange={handleChange} /></div>
        </div>
        <div className="sx-field"><label className="sx-label">Phone</label><input className="sx-input" name="phone" value={vendor.phone} onChange={handleChange} /></div>
        <div className="sx-field"><label className="sx-label">Email</label><input className="sx-input" name="email" value={vendor.email} onChange={handleChange} /></div>
        {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="sx-btn sx-btn-primary" disabled={submitting}>
            {submitting ? "Adding…" : (<><Icon name="plus" size={14} /> Add vendor</>)}
          </button>
          <Link to="/vendors" className="sx-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
