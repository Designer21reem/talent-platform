# THE VALUE's GOT TALENT — Candidate Talent Platform

A modern, fully responsive web platform built for **THE VALUE** that allows candidates to upload their CV, build a professional CV from scratch, take a skill assessment, and view a personalized skills dashboard.

## Live Demo

[talent-platform-xi.vercel.app](https://talent-platform-xi.vercel.app)

## Backend Status

- **Google Sign-In** — signs candidates in with their Google account and gates the whole site behind it. The ID token is verified server-side: the frontend POSTs it to `${NEXT_PUBLIC_BACKEND_URL}/auth/google`, which returns a JWT and the user profile. The JWT is stored and sent as `Authorization: Bearer …` on subsequent API calls.
- **CV file upload** — `Upload CV` requests a presigned URL from `${NEXT_PUBLIC_BACKEND_URL}/generate-upload-url` (JWT required), then `PUT`s the file directly to S3.
- **CV Builder submission** — the builder's form data is mapped to the `CVExtractedData` JSON contract (see `src/lib/cvMapper.js`) but is not yet POSTed anywhere — the receiving endpoint hasn't been specified yet. It's saved to `localStorage` in the meantime, same as before.
- **Consent checkboxes** — captures a candidate's consent (terms, recruiter visibility). Not yet sent to the backend — kept in local state / `localStorage` only.
- Every auth and upload step logs to the browser console (prefixed `[Auth]`, `[AuthGate]`, `[Upload]`) so a broken hookup is easy to diagnose from devtools.

---

## Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero section, features overview, stats, and call-to-action |
| **About** | THE VALUE organization info, mission, vision, and founder profile |
| **Upload CV** | Drag-and-drop upload (PDF/DOCX/JPG/PNG, max 5 MB) straight to S3 via a presigned URL — no client-side parsing |
| **Build CV** | 4-step wizard (Personal Info → Education & Certifications → Experience & Projects → Skills & Languages) with live preview and one-click PDF download |
| **Assessment** | Phone-gated skill assessment with 6 questions — each question must be answered before moving to the next, dot navigation is locked for unanswered questions |
| **Dashboard** | Personalized skills report with overall score, skill breakdown, strengths, and areas for improvement |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** (App Router) | Framework — routing, static export, layouts |
| **React 19** | UI component model, hooks, state management |
| **Tailwind CSS v4** | Utility-first styling with `@theme` color tokens |
| **Framer Motion** | Page animations, hover effects, transitions |
| **Lucide React** | Icon library |
| **html-to-image** | Captures DOM element as image for PDF export |
| **jsPDF** | Generates a real PDF file and triggers browser download |
| **clsx + tailwind-merge** | Conditional class merging utility |
| **localStorage** | Client-side data persistence (CV data, assessment answers) |
| **JavaScript (ES Modules)** | No TypeScript — pure JS with JSX |

---

## Features

- Fully responsive — works on all screen sizes
- Real backend for auth and file storage (see [Backend Status](#backend-status)); CV/assessment data still lives in `localStorage` until a save endpoint exists
- **Centralized theme system** — change any color in one place, every component updates automatically
- **PDF export** — download your built CV as a PDF directly from the browser
- Reusable component library (`Button`, `Input`, `Card`, `Badge`, `ProgressBar`, `Select`, `Textarea`)
- Phone number gate for assessment access — auto-filled if CV was uploaded or built
- Assessment enforces sequential answering — cannot skip questions
- Mock dashboard fallback when no assessment data exists
- `console.log` at every key step for easy debugging
- Deployed on Vercel (zero config)

---

## Assumptions Made

- **Partial backend** — Google Sign-In and CV file upload now go through a real backend (FastAPI on EC2 + S3, see [Backend Status](#backend-status)). CV Builder data and assessment answers still persist to `localStorage` only, pending a save endpoint.
- **No client-side CV parsing** — `Upload CV` no longer reads the file's contents in the browser at all; the file is uploaded to S3 as-is and any extraction (name, email, phone, …) happens server-side.
- **Assessment questions are static** — The 6 skill questions are hardcoded. The assumption is that a fixed question set is sufficient for a candidate-facing demo; a production system would pull questions from an API.
- **Phone number is the identity key** — The assessment gate uses the phone number as the sole identifier. This was the simplest unique-enough value available without requiring sign-up.
- **Dashboard score is calculated client-side** — Scores are derived from the stored assessment answers using a local formula. No server-side validation or scoring engine is assumed.
- **Mock dashboard for unanswered assessment** — If a user visits the dashboard without completing the assessment, sample data is shown rather than an empty or broken state, to demonstrate the UI.
- **Single-user, single-session** — `localStorage` holds one CV and one assessment result at a time. No multi-profile support is assumed.
- **Static export only** — The app is deployed as a fully static site (`output: 'export'`) which rules out server-side rendering and API routes.
- **File size limit is 5 MB** — Enforced client-side before requesting a presigned upload URL, matching the backend's own limit.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Requires `.env.local` with `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_BACKEND_URL` set (see `src/lib/api.js` / `src/lib/auth.jsx`). The Google Client ID's **Authorized JavaScript origins** must include whatever origin you're testing from (e.g. `http://localhost:3000`) or the sign-in button will fail with an origin error — use the "Skip sign-in" dev bypass in the meantime (it won't produce a real JWT, so upload will still fail until you sign in for real).

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Master theme variables — edit here to retheme everything
│   ├── page.jsx          # Landing page
│   ├── about/            # About THE VALUE page
│   ├── upload-cv/        # Upload CV — S3 presigned upload flow
│   ├── build-cv/         # CV Builder wizard
│   ├── assessment/       # Skill assessment
│   └── dashboard/        # Skills dashboard
├── components/
│   ├── ui/               # Reusable UI components (Button, Input, Card, Badge…)
│   ├── layout/           # Header, Footer, Container
│   ├── cv-builder/       # CV wizard step components + live preview
│   ├── assessment/       # Question card component
│   ├── dashboard/        # Skill progress card
│   └── landing/          # Feature card component
└── lib/
    ├── storage.js         # localStorage utilities
    ├── api.js              # BACKEND_URL config
    ├── auth.jsx            # Google Sign-In + backend JWT
    ├── cvMapper.js         # CV Builder state -> CVExtractedData JSON
    ├── assessmentQuestions.js
    ├── mockDashboard.js   # Dashboard data builder + scoring
    └── utils.js           # cn() helper
```
