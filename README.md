# TalentHub — Candidate Talent Platform

A modern, fully responsive web platform that allows candidates to upload their CV, build a professional CV from scratch, take a skill assessment, and view a personalized skills dashboard.

## Live Demo

[talent-platform-xi.vercel.app](https://talent-platform-xi.vercel.app)

---

## Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero section, features overview, stats, and call-to-action |
| **Upload CV** | Drag-and-drop PDF upload with automatic text extraction — name, email, and phone are parsed from the file and saved directly to the profile |
| **Build CV** | 7-step wizard (Personal Info → Education → Experience → Skills → Languages → Certifications → Projects) with live preview and one-click PDF download |
| **Assessment** | Phone-gated skill assessment with 6 questions — each question must be answered before moving to the next, dot navigation is locked for unanswered questions |
| **Dashboard** | Personalized skills report with overall score, skill breakdown, strengths, and areas for improvement |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** (App Router) | Framework — routing, static export, layouts |
| **React 19** | UI component model, hooks, state management |
| **Tailwind CSS v4** | Utility-first styling, responsive design |
| **Framer Motion** | Page animations, hover effects, transitions |
| **Lucide React** | Icon library |
| **pdfjs-dist** | Client-side PDF text extraction (no backend needed) |
| **clsx + tailwind-merge** | Conditional class merging utility |
| **localStorage** | Client-side data persistence (CV data, assessment answers) |
| **JavaScript (ES Modules)** | No TypeScript — pure JS with JSX |

---

## Features

- Fully responsive — works on all screen sizes
- No backend required — all data stored in `localStorage`
- **PDF parsing** — upload a CV and name, email, phone are extracted automatically in the browser
- **PDF export** — download your built CV as a PDF directly from the browser
- Reusable component library (`Button`, `Input`, `Card`, `Badge`, `ProgressBar`, `Select`, `Textarea`)
- Phone number gate for assessment access — auto-filled if CV was uploaded or built
- Assessment enforces sequential answering — cannot skip questions
- Mock dashboard fallback when no assessment data exists
- `console.log` at every key step for easy debugging
- Deployed on Vercel (zero config) and GitHub Pages (via GitHub Actions)

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
│   ├── upload-cv/        # Upload CV + PDF parsing flow
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
    ├── cvParser.js        # Client-side PDF text extraction and field parsing
    ├── assessmentQuestions.js
    ├── mockDashboard.js   # Dashboard data builder
    └── utils.js           # cn() helper
```
