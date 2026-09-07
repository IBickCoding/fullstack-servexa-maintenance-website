import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { requestAPI, tenantAPI, vendorAPI } from "../api";
import AuthService from "../auth/AuthService";
import Select from "react-select";
import Icon from "../Icon";

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const isTenant = AuthService.getUserRole() === "TENANT";
  const userRole = AuthService.getUserRole();

  const tenantOptions = tenants.map(t => ({ value: t.tenantId, label: `${t.firstName} ${t.lastName} — Unit ${t.unitNumber}` }));
  const vendorOptions = vendors.map(v => ({ value: v.vendorId, label: `${v.name} — ${v.serviceType}` }));

  const [formData, setFormData] = useState({ tenantId: "", vendorId: "", status: "", urgency: "", submissionDate: "", description: "", division: "" });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const reqRes = await requestAPI.getById(id);
        const req = reqRes.data;
        let inputDate = req.submissionDate || "";
        if (inputDate.includes("/")) {
          const [m, d, y] = inputDate.split("/");
          inputDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
        setFormData({
          tenantId: req.tenant?.tenantId || "", vendorId: req.vendor?.vendorId || "",
          status: req.status || "", urgency: req.urgency || "",
          submissionDate: inputDate, description: req.description || "", division: req.division || "",
        });
        const [tr, vr] = await Promise.allSettled([tenantAPI.getAll(), vendorAPI.getAll()]);
        if (tr.status === "fulfilled") setTenants(tr.value.data || []); else setTenants([]);
        if (vr.status === "fulfilled") setVendors(vr.value.data || []); else setVendors([]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setShowEditConfirm(true); };

  const confirmEdit = async () => {
    const [year, month, day] = formData.submissionDate.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    const requestBody = {
      tenant: formData.tenantId ? { tenantId: parseInt(formData.tenantId) } : null,
      vendor: formData.vendorId ? { vendorId: parseInt(formData.vendorId) } : null,
      status: formData.status, urgency: formData.urgency,
      submissionDate: formattedDate, description: formData.description, division: formData.division,
    };
    try { await requestAPI.update(id, requestBody); setShowEditConfirm(false); navigate("/Dashboard"); }
    catch (err) { console.error("Update failed:", err); }
  };

  if (loading) return <div className="sx-page"><p style={{ color: "var(--text-3)" }}>Loading…</p></div>;

  return (
    <div className="sx-page" style={{ maxWidth: 820 }}>
      <div className="sx-page-head reveal">
        <h1>Edit <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--violet)" }}>request</em> <span style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.6em" }}>#{id}</span></h1>
        <p className="sub">— Update fields below</p>
      </div>

      <form className="sx-form sx-glass reveal d-1" onSubmit={handleSubmit}>
        {userRole !== "TENANT" && (
          <div className="sx-field">
            <label className="sx-label">Tenant</label>
            <Select className="sx-rs" name="tenantId" required maxMenuHeight={200} isDisabled={isTenant}
              value={tenantOptions.find(t => String(t.value) === String(formData.tenantId))}
              onChange={(opt) => setFormData({ ...formData, tenantId: opt?.value || "" })}
              options={tenantOptions} placeholder="Select tenant…" />
          </div>
        )}
        {userRole !== "TENANT" && (
          <div className="sx-field">
            <label className="sx-label">Assign vendor</label>
            <Select className="sx-rs" name="vendorId" maxMenuHeight={200} isDisabled={isTenant}
              value={vendorOptions.find(v => String(v.value) === String(formData.vendorId))}
              onChange={(opt) => setFormData({ ...formData, vendorId: opt?.value || "" })}
              options={vendorOptions} placeholder="None / unassigned" />
          </div>
        )}
        <div className="sx-field">
          <label className="sx-label">Status</label>
          <select className="sx-select" name="status" value={formData.status} onChange={handleChange} required disabled={isTenant}>
            <option value="">Select status…</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        <div className="sx-field">
          <label className="sx-label">Submission date</label>
          <input className="sx-input" type="date" name="submissionDate" value={formData.submissionDate} onChange={handleChange} required disabled={isTenant} />
        </div>
        <div className="sx-field">
          <label className="sx-label">Description</label>
          <textarea className="sx-textarea" name="description" rows="5" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="sx-field">
          <label className="sx-label">Division</label>
          <div className="sx-pills">
            {["Plumbing", "Electrical", "HVAC", "General"].map(div => (
              <label key={div} className={`sx-pill ${formData.division === div ? "checked" : ""}`} style={isTenant ? { opacity: 0.6, pointerEvents: "none" } : {}}>
                <input type="radio" name="division" value={div} checked={formData.division === div} onChange={handleChange} disabled={isTenant} />{div}
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
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="sx-btn sx-btn-primary"><Icon name="edit" size={14} /> Update request</button>
          <Link to="/Dashboard" className="sx-btn">Cancel</Link>
        </div>
      </form>

      {showEditConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowEditConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head warn">
              <h3>Confirm update</h3>
              <button className="sx-modal-close" onClick={() => setShowEditConfirm(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body"><p>Save changes to request <strong>#{id}</strong>?</p></div>
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
