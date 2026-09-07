import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/AuthService";
import Icon from "../Icon";

const features = [
  {
    n: "01",
    icon: "clipboard",
    color: "rgba(34,226,255,0.15)",
    title: "Submit in seconds",
    body:
      "A frictionless form for category, location and notes. Your request is logged the instant you tap submit and routed to the right team.",
  },
  {
    n: "02",
    icon: "zap",
    color: "rgba(177,140,255,0.15)",
    title: "Real-time status",
    body:
      "From pending to in-progress to complete. Watch your requests move through the pipeline with live updates — no calls, no chasing.",
  },
  {
    n: "03",
    icon: "users",
    color: "rgba(200,255,60,0.15)",
    title: "Vendor orchestration",
    body:
      "Admins assign, monitor and reassign vendors with surgical precision. Maintenance becomes a system — not a scramble.",
  },
];

export default function Home() {
  const isAuthenticated = AuthService.isAuthenticated();

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div data-testid="home-page">
      <section className="sx-hero">
        <div className="sx-hero-orb a" />
        <div className="sx-hero-orb b" />
        <div className="sx-hero-orb c" />
        <div className="sx-page" style={{ paddingTop: 0 }}>
          <span className="sx-hero-eyebrow reveal d-1">Servexa · v2 — Maintenance OS</span>
          <h1 className="sx-hero-title reveal d-2">
            Maintenance,<br />
            <em>reimagined</em> for<br />
            modern campuses.
          </h1>
          <p className="sx-hero-lead reveal d-3">
            One luminous workspace where tenants log issues, admins dispatch vendors, and every request stays
            visible — from first ping to final fix. Built to keep buildings running without the bureaucracy.
          </p>
          <div className="sx-hero-cta reveal d-4">
            {isAuthenticated ? (
              <>
                <Link to="/Dashboard" className="sx-btn sx-btn-primary sx-btn-lg" data-testid="cta-dashboard">
                  Go to dashboard <Icon name="arrow-right" size={16} />
                </Link>
                <Link to="/AddRequest" className="sx-btn sx-btn-lg">
                  <Icon name="plus" size={16} /> New request
                </Link>
              </>
            ) : (
              <>
                <Link to="/Login" className="sx-btn sx-btn-primary sx-btn-lg" data-testid="cta-signin">
                  Sign in <Icon name="arrow-right" size={16} />
                </Link>
                <a href="#features" className="sx-btn sx-btn-lg">
                  How it works
                </a>
              </>
            )}
          </div>

          <div className="sx-hero-stats reveal d-5">
            <div className="sx-hero-stat">
              <div className="num">99.4%</div>
              <div className="lbl">Resolution rate</div>
            </div>
            <div className="sx-hero-stat">
              <div className="num">4.2h</div>
              <div className="lbl">Avg response</div>
            </div>
            <div className="sx-hero-stat">
              <div className="num">24/7</div>
              <div className="lbl">Live tracking</div>
            </div>
            <div className="sx-hero-stat">
              <div className="num">∞</div>
              <div className="lbl">Vendors managed</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="sx-page">
        <div className="sx-section-head reveal">
          <h2>
            How it <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--cyan)" }}>works</em>
            <span className="count">— three moves</span>
          </h2>
        </div>
        <div className="sx-features">
          {features.map((f, i) => (
            <div
              key={f.n}
              className={`sx-feature reveal d-${i + 1}`}
              onMouseMove={handleMouseMove}
              style={{ "--accent-color": f.color }}
              data-testid={`feature-${i}`}
            >
              <div className="sx-feature-num">{f.n} / 03</div>
              <div className="sx-feature-icon">
                <Icon name={f.icon} size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="sx-cta reveal" data-testid="bottom-cta">
            <h2>
              Ready to see it <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--lime)" }}>work?</em>
            </h2>
            <p>Sign in to submit and manage maintenance requests across your campus.</p>
            <Link to="/Login" className="sx-btn sx-btn-primary sx-btn-lg">
              Get started <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
