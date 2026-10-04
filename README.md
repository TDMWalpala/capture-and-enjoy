# ZeitPlan — frontend

AI-native task management. Google Calendar stays the real calendar; this app handles sign-in, tasks, the AI command center, Google connection, settings and activity.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | ZeitPlan FastAPI backend URL |
| `VITE_API_MODE` | `mock` (local in-memory data in `src/lib/mock/`) or `real` |

## Structure

- `src/routes/` — pages (TanStack Router file routes). `_app.*` are signed-in pages.
- `src/services/` — API clients (`api.ts`, `authApi`, `taskApi`, `googleApi`, `aiApi`, `activityApi`), each switching between mock and real.
- `src/hooks/` — TanStack Query hooks (`useTasks`, `useCurrentUser`, `useGoogleConnection`, `useActivity`, …).
- `src/components/` — `ui`, `layout`, `tasks`, `ai`, `google`, `activity`, `common`.
- `src/types/` — shared models.

The frontend never writes to Google Calendar, holds OAuth tokens, or executes AI tools — the backend owns that. MCP lives in the separate ZeitPlan MCP server.
