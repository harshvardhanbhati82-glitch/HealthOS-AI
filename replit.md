# HealthOS AI — District Health Management System

## Project Overview

A full-stack React/TypeScript healthcare dashboard for managing Primary Health Centres (PHCs) across Kanpur District, UP. Built with AI-assisted health analytics, interactive maps, and export capabilities.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + react-leaflet
- **PDF Export**: jsPDF + jspdf-autotable
- **Excel Export**: xlsx (SheetJS)
- **Icons**: Lucide React
- **State**: useState + localStorage (via custom hook)

## Project Structure

```
src/
  App.tsx                  — Router setup (5 routes)
  main.tsx                 — Entry point
  index.css                — Tailwind + global styles
  components/
    Layout.tsx             — Sidebar + Outlet wrapper
    Sidebar.tsx            — Navigation sidebar (blue gradient)
    PHCModal.tsx           — PHC detail modal (equipment, vaccination, AI rec)
  pages/
    Dashboard.tsx          — Stats overview, high-risk PHCs, AI predictions preview
    AICopilotPage.tsx      — AI chat with history, typing animation, quick prompts
    DistrictMapPage.tsx    — Leaflet map with clickable markers + popup
    ReportsPage.tsx        — Data table with PDF + Excel export
    PredictionsPage.tsx    — Risk gauge cards with confidence bars
  data/
    phcData.ts             — All mock data: 8 PHCs, predictions, AI responses
  types/
    index.ts               — TypeScript interfaces
  hooks/
    useLocalStorage.ts     — Typed localStorage hook with cross-tab sync
```

## Routes

| Path | Page |
|------|------|
| `/dashboard` | District Health Dashboard |
| `/copilot` | AI Copilot Chat |
| `/map` | District Map |
| `/reports` | Reports + Export |
| `/predictions` | AI Health Predictions |

## Running the App

```bash
npm run dev    # Dev server on port 5000
npm run build  # Production build
```

## Key Features

1. **AI Copilot** — Chat with persistent history in localStorage, typing animation, 5 quick prompts, keyword-matched mock responses
2. **District Map** — 8 clickable PHC markers (colour-coded by risk), popup with all stats, View Details button
3. **PHC Modal** — Equipment status, vaccination progress bars, medicine stock gauge, AI recommendation
4. **Reports** — Filter by risk level, export to PDF (jsPDF with autotable) or Excel (xlsx, 2 sheets)
5. **Predictions** — SVG risk gauge, confidence bar, expandable recommended action + affected areas

## User Preferences

- Do not redesign the dashboard layout
- Do not change routing structure
- Fix TypeScript errors — keep strict mode
- Use existing components and data — avoid duplication
- All data is mock/realistic for Kanpur District, UP
