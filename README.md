# Marina

Project Marina is cloned from the existing `fee` frontend and `bee` backend.

## Structure

- `frontend`: Vite React app cloned from `fee`
- `backend`: NestJS app cloned from `bee`

## Current Scope

- Frontend includes the hotel site, booking UI, policy/about/support pages, and custom itinerary flow.
- Backend is trimmed to run without a database for now.
- The backend entry only includes standalone API modules.
- Active backend modules:
  - `custom-itinerary`
  - `checkin-document`
  - `competitor-prices`
  - root health endpoint

## Commands

```bash
npm run dev:frontend
npm run dev:backend
npm run build
```

You can also run commands inside each app:

```bash
cd frontend && npm run dev
cd backend && npm run start:dev
```
