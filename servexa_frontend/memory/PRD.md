# Servexa — PRD

## Original Problem Statement
> Overhaul the entire website to make it look absolutely stunning and amazing while keeping all functionality. Optimize the mobile version to be as beautiful (or more) than desktop. "The greatest the world has ever seen."

## App Overview
Servexa is a maintenance-request management platform for residential/campus properties.
Tenants submit service requests; admins/privileged users assign vendors and track progress.

## Tech Stack
- **Frontend**: React 19 + Vite 8, react-router-dom v7, react-select, axios
- **Auth**: JWT (token in localStorage, role-aware via `AuthService`)
- **Backend**: External REST API consumed via `VITE_API_BASE_URL` (separate service — not in this repo)

## User Personas
- **ADMIN** — Full access (manage tenants, vendors, requests, registrations, deletions).
- **PRIVILEGED_USER** — Manage tenants/vendors/requests, register tenants only.
- **TENANT** — View & submit own requests, see own profile in nav.

## Core Requirements (static)
- Auth-gated routes (login/register, role-protected dashboard sections).
- Tenant CRUD, Vendor CRUD, Service Request CRUD.
- Search & filter dashboards by status, urgency, request ID, tenant name.
- Modal-based detail/edit/delete confirmation flows.
- Fully responsive across mobile / tablet / desktop.

## Implemented (2026-01)
### Visual & UX overhaul (all pages)
- Brand-new bold & futuristic design system (`index.css` + `App.css`):
  custom color tokens (deep midnight + electric cyan / neon violet / acid lime / hot pink),
  Bricolage Grotesque + Inter Tight + JetBrains Mono + Instrument Serif type stack,
  animated gradient orbs, grain overlay, custom scrollbar, custom selection.
- Floating glassmorphic navbar with animated gradient logo, role pill, mobile drawer.
- Home: cinematic hero with shimmering italic accent, marquee stats, magnetic-glow feature cards, animated border CTA.
- Dashboard: neon stat cards (status + urgency) with click-to-filter, redesigned tables, status/urgency pill badges, redesigned modals.
- Tenants & Vendors: glass page-headers, avatar initials, color-coded service types, modal redesigns.
- Auth (Login/Register): editorial split-screen with serif italic gradient accent and glowing primary CTA.
- All Add/Edit forms (Request, Tenant, Vendor): dark glass forms with pill-style radio groups and dark-themed react-select.
- Mobile: tables collapse to label/value cards, navbar shrinks to hamburger drawer, hero & stats stack cleanly.
- All animations are CSS-only (slide-up reveals with staggered delays, floating orbs, pulse glow, shimmer, border-flow, scale-in modals) — `prefers-reduced-motion` respected.
- Functional surface preserved: every API call, role-gated behavior, modal flow, route, and form submission untouched.

## Backlog (prioritized)
- **P1**: Skeleton loaders for table fetches; toast notifications instead of inline alerts.
- **P1**: Empty-state illustrations on Dashboard / Tenants / Vendors.
- **P2**: Saved filters & column sorting on dashboards.
- **P2**: Dark/light mode toggle (currently dark only).
- **P2**: Activity timeline per request (status history).
- **P3**: Per-vendor performance analytics page.

## Notes
- The frontend talks to an external backend via `VITE_API_BASE_URL`; live data wasn't testable in the preview pod (no backend present), so this overhaul is visual + structural only — all API call signatures are untouched.
