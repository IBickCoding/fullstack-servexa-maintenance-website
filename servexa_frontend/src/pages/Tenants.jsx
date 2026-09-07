import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tenantAPI } from "../api.js";
import Icon from "../Icon";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const loadTenants = () => {
    tenantAPI.getAll().then(res => setTenants(res.data || [])).catch(err => console.error(err));
  };
  useEffect(() => { loadTenants(); }, []);

  const handleViewDetails = (t) => { setSelectedTenant(t); setShowModal(true); };
  const handleDelete = async (id) => {
    setFeedback({ type: "", message: "" });
    try { await tenantAPI.delete(id); loadTenants(); }
    catch (err) { console.error(err); setFeedback({ type: "error", message: "Failed to delete tenant." }); }
  };
  const openDeleteConfirm = () => { setShowModal(false); setShowDeleteConfirm(true); };
  const confirmDelete = () => { handleDelete(selectedTenant?.tenantId); setShowDeleteConfirm(false); };

  const filtered = tenants.filter(t => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    return fullName.includes(searchName.toLowerCase()) && (t.email?.toLowerCase().includes(searchEmail.toLowerCase()));
  });

  const initials = (t) => `${(t.firstName||"?")[0]}${(t.lastName||"?")[0]}`.toUpperCase();

  return (
    <div className="sx-page" data-testid="tenants-page">
      <div className="sx-page-head reveal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h1>Tenants <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--violet)" }}>directory</em></h1>
            <p className="sub">— Residents · {tenants.length} total</p>
          </div>
          <Link to="/AddTenant" className="sx-btn sx-btn-primary" data-testid="add-tenant-btn">
            <Icon name="plus" size={14} /> Add tenant
          </Link>
        </div>
      </div>

      {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}

      <div className="sx-search reveal d-1">
        <div className="sx-search-field">
          <Icon name="search" size={16} />
          <input type="text" placeholder="Search by name…" value={searchName} onChange={e => setSearchName(e.target.value)} data-testid="search-tenant-name" />
        </div>
        <div className="sx-search-field">
          <Icon name="mail" size={16} />
          <input type="text" placeholder="Search by email…" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} data-testid="search-tenant-email" />
        </div>
      </div>

      <div className="sx-table-wrap reveal d-2">
        <div className="sx-table-head">
          <h3>Tenant list <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 400, marginLeft: 8 }}>{filtered.length}</span></h3>
        </div>
        <div className="sx-table-scroll">
          <table className="sx-table sx-table-mobile-card">
            <thead><tr><th>ID</th><th>Name</th><th>Unit</th><th>Phone</th><th>Email</th></tr></thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(t => (
                <tr key={t.tenantId}>
                  <td data-label="ID"><span className="sx-id-chip" onClick={() => handleViewDetails(t)} data-testid={`tenant-row-${t.tenantId}`}>#{t.tenantId}</span></td>
                  <td data-label="Name"><span className="sx-avatar">{initials(t)}</span><span style={{ color: "var(--text-1)", fontWeight: 500 }}>{t.firstName} {t.lastName}</span></td>
                  <td data-label="Unit" style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)" }}>{t.unitNumber}</td>
                  <td data-label="Phone">{t.phone || "—"}</td>
                  <td data-label="Email">{t.email || "—"}</td>
                </tr>
              )) : <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-4)" }}>No tenants found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedTenant && (
        <div className="sx-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head">
              <h3>Tenant details</h3>
              <button className="sx-modal-close" onClick={() => setShowModal(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body">
              <p><strong>Tenant ID:</strong> #{selectedTenant.tenantId}</p>
              <p><strong>Name:</strong> {selectedTenant.firstName} {selectedTenant.lastName}</p>
              <p><strong>Unit:</strong> {selectedTenant.unitNumber}</p>
              <p><strong>Phone:</strong> {selectedTenant.phone || "—"}</p>
              <p><strong>Email:</strong> {selectedTenant.email || "—"}</p>
            </div>
            <div className="sx-modal-foot">
              <Link to={`/EditTenant/${selectedTenant.tenantId}`} className="sx-btn sx-btn-primary"><Icon name="edit" size={14} /> Edit</Link>
              <button className="sx-btn sx-btn-danger" onClick={openDeleteConfirm}><Icon name="trash" size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head danger">
              <h3>Delete tenant?</h3>
              <button className="sx-modal-close" onClick={() => setShowDeleteConfirm(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body">
              <p>Delete <strong>{selectedTenant?.firstName} {selectedTenant?.lastName}</strong>? This action cannot be undone.</p>
            </div>
            <div className="sx-modal-foot">
              <button className="sx-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="sx-btn sx-btn-danger" onClick={confirmDelete}><Icon name="trash" size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
