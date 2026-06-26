# THE VALUE's GOT TALENT — Candidate Talent Platform

A modern, fully responsive web platform built for **THE VALUE** that allows candidates to upload their CV, build a professional CV from scratch, take a skill assessment, and view a personalized skills dashboard.

## Live Demo

[talent-platform-xi.vercel.app](https://talent-platform-xi.vercel.app)

---

## Brand & Theme System

The platform uses a **centralized CSS variable theme** — every color across the entire site is controlled from a single block in `src/app/globals.css`. To change any color, update one variable and every component updates automatically.

**Logo:** `public/Logo (1).png`

### Changing colors

Open `src/app/globals.css` and edit any variable inside `:root`:

```css
:root {
  /* Backgrounds */
  --tv-bg:        #080808;   /* main page background */
  --tv-surface:   #111111;   /* card / panel background */
  --tv-surface-2: #1e1e1e;   /* elevated elements inside cards */

  /* Brand / Gold — change this to retheme the entire accent color */
  --tv-gold:       #c99b25;  /* primary gold — buttons, borders, icons */
  --tv-gold-light: #d4aa3a;  /* lighter gold — button hover state */
  --tv-gold-dark:  #a67b18;  /* darker gold — button active/pressed state */

  /* Typography */
  --tv-title:   #f2eee6;     /* main headings h1 / h2 / h3 */
  --tv-body:    #e2ddd5;     /* paragraphs and card body text */
  --tv-muted:   #dddddd;     /* labels / secondary text */
  --tv-subtle:  #9a9a9a;     /* captions, hints, timestamps */

  /* Form Fields — controls input/textarea/select in ALL states */
  --tv-field-bg:           #161616;  /* field background */
  --tv-field-border:       #2e2e2e;  /* border — normal state */
  --tv-field-border-hover: #c99b25;  /* border — hover state */
  --tv-field-border-focus: #c99b25;  /* border — focused state */
  --tv-field-text:         #f2eee6;  /* text typed inside the field */
  --tv-field-placeholder:  #666666;  /* placeholder text */
  --tv-field-label:        #e2ddd5;  /* label above the field */
}
```

---

## Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero section, features overview, stats, and call-to-action |
| **About** | THE VALUE organization info, mission, vision, and founder profile |
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
| **Tailwind CSS v4** | Utility-first styling with `@theme` color tokens |
| **Framer Motion** | Page animations, hover effects, transitions |
| **Lucide React** | Icon library |
| **pdfjs-dist** | Client-side PDF text extraction (no backend needed) |
| **mammoth** | Client-side DOCX text extraction |
| **html-to-image** | Captures DOM element as image for PDF export |
| **jsPDF** | Generates a real PDF file and triggers browser download |
| **clsx + tailwind-merge** | Conditional class merging utility |
| **localStorage** | Client-side data persistence (CV data, assessment answers) |
| **JavaScript (ES Modules)** | No TypeScript — pure JS with JSX |

---

## Features

- Fully responsive — works on all screen sizes
- No backend required — all data stored in `localStorage`
- **Centralized theme system** — change any color in one place, every component updates automatically
- **PDF parsing** — upload a CV and name, email, phone are extracted automatically in the browser
- **PDF export** — download your built CV as a PDF directly from the browser
- Reusable component library (`Button`, `Input`, `Card`, `Badge`, `ProgressBar`, `Select`, `Textarea`)
- Phone number gate for assessment access — auto-filled if CV was uploaded or built
- Assessment enforces sequential answering — cannot skip questions
- Mock dashboard fallback when no assessment data exists
- `console.log` at every key step for easy debugging
- Deployed on Vercel (zero config)

---

## Assumptions Made

- **No backend / no auth** — The brief did not specify a server or user accounts, so all data is persisted in `localStorage`. A real product would use a database and authentication layer.
- **CV parsing is best-effort** — PDF and DOCX text extraction relies on pattern matching (regex) for name, email, and phone. It works well on standard CV formats but may miss fields in heavily styled or scanned documents. The user is always shown the parsed result and can edit before saving.
- **Assessment questions are static** — The 6 skill questions are hardcoded. The assumption is that a fixed question set is sufficient for a candidate-facing demo; a production system would pull questions from an API.
- **Phone number is the identity key** — The assessment gate uses the phone number as the sole identifier. This was the simplest unique-enough value available without requiring sign-up.
- **Dashboard score is calculated client-side** — Scores are derived from the stored assessment answers using a local formula. No server-side validation or scoring engine is assumed.
- **Mock dashboard for unanswered assessment** — If a user visits the dashboard without completing the assessment, sample data is shown rather than an empty or broken state, to demonstrate the UI.
- **Single-user, single-session** — `localStorage` holds one CV and one assessment result at a time. No multi-profile support is assumed.
- **Static export only** — The app is deployed as a fully static site (`output: 'export'`) which rules out server-side rendering and API routes. This matches the no-backend assumption.
- **File size limit is 10 MB** — Chosen as a reasonable upper bound for CV files; no server upload means the entire file is processed in the browser.

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
├── app/
│   ├── globals.css       # Master theme variables — edit here to retheme everything
│   ├── page.jsx          # Landing page
│   ├── about/            # About THE VALUE page
│   ├── upload-cv/        # Upload CV + PDF parsing flow
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
    ├── cvParser.js        # Client-side PDF/DOCX text extraction
    ├── assessmentQuestions.js
    ├── mockDashboard.js   # Dashboard data builder + scoring
    └── utils.js           # cn() helper
public/
├── Logo (1).png           # THE VALUE brand logo
└── founder-aws-fawzi.jpg  # Founder photo (About page)
```
