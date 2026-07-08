---
name: HealthOS Polish Session
description: Architecture decisions made during the final polish/stabilisation pass of HealthOS-AI
---

## Auth
Mock auth via `AuthContext` with localStorage persistence. Demo credentials hardcoded (admin@healthos.gov.in / Admin@123 and doctor@healthos.gov.in / Doctor@123). Login is a full-screen page rendered when `isAuthenticated` is false — no separate route needed.

## Dark Mode
`darkMode: 'class'` in `tailwind.config.js`. `ThemeContext` toggles `dark` class on `document.documentElement`. Theme validated at read-time (only accepts `'light'` or `'dark'`, not raw cast).

## Notifications
`NotificationContext` provides in-memory notification state with pre-seeded alerts. `NotificationDrawer` is a slide-in panel (not a page). Bell badge in `GlobalHeader` pulses when unread > 0.

## jsPDF type workaround
`doc.internal.getNumberOfPages()` does not exist in jsPDF's TS types. Safe workaround: `(doc.internal as any).getNumberOfPages?.() ?? 1` with eslint-disable comment. The `pageSize.getHeight()` method is available and typed.

**Why:** jsPDF ships incomplete internal typings; the function exists at runtime but not in .d.ts.

## React Router v7 warnings
Add `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` to `<BrowserRouter>` to suppress console warnings in v6.

## Lazy loading
All 5 pages use `React.lazy` + `Suspense` in App.tsx. PageLoader spinner is shown as fallback.

## Leaflet map popups
Leaflet popup content renders in a DOM outside React's dark-mode context — use Tailwind light-mode classes only inside `<Popup>` content (dark variants won't apply there).
