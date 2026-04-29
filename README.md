# Workforce Digest

A weekly Monday brief for SMB HR managers — built as a portfolio prototype.

It reads from HRIS data (BambooHR, Slack, Calendar) and surfaces 3–4 things worth acting on each week, with transparent rules, confidence scores, and a complete validation framework.

## What's interesting about it

This isn't a dashboard. It's an opinionated, calm, editorial-style weekly brief that demonstrates four ideas worth examining:

1. **Provenance is non-negotiable.** Every alert shows its data sources, the rule that fired it, and a link to the rule's source of truth.
2. **Differential diagnosis over confident verdicts.** For each alert, the system surfaces 2–3 competing explanations (real / seasonal / noise) and lets the human decide.
3. **Validation without grading homework.** Three rings — cross-signal corroboration, outcome-based checks, and counterfactual holdouts — keep the system honest without burdening the user.
4. **Evals as a first-class artifact.** Ten golden test cases run before deployment, with the suite designed to grow as the product matures.

## Live demo

Deployed on Vercel: *(URL will appear here once deployed)*

## What's in the repo

| File | What it is |
|---|---|
| `src/App.jsx` | The full prototype — main brief, signal book, eval dashboard, validation page |
| `src/main.jsx` | React entry point |
| `index.html` | HTML shell |
| `evals.py` | Python eval suite — 10 golden test cases, runnable locally |
| `package.json`, `vite.config.js` | Build configuration |

## Running locally

```bash
npm install
npm run dev
```

## Running the eval suite

```bash
python3 evals.py
```

## What this prototype is not

- Not connected to real HRIS data — all scenarios are mocked
- Not a validated product — thresholds are illustrative defaults pending pilot data
- Not a complete eval suite — production would have 50–100 test cases, not 10

## The honest take on what's missing

Anyone reviewing this seriously should ask:

- Where do the thresholds come from? (Documented in `Signal Book` — some from research, some heuristic, some flagged as the weakest links)
- How do you know an alert is right? (Documented in `How we know we're right` — three validation rings with explicit acknowledgment of what each can and can't catch)
- How do you avoid grading-homework UX? (The user never marks alerts; validation comes from independent data, time-delayed outcomes, and randomized holdouts)
- What about the prevention paradox? (Named explicitly — when an alert fires and the manager intervenes successfully, you can never be sure if the intervention caused the prevention)

## Built with

React, Vite, Lucide icons. Designed in a single artifact iteration.
