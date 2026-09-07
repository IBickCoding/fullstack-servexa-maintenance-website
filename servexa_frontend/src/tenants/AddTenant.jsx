import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { tenantAPI } from "../api";
import Icon from "../Icon";

export default function AddTenant() {
  const navigate = useNavigate();
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [tenant, setTenant] = useState({ firstName: "", lastName: "", unitNumber: "", phone: "", email: "" });

  const handleChange = (e) => setTenant({ ...tenant, [e.target.name]: e.target.value });
  const handleOpenAddConfirm = (e) => { e.preventDefault(); setShowAddConfirm(true); };
  const confirmAdd = async () => {
    try { await tenantAPI.create(tenant); setShowAddConfirm(false); navigate("/Tenants"); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="sx-page" style={{ maxWidth: 720 }}>
      <div className="sx-page-head reveal">
        <h1>Add <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--violet)" }}>tenant</em></h1>
        <p className="sub">— Onboard a new resident</p>
      </div>
      <form className="sx-form sx-glass reveal d-1" onSubmit={handleOpenAddConfirm}>
        <div className="sx-field"><label className="sx-label">First name</label><input className="sx-input" name="firstName" required value={tenant.firstName} onChange={handleChange} placeholder="Jane" /></div>
        <div className="sx-field"><label className="sx-label">Last name</label><input className="sx-input" name="lastName" required value={tenant.lastName} onChange={handleChange} placeholder="Doe" /></div>
        <div className="sx-field"><label className="sx-label">Unit number</label><input className="sx-input" name="unitNumber" required value={tenant.unitNumber} onChange={handleChange} placeholder="101" /></div>
        <div className="sx-field"><label className="sx-label">Phone</label><input className="sx-input" name="phone" type="tel" value={tenant.phone} onChange={handleChange} placeholder="(555) 123-4567" /></div>
        <div className="sx-field"><label className="sx-label">Email</label><input className="sx-input" name="email" type="email" required value={tenant.email} onChange={handleChange} placeholder="jane@servexa.com" /></div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="sx-btn sx-btn-primary"><Icon name="plus" size={14} /> Add tenant</button>
          <Link to="/Tenants" className="sx-btn">Cancel</Link>
        </div>
      </form>

      {showAddConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowAddConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head warn"><h3>Add this tenant?</h3>
              <button className="sx-modal-close" onClick={() => setShowAddConfirm(false)}><Icon name="close" size={16} /></button></div>
            <div className="sx-modal-body"><p>Create record for <strong>{tenant.firstName} {tenant.lastName}</strong>?</p></div>
            <div className="sx-modal-foot">
              <button className="sx-btn" onClick={() => setShowAddConfirm(false)}>Cancel</button>
              <button className="sx-btn sx-btn-primary" onClick={confirmAdd}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
