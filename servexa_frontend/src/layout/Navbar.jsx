import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { tenantAPI } from "../api";
import Icon from "../Icon";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(AuthService.getUserRole());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = AuthService.isAuthenticated();
    const role = AuthService.getUserRole();
    setIsAuthenticated(isAuth);
    setUserRole(role);
    setDrawerOpen(false);

    if (isAuth && role === "TENANT") {
      const tenantId = AuthService.getTenantId();
      if (tenantId) {
        tenantAPI.getById(tenantId)
          .then(r => setTenantName(`${r.data.firstName} ${r.data.lastName}`))
          .catch(err => console.error("Tenant load:", err));
      }
    }
  }, [location]);

  const handleLogoutConfirm = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setShowLogoutModal(false);
    navigate("/");
  };

  let navItems = [];
  if (userRole === "ADMIN" || userRole === "PRIVILEGED_USER") {
    navItems = [
      { name: "Dashboard", path: "/Dashboard" },
      { name: "Vendors", path: "/Vendors" },
      { name: "Tenants", path: "/Tenants" },
      { name: "Register", path: "/Register" },
    ];
  } else if (userRole === "TENANT") {
    navItems = [{ name: "Dashboard", path: "/Dashboard" }];
  }

  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <>
      <div className="bg-grid" />
      <nav className="sx-nav" data-testid="navbar">
        <Link to="/" className="sx-brand" data-testid="brand-link">
          <span className="sx-brand-mark"><Icon name="gear" size={16} /></span>
          Servexa
          <span className="sx-brand-tagline">— maintenance, refined.</span>
        </Link>

        <div className="sx-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sx-nav-link ${isActive(item.path) ? "active" : ""}`}
              data-testid={`nav-${item.name.toLowerCase()}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="sx-nav-right">
          {isAuthenticated && userRole && userRole !== "TENANT" && userRole !== "null" && (
            <span className="sx-role-pill" data-testid="role-pill">{userRole}</span>
          )}
          {isAuthenticated && userRole === "TENANT" && tenantName && (
            <span className="sx-role-pill" style={{ color: "var(--cyan)" }} data-testid="tenant-name">{tenantName}</span>
          )}
          {isAuthenticated ? (
            <button
              className="sx-btn sx-btn-sm"
              onClick={() => setShowLogoutModal(true)}
              data-testid="logout-btn"
            >
              <Icon name="logout" size={14} /> Log out
            </button>
          ) : (
            <Link to="/Login" className="sx-btn sx-btn-primary sx-btn-sm" data-testid="login-link">
              Sign in <Icon name="arrow-right" size={14} />
            </Link>
          )}
          <button
            className="sx-mobile-toggle"
            onClick={() => setDrawerOpen(!drawerOpen)}
            data-testid="mobile-menu-toggle"
            aria-label="toggle menu"
          >
            <Icon name={drawerOpen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <div className="sx-drawer" data-testid="mobile-drawer">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sx-nav-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {showLogoutModal && (
        <div className="sx-modal-backdrop" onClick={() => setShowLogoutModal(false)} data-testid="logout-modal">
          <div className="sx-modal" onClick={e => e.stopPropagation()}>
            <div className="sx-modal-head warn">
              <h3>Sign out?</h3>
              <button className="sx-modal-close" onClick={() => setShowLogoutModal(false)}>
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="sx-modal-body">
              <p>You'll be signed out of Servexa. You can sign back in anytime.</p>
            </div>
            <div className="sx-modal-foot">
              <button className="sx-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="sx-btn sx-btn-danger" onClick={handleLogoutConfirm} data-testid="confirm-logout">
                <Icon name="logout" size={14} /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
