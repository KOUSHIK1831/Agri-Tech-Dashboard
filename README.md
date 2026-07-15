# Agri-Tech Dashboard — contributor guide 🌾

This repository is a React + TypeScript dashboard for exploring **agricultural commodity prices** published by India’s open data portal. The project is optimized for speed, reliability, and ease of use, following a "Minimal & Clean" philosophy.

---

## What the dashboard does

- Pulls commodity price rows from the public **Price Monitoring Division** dataset behind [data.gov.in](https://data.gov.in).
- Surfaces KPIs, interactive charts (Recharts), and searchable market tables.
- Supports multi-lingual access (English, Hindi, Telugu) to serve diverse regional needs.
- Persists user preferences and filters to `localStorage` for a seamless experience across sessions.
- **AI Bot Assistant** — Ask natural-language questions about market prices (powered by Groq/XAI or Gemini).
- **Voice Search** — Search commodities by voice using the Web Speech API (supports EN, HI, TE).
- **Dark mode** — Toggle between light and dark themes.
- **View toggle** — Switch between card grid and data table views.

---

## [Rationale] Why the Vite dev proxy exists

Browsers cannot safely call third-party APIs that lack proper CORS headers or require secure handling of parameters. During `npm run dev`, Vite uses a **proxy configuration** (`vite.config.ts`) that forwards requests from `/api` to `https://api.data.gov.in`.

This allows the application to use relative paths like `/api/resource/...` in development, avoiding CORS errors and keeping the code clean. Production builds expect an equivalent reverse proxy or a direct connection to a reachable HTTPS endpoint.

---

## Tech stack

| Area           | Choice                                                   |
| :------------- | :------------------------------------------------------- |
| **UI**         | React 19, TypeScript, Vite                               |
| **Data layer** | TanStack Query (fetch + cache), Axios                    |
| **Charts**     | Recharts                                                 |
| **i18n**       | i18next + react-i18next with resources under `src/i18n/` |
| **Quality**    | Vitest, ESLint, Prettier, Knip                           |

---

## Local development

### Requirements

- Node 20+ (matches modern CI standards)
- A valid API key for live data from [data.gov.in](https://data.gov.in) (optional, fallback data is provided)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

### Build & Preview

```bash
npm run build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure the following:

| Variable | Required | Description |
| :------- | :------- | :---------- |
| `VITE_API_BASE` | Yes | API resource path on data.gov.in |
| `VITE_API_KEY` | Yes (for live data) | Your API key from [data.gov.in](https://data.gov.in) |
| `VITE_XAI_API_KEY` | No | API key for Grok/XAI bot assistant (preferred over Gemini) |
| `VITE_GEMINI_API_KEY` | No | API key for Gemini bot assistant (fallback if Grok not set) |

If no API key is provided, the app falls back to bundled sample data.

---

## Quality & DX commands

| Command                 | Purpose                                            |
| :---------------------- | :------------------------------------------------- |
| **`npm run lint`**      | Run ESLint check                                   |
| **`npm run format`**    | Auto-format with Prettier                          |
| **`npm run typecheck`** | Run TypeScript type checking (`tsc --noEmit`)      |
| **`npm run deadcode`**  | Scan for unused exports and dependencies with Knip |
| **`npm test`**          | Run interactive Vitest suite                       |
| **`npm run test:run`**  | Run Vitest once (CI mode)                          |
| **`npm run coverage`**  | Run tests with coverage reporting                  |

---

## Architecture (where to look)

| Concern            | Location                                         |
| :----------------- | :----------------------------------------------- |
| **Main App Logic** | `src/App.tsx`                                    |
| **API Client**     | `src/services/apiClient.ts`                      |
| **Mandi Services** | `src/services/mandiService.ts`                   |
| **Custom Hooks**   | `src/hooks/` (Data fetching, search, voice)      |
| **UI Components**  | `src/components/` (Charts, Tables, Filters, Bot) |
| **Localization**   | `src/i18n/`                                      |
| **Root Mount**     | `src/main.tsx`                                   |

---

## Testing strategy

1. **Unit tests** — Pure helpers and logic (e.g., `src/utils/helpers.test.ts`).
2. **Component tests** — Visual and behavioral verification for UI widgets.
3. **Hook tests** — Logic verification for complex data hooks.

We strive for high coverage to ensure data accuracy—critical for agricultural price monitoring.

---

## Localization

- **Supported Languages:** English (`en`), Hindi (`hi`), Telugu (`te`).
- **Configuration:** Managed in `src/i18n/config.ts`.

### Adding a locale

1. Copy `src/i18n/en.ts` to `src/i18n/<lang>.ts` and translate.
2. Register the new language in `src/i18n/config.ts`.

---

## Git hooks

[Husky](https://typicode.github.io/husky/) runs linting and tests on every commit via `.husky/pre-commit`. To bypass hooks temporarily, use `git commit --no-verify`.

---

## [Attribution] License / data attribution

Dataset usage is subject to the terms of **data.gov.in**. This project is an independent client; please respect the API rate limits and terms of service provided by the Open Government Data (OGD) Platform India.
