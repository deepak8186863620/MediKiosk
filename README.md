# MediKiosk — Frontend

React frontend for the MediKiosk patient intake kiosk, built around the corrected
5-step journey: **Identify → Converse → Scan → Summarize & Route → Consult**.

> Note: this repo's original backend is Python/FastAPI, not Node/Express — that's
> fine. This frontend only needs REST endpoints at the paths listed below; it
> doesn't care what language serves them. A `vite` dev proxy is already set up
> to forward `/api/*` to `http://localhost:8000`.

## Setup

```bash
npm install
npm run dev
```

Patient kiosk: `http://localhost:5173/`
Doctor dashboard: `http://localhost:5173/doctor`

**Network note:** this scaffold was built in a sandboxed environment without
registry access, so `npm install` wasn't run end-to-end here. It's a standard
Vite + React + React Router + Axios project — `npm install` on your machine
will work normally.

## Structure

```
src/
  api/client.js          → every backend call the frontend makes, in one file
  context/SessionContext.jsx  → in-memory patient session (language, chat, docs, summary)
  components/
    StepRail.jsx          → the 5-step "Thread" progress rail
    MicButton.jsx          → dual-mode voice recording button
    RedFlagOverlay.jsx     → full-screen emergency interrupt
  pages/
    LanguageSelect.jsx     → Step 1a
    Consent.jsx            → Step 1b — ABHA/Aadhaar + audio-explained consent
    Conversation.jsx       → Step 2 — voice+tap adaptive interview, red-flag check per turn
    DocumentScan.jsx       → Step 3 — upload/OCR of prior prescriptions & reports
    SummaryAndWait.jsx     → Step 4 — AI summary review, routing, queue token
    DoctorDashboard.jsx    → Step 5 — doctor queue + editable summary
```

## Backend endpoints expected (see `src/api/client.js`)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/patient/verify` | ABHA/Aadhaar lookup, returns `{ patientId, sessionId }` |
| POST | `/api/asr/transcribe` | audio blob → `{ transcript }` |
| POST | `/api/gemini/next-question` | conversation history → `{ question, options, done }` |
| POST | `/api/clinical/answer` | Multilingual clinical conversation with Gemini → `{ question, options, red_flag, complete, summary }` |
| POST | `/api/triage/red-flag-check` | latest answer → `{ isEmergency, reason }` |
| POST | `/api/documents/upload` | file → `{ summary, date, abnormalValues }` |
| POST | `/api/history/summarize` | sessionId → `{ summary }` |
| POST | `/api/history/route` | sessionId → `{ token }` — pushes to HIS/ABDM |
| GET  | `/api/doctor/queue` | → list of waiting patients |
| GET  | `/api/doctor/summary/:sessionId` | → `{ summary }` |
| POST | `/api/doctor/summary/:sessionId/save` | doctor's edited summary |

Every screen has a local fallback if a call fails or the backend isn't running
yet, so the full patient journey is demoable end-to-end even before the
backend is wired up — useful for a hackathon walkthrough.

## Recent Features
- **Premium Frontend Portals**: Custom navigation for dedicated AYUSH and Clinical pathways, ensuring consistent, accessible, and responsive UI/UX across all registration and clinical history-taking flows.
- **Multilingual Support**: Fully integrated with the new `/api/clinical/answer` endpoint for real-time translation and clinical reasoning in 8+ Indian languages.

## Design notes

- Palette is a clinical sage/teal + clay-red for alerts — deliberately not the
  generic warm-cream template look.
- The step rail's vertical stitched line ("the Thread") is the signature
  element: it represents the single continuous patient record being sewn
  together from voice, touch, and paper documents — the fragmentation problem
  this product solves.
- Every touch target is ≥64px for kiosk/elderly usability; every question is
  answerable by voice OR tap, per the official PS requirement.
- The red-flag check fires after *every* patient turn, not just at the end of
  the conversation.
- The doctor's summary fields are `contentEditable` — the AI output is framed
  as an editable draft, never an autonomous diagnosis.
