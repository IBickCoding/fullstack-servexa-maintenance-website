import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { requestAPI } from "../api.js";
import AuthService from "../auth/AuthService";
import Icon from "../Icon";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [userRole, setUserRole] = useState(AuthService.getUserRole());
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);
  const [modalEntityType, setModalEntityType] = useState("");
  const [modalEntityId, setModalEntityId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchRequestId, setSearchRequestId] = useState("");
  const [searchTenantName, setSearchTenantName] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const role = AuthService.getUserRole();
    setUserRole(role);
    const tenantId = AuthService.getTenantId();
    const requestInfo = role === "TENANT" ? requestAPI.getByTenantId(tenantId) : requestAPI.getAll();
    requestInfo.then(res => setRequests(res.data || [])).catch(err => console.error(err));
  }, []);

  const handleViewDetails = (vendor) => {
    if (!vendor) return;
    setModalTitle("Vendor details");
    setModalContent([
      { label: "Vendor ID", value: vendor?.vendorId },
      { label: "Name", value: vendor?.name },
      { label: "Service Type", value: vendor?.serviceType },
      { label: "Phone", value: vendor?.phone },
      { label: "Email", value: vendor?.email || "N/A" },
      { label: "Address", value: `${vendor?.addressLine1}, ${vendor?.addressCity}, ${vendor?.addressZip}` },
      { label: "Contact", value: `${vendor?.contactFirstName} ${vendor?.contactLastName}` },
    ]);
    setModalEntityType("vendor");
    setModalEntityId(vendor?.vendorId);
    setShowModal(true);
  };
  const handleViewTenant = (tenant) => {
    if (!tenant) return;
    setModalTitle("Tenant details");
    setModalContent([
      { label: "Tenant ID", value: tenant?.tenantId },
      { label: "Name", value: `${tenant?.firstName} ${tenant?.lastName}` },
      { label: "Unit #", value: tenant?.unitNumber },
      { label: "Email", value: tenant?.email || "N/A" },
      { label: "Phone", value: tenant?.phone || "N/A" },
    ]);
    setModalEntityType("tenant");
    setModalEntityId(tenant?.tenantId);
    setShowModal(true);
  };
  const handleViewRequest = (request) => {
    setModalTitle(`Request #${request?.requestId}`);
    setModalContent([
      { label: "Request ID", value: request?.requestId },
      { label: "Division", value: request?.division },
      { label: "Status", value: request?.status },
      { label: "Urgency", value: request?.urgency },
      { label: "Date Submitted", value: request?.submissionDate },
      { label: "Description", value: request?.description || "N/A" },
    ]);
    setModalEntityType("request");
    setModalEntityId(request?.requestId);
    setShowModal(true);
  };

  const openDeleteConfirm = () => { setShowModal(false); setShowDeleteConfirm(true); };
  const confirmDelete = async () => {
    setFeedback({ type: "", message: "" });
    try {
      if (modalEntityType === "request") {
        await requestAPI.delete(modalEntityId);
        const res = await requestAPI.getAll();
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to delete request." });
    }
    setShowDeleteConfirm(false);
  };

  const statusBadge = (s) => {
    const map = { "Pending": "pending", "In Progress": "progress", "Completed": "completed", "Canceled": "canceled" };
    return <span className={`sx-badge ${map[s] || ""}`}>{s}</span>;
  };
  const urgencyBadge = (u) => {
    const map = { "High": "high", "Medium": "medium", "Low": "low" };
    return <span className={`sx-badge ${map[u] || ""}`}>{u}</span>;
  };

  const totalReqs = requests.length;
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const inProgressCount = requests.filter(r => r.status === "In Progress").length;
  const completedCount = requests.filter(r => r.status === "Completed").length;
  const canceledCount = requests.filter(r => r.status === "Canceled").length;
  const highUrgencyCount = requests.filter(r => r.urgency === "High").length;
  const mediumUrgencyCount = requests.filter(r => r.urgency === "Medium").length;
  const lowUrgencyCount = requests.filter(r => r.urgency === "Low").length;

  const filtered = requests.filter(r => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (urgencyFilter !== "All" && r.urgency !== urgencyFilter) return false;
    if (searchRequestId && !String(r.requestId).includes(searchRequestId)) return false;
    const fullName = `${r.tenant?.firstName || ""} ${r.tenant?.lastName || ""}`.toLowerCase();
    if (searchTenantName && !fullName.includes(searchTenantName.toLowerCase())) return false;
    return true;
  });
  const activeRequests = filtered.filter(r => r.status !== "Completed" && r.status !== "Canceled");
  const historicalRequests = filtered.filter(r => r.status === "Completed" || r.status === "Canceled");

  const renderRow = (request) => (
    <tr key={request.requestId}>
      <td data-label="Request">
        <span className="sx-id-chip" onClick={() => handleViewRequest(request)} data-testid={`view-req-${request.requestId}`}>
          #{request.requestId}
        </span>
      </td>
      <td data-label="Tenant">
        <span className="sx-link" onClick={() => handleViewTenant(request.tenant)}>
          {request.tenant ? `${request.tenant.firstName} ${request.tenant.lastName}` : "—"}
        </span>
      </td>
      <td data-label="Vendor">
        {request.vendor ? (
          <span className="sx-link" onClick={() => handleViewDetails(request.vendor)}>
            {request.vendor.name}
          </span>
        ) : <span style={{ color: "var(--text-4)" }}>Unassigned</span>}
      </td>
      <td data-label="Unit">{request.tenant?.unitNumber || "—"}</td>
      <td data-label="Division">{request.division}</td>
      <td data-label="Status">{statusBadge(request.status)}</td>
      <td data-label="Urgency">{urgencyBadge(request.urgency)}</td>
      <td data-label="Submitted" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>{request.submissionDate}</td>
    </tr>
  );

  return (
    <div className="sx-page" data-testid="dashboard-page">
      <div className="sx-page-head reveal">
        <h1>Service Request <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--cyan)" }}>Dashboard</em></h1>
        <p className="sub">— Live overview · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      {feedback.message && <div className={`sx-alert ${feedback.type === "success" ? "success" : "error"}`}>{feedback.message}</div>}

      {userRole !== "TENANT" && (
        <>
          <div className="sx-stats reveal d-1">
            <div className={`sx-stat pending ${statusFilter === "Pending" ? "active" : ""}`} onClick={() => setStatusFilter(statusFilter === "Pending" ? "All" : "Pending")} data-testid="stat-pending">
              <div className="label">Pending</div><div className="value">{pendingCount}</div>
            </div>
            <div className={`sx-stat progress ${statusFilter === "In Progress" ? "active" : ""}`} onClick={() => setStatusFilter(statusFilter === "In Progress" ? "All" : "In Progress")}>
              <div className="label">In Progress</div><div className="value">{inProgressCount}</div>
            </div>
            <div className={`sx-stat completed ${statusFilter === "Completed" ? "active" : ""}`} onClick={() => setStatusFilter(statusFilter === "Completed" ? "All" : "Completed")}>
              <div className="label">Completed</div><div className="value">{completedCount}</div>
            </div>
            <div className={`sx-stat canceled ${statusFilter === "Canceled" ? "active" : ""}`} onClick={() => setStatusFilter(statusFilter === "Canceled" ? "All" : "Canceled")}>
              <div className="label">Canceled</div><div className="value">{canceledCount}</div>
            </div>
            <div className="sx-stat total" onClick={() => { setStatusFilter("All"); setUrgencyFilter("All"); }}>
              <div className="label">Total</div><div className="value">{totalReqs}</div>
            </div>
          </div>

          <div className="sx-stats urg reveal d-2">
            <div className={`sx-stat high ${urgencyFilter === "High" ? "active" : ""}`} onClick={() => setUrgencyFilter(urgencyFilter === "High" ? "All" : "High")}>
              <div className="label">High Urgency</div><div className="value">{highUrgencyCount}</div>
            </div>
            <div className={`sx-stat medium ${urgencyFilter === "Medium" ? "active" : ""}`} onClick={() => setUrgencyFilter(urgencyFilter === "Medium" ? "All" : "Medium")}>
              <div className="label">Medium</div><div className="value">{mediumUrgencyCount}</div>
            </div>
            <div className={`sx-stat low ${urgencyFilter === "Low" ? "active" : ""}`} onClick={() => setUrgencyFilter(urgencyFilter === "Low" ? "All" : "Low")}>
              <div className="label">Low</div><div className="value">{lowUrgencyCount}</div>
            </div>
          </div>
        </>
      )}

      <div className="sx-actions-bar reveal d-3">
        <h3>Quick actions</h3>
        <div className="btns">
          <Link to="/AddRequest" className="sx-btn sx-btn-primary" data-testid="new-request-btn">
            <Icon name="plus" size={14} /> New request
          </Link>
          {userRole !== "TENANT" && (
            <>
              <Link to="/Vendors" className="sx-btn">Vendors</Link>
              <Link to="/Tenants" className="sx-btn">Tenants</Link>
            </>
          )}
        </div>
      </div>

      {userRole !== "TENANT" && (
        <div className="sx-search reveal d-4">
          <div className="sx-search-field">
            <Icon name="search" size={16} />
            <input type="text" placeholder="Search by Request ID…" value={searchRequestId} onChange={e => setSearchRequestId(e.target.value)} data-testid="search-id" />
          </div>
          <div className="sx-search-field">
            <Icon name="user" size={16} />
            <input type="text" placeholder="Search by Tenant Name…" value={searchTenantName} onChange={e => setSearchTenantName(e.target.value)} data-testid="search-tenant" />
          </div>
        </div>
      )}

      <div className="sx-table-wrap reveal d-5" style={{ marginBottom: 22 }}>
        <div className="sx-table-head">
          <h3>Active requests <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 400, marginLeft: 8 }}>{activeRequests.length}</span></h3>
        </div>
        <div className="sx-table-scroll">
          <table className="sx-table sx-table-mobile-card">
            <thead><tr><th>Request</th><th>Tenant</th><th>Vendor</th><th>Unit #</th><th>Division</th><th>Status</th><th>Urgency</th><th>Submitted</th></tr></thead>
            <tbody>
              {activeRequests.length > 0 ? activeRequests.map(renderRow) :
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--text-4)" }}>No active requests.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sx-table-wrap reveal d-6">
        <div className="sx-table-head">
          <h3>Historical requests <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 400, marginLeft: 8 }}>{historicalRequests.length}</span></h3>
        </div>
        <div className="sx-table-scroll">
          <table className="sx-table sx-table-mobile-card">
            <thead><tr><th>Request</th><th>Tenant</th><th>Vendor</th><th>Unit #</th><th>Division</th><th>Status</th><th>Urgency</th><th>Submitted</th></tr></thead>
            <tbody>
              {historicalRequests.length > 0 ? historicalRequests.map(renderRow) :
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--text-4)" }}>No historical records.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="sx-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head">
              <h3>{modalTitle}</h3>
              <button className="sx-modal-close" onClick={() => setShowModal(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body">
              {modalContent.map((item, i) => (<p key={i}><strong>{item.label}:</strong> {item.value}</p>))}
            </div>
            <div className="sx-modal-foot">
              {modalEntityType === "request" ? (
                <>
                  <Link to={`/EditRequest/${modalEntityId}`} className="sx-btn sx-btn-primary"><Icon name="edit" size={14} /> Edit</Link>
                  {userRole === "ADMIN" && (
                    <button className="sx-btn sx-btn-danger" onClick={openDeleteConfirm}><Icon name="trash" size={14} /> Delete</button>
                  )}
                </>
              ) : (
                <button className="sx-btn" onClick={() => setShowModal(false)}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="sx-modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head danger">
              <h3>Delete this {modalEntityType}?</h3>
              <button className="sx-modal-close" onClick={() => setShowDeleteConfirm(false)}><Icon name="close" size={16} /></button>
            </div>
            <div className="sx-modal-body"><p>This action cannot be undone.</p></div>
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
