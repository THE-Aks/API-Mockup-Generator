# API Mockup Generator

An autonomous, context-aware mock API ecosystem — built for a one-day high school hackathon.

Describe an API in plain English, paste an OpenAPI spec, or import a Postman collection, and instantly get a working mock REST API: realistic fake data, live endpoints, a Postman-style tester, schema validation, a real-time telemetry feed, and auto-generated client SDKs (JavaScript, TypeScript, and React).

No backend. No build step. No dependencies. Just open `index.html` in a browser.

---

## The Problem

Frontend developers often have to start building before the backend API is ready. The usual fix — hand-writing fake JSON — is slow and breaks the moment the real API changes.

## The Solution

This tool generates a fully working mock API in seconds, from whatever you already have: a plain-English description, an OpenAPI spec, or a Postman collection. It gives you realistic data, testable endpoints, and ready-to-use frontend code — all in one place.

---

## Features

- **Natural Language Parser** — describe your API in plain English, get an inferred schema
- **OpenAPI Import** — paste a spec (JSON), auto-extract schemas and fields
- **Postman Import** — paste a collection, auto-detect all requests, even nested ones
- **Schema Builder** — a live, editable table of fields, types, and requirements
- **Mock Data Generator** — realistic fake values (names, emails, prices, UUIDs, dates, etc.) for 1–100 objects
- **JSON Viewer** — syntax-highlighted, with copy and download
- **Auto-Generated Endpoints** — GET / POST / PUT / DELETE for your resource
- **API Tester** — a mini Postman built in, to send simulated requests
- **Live Telemetry Feed** — logs every request with status, latency, size, and validation result
- **Schema Validation** — flags missing required fields in real time
- **Client SDK Generator** — copy-paste-ready JavaScript, TypeScript, or React client code
- **Responsive, dark-mode UI** — works on desktop, tablet, and mobile

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks, no libraries)

## How to Run Locally

1. Clone or download this repository.
2. Make sure `index.html`, `style.css`, and `script.js` are all in the same folder.
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

That's it — no `npm install`, no server, no build step.

```
git clone <your-repo-url>
cd API-Mockup-Generator
open index.html   # or just double-click it
```

---

## Project Structure

```
API-Mockup-Generator/
├── index.html   # structure and layout
├── style.css    # dark, glassmorphic developer-tool theme
└── script.js    # all application logic (parsing, generation, tester, SDKs)
```

---

## Try It

Click **"View Demo"** on the landing page for a guided, self-running walkthrough using a sample bookstore API.

---

## Future Improvements

- YAML support for OpenAPI specs (currently JSON only)
- Support for importing multiple schemas from one spec
- Persistent storage so a generated API survives a page refresh
- Optional real hosted mock server via a serverless backend
- AI Integration

---

## Built By

Built solo in one day for a high school hackathon.
