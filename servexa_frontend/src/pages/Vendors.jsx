import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { vendorAPI } from "../api.js";
import Icon from "../Icon";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const loadVendors = () => { vendorAPI.getAll().then(res => setVendors(res.data || [])).catch(err => console.error(err)); };
  useEffect(() => { loadVendors(); }, []);

  const handleViewDetails = (v) => { setSelectedVendor(v); setShowModal(true); };
  const handleDelete = async (id) => {
    setFeedback({ type: "", message: "" });
    try { await vendorAPI.delete(id); loadVendors(); }
    catch (err) { console.error(err); setFeedback({ type: "error", message: "Failed to delete vendor." }); }
  };
  const openDeleteConfirm = () => { setShowModal(false); setShowDeleteConfirm(true); };
  const confirmDelete = () => { handleDelete(selectedVendor?.vendorId); setShowDeleteConfirm(false); };

  const filtered = vendors.filter(v => {
    const nameMatch = v.name?.toLowerCase().includes(searchName.toLowerCase());
    const emailMatch = v.email?.toLowerCase().includes(searchEmail.toLowerCase()) || !searchEmail;
    return nameMatch && emailMatch;
  });

  const serviceColor = (s) => {
    const map = { "Plumbing": "var(--cyan)", "Electrical": "var(--amber)", "HVAC": "var(--violet)", "General": "var(--lime)" };
    return map[s] || "var(--text-2)";
  };

  return (
    <div className="sx-page" data-testid="vendors-page">
      <div className="sx-page-head reveal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h1>Vendor <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--lime)" }}>roster</em></h1>
            <p className="sub">— Service partners · {vendors.length} total</p>
          </div>
          <Link to="/AddVendor" className="sx-btn sx-btn-primary" data-testid="add-vendor-btn">
            <Icon name="plus" size={14} /> Add vendor
          </Link>
        </div>
      </div>

      {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}

      <div className="sx-search reveal d-1">
        <div className="sx-search-field">
          <Icon name="search" size={16} />
          <input type="text" placeholder="Search by name…" value={searchName} onChange={e => setSearchName(e.target.value)} />
        </div>
        <div className="sx-search-field">
          <Icon name="mail" size={16} />
          <input type="text" placeholder="Search by email…" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} />
        </div>
      </div>

      <div className="sx-table-wrap reveal d-2">
        <div className="sx-table-head">
          <h3>Vendor list <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 400, marginLeft: 8 }}>{filtered.length}</span></h3>
        </div>
        <div className="sx-table-scroll">
          <table className="sx-table sx-table-mobile-card">
            <thead><tr><th>ID</th><th>Name</th><th>Service</th><th>Phone</th><th>Email</th></tr></thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(v => (
                <tr key={v.vendorId}>
                  <td data-label="ID"><span className="sx-id-chip" onClick={() => handleViewDetails(v)} data-testid={`vendor-row-${v.vendorId}`}>#{v.vendorId}</span></td>
                  <td data-label="Name" style={{ color: "var(--text-1)", fontWeight: 500 }}>{v.name}</td>
                  <td data-label="Service"><span style={{ color: serviceColor(v.serviceType), fontFamily: "var(--font-mono)", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{v.serviceType}</span></td>
                  <td data-label="Phone">{v.phone}</td>
                  <td data-label="Email">{v.email || "—"}</td>
                </tr>
              )) : <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-4)" }}>No vendors found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedVendor && (
        <div className="sx-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head">
              <h3>Vendor details</h3>
              <button className="sx-modal-close" onClick={() => setShowModal(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body">
              <p><strong>Vendor ID:</strong> #{selectedVendor.vendorId}</p>
              <p><strong>Name:</strong> {selectedVendor.name}</p>
              <p><strong>Service Type:</strong> {selectedVendor.serviceType}</p>
              <p><strong>Phone:</strong> {selectedVendor.phone}</p>
              <p><strong>Email:</strong> {selectedVendor.email || "—"}</p>
              <p><strong>Address:</strong> {selectedVendor.addressLine1}, {selectedVendor.addressCity}, {selectedVendor.addressZip}</p>
              <p><strong>Contact:</strong> {selectedVendor.contactFirstName} {selectedVendor.contactLastName}</p>
            </div>
            <div className="sx-modal-foot">
              <Link to={`/EditVendor/${selectedVendor.vendorId}`} className="sx-btn sx-btn-primary"><Icon name="edit" size={14} /> Edit</Link>
              <button className="sx-btn sx-btn-danger" onClick={openDeleteConfirm}><Icon name="trash" size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head danger">
              <h3>Delete vendor?</h3>
              <button className="sx-modal-close" onClick={() => setShowDeleteConfirm(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body">
              <p>Delete <strong>{selectedVendor?.name}</strong>? This action cannot be undone.</p>
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
