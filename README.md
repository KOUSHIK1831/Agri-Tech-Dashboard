<div align="center">

<img src="public/favicon.svg" alt="Agri-Tech Dashboard icon" width="76" />

# Agri-Tech Dashboard

**Explore Indian agricultural market prices with multilingual search, visualizations, voice input, and an optional AI assistant.**

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

[Features](#features) · [Quick start](#quick-start) · [Architecture](#architecture) · [Development](#development)

</div>

Agri-Tech Dashboard is a React application for exploring commodity-price records from India's [Open Government Data platform](https://data.gov.in). It offers filterable market views, charts, multilingual UI, and a conversational assistant for interpreting the displayed data.

## Features

- **Market dashboard:** Browse commodity prices with summary cards, tables, charts, and filters.
- **Search:** Explore commodities, markets, states, and districts.
- **Localization:** English, Hindi, and Telugu.
- **Voice search:** Browser Web Speech API integration where supported.
- **Kisan Sahayak:** Optional Groq or xAI-powered assistant that receives summarized market records as context.
- **Resilient viewing:** Bundled fallback data when the live data source is unavailable.

> [!NOTE]
> Live prices depend on data.gov.in availability, credentials, and publishing cadence. Bundled fallback records are for demonstration and should not be interpreted as current market quotations.

## Quick start

**Requirements:** Node.js, npm, and (optionally) a [data.gov.in API key](https://data.gov.in).

```bash
git clone https://github.com/KOUSHIK1831/Agri-Tech-Dashboard.git
cd Agri-Tech-Dashboard
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app can render sample data without an external API key.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE` | data.gov.in resource path (the example uses `/api/resource/...`) |
| `VITE_API_KEY` | Optional credential for retrieving live data |
| `VITE_XAI_API_KEY` | Optional Groq key (prefix `gsk_`) or xAI key for the assistant |
| `VITE_GEMINI_API_KEY` | Present in the example configuration; not currently used by `aiService.ts` |

> [!WARNING]
> Variables prefixed with `VITE_` are exposed to the browser bundle. **Do not deploy private AI provider keys in frontend environment variables.** Move authenticated AI requests behind a secure server-side proxy before publishing a production deployment.

## Architecture

```text
React UI / filters / charts
           |
           +--> useCropData / useSearch
           |         |
           |         +--> mandiService --> queued API client
           |                                  |
           |                               data.gov.in
           |         |
           |         +--> fallback market records
           |
           +--> voice search (Web Speech API)
           |
           +--> Kisan Sahayak (optional external LLM)
```

In local development, the Vite configuration proxies `/api` requests to `https://api.data.gov.in`. A production host needs equivalent routing or an accessible server-side data gateway; the development proxy is not automatically deployed.

## Tech stack

React 19, TypeScript, Vite 8, TanStack Query, TanStack Table, Recharts, Axios, Tailwind CSS, i18next, Vitest, Testing Library, ESLint, and Prettier.

## Development

```bash
npm run dev         # Start Vite
npm run build       # Type-check and create production build
npm run preview     # Preview build
npm run lint        # ESLint
npm run typecheck   # TypeScript checks
npm run test:run    # One-off test suite
npm run coverage    # Coverage
npm run deadcode    # Unused-code analysis
```

### Code map

| Directory | Responsibility |
| --- | --- |
| `src/components/` | Market cards, charts, filters, and chatbot UI |
| `src/services/` | Data.gov.in requests, query queue, and AI integration |
| `src/hooks/` | Search, market data, and browser voice features |
| `src/i18n/` | English, Hindi, Telugu resources |
| `src/data/fallback.ts` | Offline/sample records |

The project uses [Open Government Data](https://data.gov.in) as an external data source; review its API terms and rate limits before deploying large-scale usage.
