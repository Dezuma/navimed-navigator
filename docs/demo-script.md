# NaviMed Demo Script (3-5 Minutes)

## 1) Opening (20-30 seconds)

"NaviMed is a patient navigation experience that turns static healthcare dashboards into an active assistant.  
In this MVP, we focus on logistics that patients struggle with most: scheduling, prep, check-in, and understanding what comes next."

## 2) Problem Framing (30-45 seconds)

"Most patient portals are reactive and fragmented.  
Patients bounce between appointment systems, unclear instructions, and post-visit confusion.  
The result is missed visits, lower engagement, and more manual coordination for care teams."

## 3) Product Positioning (20-30 seconds)

"NaviMed solves this by giving patients a guided mobile flow with an embedded assistant named Navi.  
Important scope note: Navi is for care logistics and communication support, not clinical diagnosis or emergency triage."

## 4) Live Walkthrough (2-3 minutes)

### A. Orientation and Trust

- Open at `https://dezuma.github.io/navi-med/` (or deep link `#/splash`)
- Show splash and onboarding sequence:
  - Fast scheduling
  - Smarter visit prep
  - Staying on track
- Move through auth screens and privacy/HIPAA messaging

Narration:
"We start with clarity and trust. Patients immediately understand what NaviMed helps with and what it does not."

### B. Home + Scheduling

- Land on Home dashboard (`Hello, Michael`)
- Highlight next visit card and quick actions
- Tap **Schedule or reschedule**
- Pick date/time and confirm booking

Narration:
"This flow removes friction from the highest-frequency task: changing or booking a visit."

### C. Ask Navi + Generated Responses

- Return to Home or Visit Detail
- Use **Ask Navi** with a prompt like:
  - "Help me prepare for my visit"
  - "Reschedule my appointment"
- Show generated response card and follow-up chips

Narration:
"Navi returns actionable guidance and follow-up steps. If the remote AI endpoint is unavailable, we gracefully fall back so the experience stays reliable during demos and in production-safe mode."

### D. Appointments + Visit Context

- Open Appointments list
- Open Visit Detail
- Show check-in entry and context-aware Ask Navi prompts

Narration:
"The assistant is context-aware: home, upcoming visit, and post-visit surfaces each guide the next right action."

## 5) Reliability, Security, and Data Handling (45-60 seconds)

"This MVP is built to be dependable and safe to demo:

- Static deployment on GitHub Pages with deep-link-safe routing.
- AI response pipeline supports timeout handling, validation, and deterministic fallback.
- Optional callback logging for observability using a local mock API.
- Data minimization and clear warnings: no PHI in demo mode.
- Any `VITE_` value is treated as non-secret by design; production secret handling belongs on a server-side gateway."

## 6) Business Value / Why It Matters (30-45 seconds)

"NaviMed can improve patient completion of pre-visit tasks, reduce no-shows through smoother scheduling, and lower support burden for staff.  
It creates a foundation for a more proactive patient journey without overpromising clinical automation."

## 7) Close + Ask (20-30 seconds)

"Today you saw a working MVP aligned to real patient flow screens and deployable publicly for stakeholder review.  
Our next phase is backend integration for secure provider data and production-grade analytics/audit controls."

Suggested close:
"We’re looking for pilot partners and implementation feedback to validate outcomes in real clinic workflows."

---

## Optional Backup Demo Prompts

- "Schedule me for the earliest available slot"
- "What do I need to bring to my visit?"
- "Summarize my last visit and next steps"
- "Help me check in"

