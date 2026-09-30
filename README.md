# 🌐 MCMS Frontend — Crisis Operations Dashboard

> Next.js 16 web application for the **Multilingual Crisis Management System (MCMS)**.  
> A real-time operations dashboard that visualises AI-classified crisis reports, interactive maps, analytics charts, and an admin panel for emergency coordinators.

![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Project Structure](#project-structure)
- [Related Repositories](#related-repositories)
- [License](#license)

---

## Overview

This frontend serves as the **public-facing and admin interface** for the MCMS platform. It provides:

- **Public Crisis Reporting** — citizens can submit disaster reports in any language
- **Operations Dashboard** — live KPIs, recent crisis feed, and system status overview
- **Interactive Crisis Map** — Leaflet-based map with geocoded incident markers
- **Analytics Hub** — interactive Recharts-powered charts for urgency distribution, incident trends, and regional breakdowns
- **Disaster Browser** — filterable list of all active crisis reports with detailed cards
- **Admin Panel** — JWT-authenticated interface for managing report statuses, reviewing AI classifications, and coordinating responders
- **External Disaster Feed** — real-time GDACS and NewsAPI intelligence sidebar

---

## Screenshots

> Screenshots coming soon — run the project locally to see the full interface!

---

## Key Features

| Feature | Description |
|---|---|
| **Multilingual Report Submission** | Free-text crisis reporting form that accepts any language; the backend AI pipeline handles translation and classification |
| **Real-Time Dashboard** | Live KPI stat cards showing total reports, active incidents, urgency breakdown, and system health |
| **Interactive Crisis Map** | Leaflet map with clustered markers for geocoded disaster locations; click markers for report details |
| **Analytics Charts** | Recharts-powered visualizations: urgency distribution donut, crisis type bar chart, timeline trends, and more |
| **Report Cards** | Rich cards showing crisis type, urgency badge, credibility score, AI confidence, extracted locations, and affected communities |
| **Urgency Badges & Gauges** | Visual urgency indicators with colour-coded badges (🟢 Low, 🟠 Medium, 🔴 High) and gauge components |
| **Credibility Indicators** | Displays credibility score, label, and source evidence (GDACS match, news headline, similar report count) |
| **External Disaster Feed** | Sidebar component showing live GDACS alerts and NewsAPI disaster headlines |
| **Admin Authentication** | JWT-based login page for emergency coordinators |
| **Report Management** | Admin can update report status (Pending → Active → In Progress → Resolved), view detailed AI analysis, and delete reports |
| **Responder Tracking** | Assign and manage emergency responders per incident |
| **Responsive Design** | Fully responsive layout with sidebar navigation optimized for desktop and tablet |
| **Dark Navigation** | Professional sidebar with dark theme for focused operations use |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI Library | React 19.2 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Maps | Leaflet 1.9 + React integration |
| Charts | Recharts 3.10 |
| Icons | Lucide React 1.33 |
| Linting & Formatting | Biome 2.2 |
| Build Tool | Next.js built-in (Turbopack) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- The [Node.js backend](../mcms-backend-ts) running on port `5000`
- The [Python AI service](../mcms-backend-py) running on port `8000`

### Installation

```bash
# Clone the repository
git clone https://github.com/SandaruDulneth/mcms-frontend-ts.git
cd mcms-frontend-ts

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application starts on **`http://localhost:3000`** by default.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Next.js dev server with hot reload |
| `build` | `npm run build` | Create production build |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run Biome linter |
| `format` | `npm run format` | Auto-format code with Biome |

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero section, feature grid, and quick access cards |
| `/dashboard` | Operations Dashboard | Live KPIs, recent reports feed, stat cards |
| `/add-report` | Submit Report | Public crisis report submission form |
| `/reports` | Report Browser | Filterable list of all crisis reports |
| `/disasters` | Disaster View | Browse and filter active crisis reports by category |
| `/map` | Crisis Map | Interactive Leaflet map with geocoded incident markers |
| `/analytics` | Analytics Hub | Charts and data visualizations for disaster intelligence |
| `/admin` | Admin Panel | Report management interface (requires authentication) |
| `/admin/login` | Admin Login | JWT-based authentication page |

---

## Components

### Core Components

| Component | Description |
|---|---|
| `Sidebar` | Dark-themed navigation sidebar with route links and icons |
| `Topbar` | Top navigation bar with page title |
| `ReportCard` | Rich card displaying a crisis report with all AI analysis results |
| `ReportForm` | Multi-field form for submitting crisis reports |
| `StatCard` | KPI stat card with icon, value, and trend indicator |
| `UrgencyBadge` | Colour-coded urgency level badge |
| `UrgencyGauge` | Visual gauge component for urgency confidence |

### Map Components

| Component | Description |
|---|---|
| `DisasterMap` | Leaflet map integration with disaster markers |
| `MapClient` | Client-side wrapper for Leaflet (avoids SSR issues) |

### Intelligence Components

| Component | Description |
|---|---|
| `ExternalDisasterFeed` | Live feed of GDACS alerts and NewsAPI disaster headlines |
| `ResponderButton` | Action button for responder assignment |
| `ResponderForm` | Form for adding responders to a report |
| `ResponderList` | List view of assigned responders |

### Admin Components

| Component | Description |
|---|---|
| `ReportOverviewModal` | Detailed report modal with full AI analysis, credibility sources, and status management |
| Admin analytics components | Charts and tables for administrative oversight |

---

## Project Structure

```
mcms-frontend-ts/
├── public/                         # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with sidebar navigation
│   │   ├── page.tsx                # Landing page (hero + feature grid)
│   │   ├── globals.css             # Global styles and Tailwind imports
│   │   ├── add-report/
│   │   │   └── page.tsx            # Public crisis report form
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Operations dashboard
│   │   ├── reports/
│   │   │   └── page.tsx            # Report browser
│   │   ├── disasters/
│   │   │   └── page.tsx            # Disaster category view
│   │   ├── map/
│   │   │   └── page.tsx            # Interactive crisis map
│   │   ├── analytics/
│   │   │   └── page.tsx            # Analytics hub
│   │   └── admin/
│   │       ├── page.tsx            # Admin panel
│   │       └── login/
│   │           └── page.tsx        # Admin login
│   ├── components/
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── Topbar.tsx              # Top navigation bar
│   │   ├── ReportCard.tsx          # Crisis report card
│   │   ├── ReportForm.tsx          # Report submission form
│   │   ├── StatCard.tsx            # KPI stat card
│   │   ├── UrgencyBadge.tsx        # Urgency level badge
│   │   ├── UrgencyGauge.tsx        # Urgency confidence gauge
│   │   ├── DisasterMap.tsx         # Leaflet map component
│   │   ├── MapClient.tsx           # Client-side map wrapper
│   │   ├── ExternalDisasterFeed.tsx # GDACS/NewsAPI feed
│   │   ├── ResponderButton.tsx     # Responder action button
│   │   ├── ResponderForm.tsx       # Responder assignment form
│   │   ├── ResponderList.tsx       # Responder list view
│   │   ├── admin/                  # Admin-specific components
│   │   ├── analytics/              # Chart components
│   │   ├── dashboard/              # Dashboard widgets
│   │   └── login/                  # Login form components
│   ├── lib/                        # API client utilities
│   └── types/                      # TypeScript type definitions
├── biome.json                      # Biome linter/formatter config
├── next.config.ts                  # Next.js configuration
├── postcss.config.mjs              # PostCSS + Tailwind config
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

---

## Related Repositories

| Repository | Description |
|---|---|
| [mcms-backend-ts](../mcms-backend-ts) | Node.js/Express REST API — report management, credibility scoring, GDACS/NewsAPI integration |
| [mcms-backend-py](../mcms-backend-py) | FastAPI AI micro-service — 3-model NLP pipeline with multilingual translation |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCMS Platform                            │
│                                                                 │
│  ┌──────────────┐     ┌──────────────────┐    ┌──────────────┐  │
│  │   Frontend   │────▶│   Node.js API    │───▶│  Python AI   │  │
│  │  (this repo) │     │   (Express)      │    │  (FastAPI)   │  │
│  │              │◀────│                  │◀───│              │  │
│  │  Next.js 16  │     │  Credibility     │    │  3 ML Models │  │
│  │  React 19    │     │  GDACS + NewsAPI │    │  Translation │  │
│  │  Leaflet     │     │  MongoDB         │    │  spaCy NER   │  │
│  │  Recharts    │     │  JWT Auth        │    │  Gazetteer   │  │
│  └──────────────┘     └──────────────────┘    └──────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## License

This project is part of a Final Year Project at the University level.

