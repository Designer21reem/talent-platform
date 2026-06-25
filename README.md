# TalentHub — Candidate Talent Platform

A modern, fully responsive web platform that allows candidates to upload their CV, build a professional CV from scratch, take a skill assessment, and view a personalized skills dashboard.

## Live Demo

[talent-platform-xi.vercel.app](https://talent-platform-xi.vercel.app)

---

## Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero section, features overview, stats, and call-to-action |
| **Upload CV** | Drag-and-drop file uploader with progress simulation |
| **Build CV** | 7-step wizard (Personal Info → Education → Experience → Skills → Languages → Certifications → Projects) with live preview and PDF download |
| **Assessment** | Phone-gated skill assessment with 6 questions across multiple categories |
| **Dashboard** | Personalized skills report with scores, strengths, and areas for improvement |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** (App Router) | Framework — routing, static export, layouts |
| **React 19** | UI component model, hooks, state management |
| **Tailwind CSS v4** | Utility-first styling, responsive design |
| **Framer Motion** | Page animations, hover effects, transitions |
| **Lucide React** | Icon library |
| **clsx + tailwind-merge** | Conditional class merging utility |
| **localStorage** | Client-side data persistence (CV data, assessment answers) |
| **JavaScript (ES Modules)** | No TypeScript — pure JS with JSX |

---

## Features

- Fully responsive — works on all screen sizes
- No backend required — all data stored in `localStorage`
- PDF export — download your built CV directly from the browser
- Reusable component library (`Button`, `Input`, `Card`, `Badge`, `ProgressBar`, `Select`, `Textarea`)
- Phone number gate for assessment access
- Mock dashboard fallback when no assessment data exists
- `console.log` at every key step for easy debugging

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.jsx          # Landing page
│   ├── upload-cv/        # Upload CV page
│   ├── build-cv/         # CV Builder wizard
│   ├── assessment/       # Skill assessment
│   └── dashboard/        # Skills dashboard
├── components/
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Header, Footer, Container
│   ├── cv-builder/       # CV wizard step components
│   ├── assessment/       # Question card component
│   ├── dashboard/        # Skill progress card
│   └── landing/          # Feature card component
├── hooks/
│   └── useLocalStorage.js
└── lib/
    ├── storage.js         # localStorage utilities
    ├── assessmentQuestions.js
    ├── mockDashboard.js   # Dashboard data builder
    └── utils.js           # cn() helper
```
