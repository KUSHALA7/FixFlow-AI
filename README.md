# FixFlow AI

**Turn appliance problems into clear repair plans.**

FixFlow is an AI-powered appliance repair companion. It bridges the gap between vague customer complaints and actionable, structured repair workflows for technicians.

## The Problem
Customers often struggle to articulate appliance issues ("it's making a weird sound", "it doesn't work"). This leads to inefficient technician visits, lack of correct spare parts on the first trip, and overall poor customer experience.

## The Solution
FixFlow uses intelligent diagnosis to analyze the customer's input, map it to likely technical faults, assess repair readiness, and generate a comprehensive Job Card ready for dispatch. This MVP uses a deterministic, rule-based diagnosis engine that acts as a placeholder for a future LLM-based system.

## Key Features
- **Appliance Selection & Complaint Input:** Simple, focused interface for customers to describe issues.
- **Repair Readiness Score:** Evaluates how detailed and actionable the customer's input is.
- **Local Diagnosis Engine:** Instant, offline analysis matching keywords to faults, estimating costs, and predicting needed parts.
- **Parts Sourcing Decision:** Allows the customer to choose how parts should be handled (Tech, Customer, Inspect First).
- **Technician Job Card:** The final output – a clean, professional summary of the problem, diagnosis, parts strategy, and recommended actions.

## Architecture
- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS V4
- **State Management:** React `useState` for workflow progression
- **Diagnosis Logic:** Modularized in `src/lib/diagnosis.ts`. Currently uses a rule-based engine mapping keywords to `DiagnosisResult` objects.

### Diagnosis Engine Explanation
The MVP uses a deterministic fallback to mimic AI behavior without relying on external, paid APIs. 
It analyzes the chosen appliance and the complaint string for specific trigger keywords. If a match is found, it returns a structured diagnosis (Issue, Confidence, Causes, Actions, Parts, Cost). If no match is found, it provides a safe fallback recommending professional inspection.
This architecture makes it extremely easy to drop in an actual LLM API call in the future inside the `analyzeComplaint` function while keeping the UI unchanged.

## How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
```bash
npm run dev
```
Open your browser to the local URL provided (usually `http://localhost:5173`).

### Building for Production
```bash
npm run build
```
This will create a `dist` folder with the optimized production build.

### Running Tests
```bash
npm run test
```
This runs the Vitest test suite for the diagnosis engine.

## Known Limitations
- **Rule-Based Engine:** The current "AI" is a hardcoded set of rules. It is easily confused by complex sentence structures or typos not accounted for in its triggers.
- **Scope:** Only covers a handful of common appliances and very basic scenarios.
- **No Persistence:** Data is lost when the page is refreshed.
- **Informational Only:** The generated diagnosis is purely for informational and estimation purposes and does not replace a physical inspection by a qualified professional.

## Future AI Integration Plan
To upgrade this MVP to use real AI:
1. Introduce a backend (e.g., Node.js/Express or serverless functions) to securely hold API keys.
2. Replace the logic in `src/lib/diagnosis.ts` to make a fetch request to the new backend.
3. The backend will prompt an LLM (like OpenAI's GPT-4 or Anthropic's Claude) using a strict system prompt to always return the `DiagnosisResult` JSON structure based on the user's appliance and complaint.
4. The UI remains exactly the same, but the diagnosis becomes vastly more capable of understanding nuanced human input.