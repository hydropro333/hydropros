# Aquafound Backend

Express API for lead capture, scheduling, and email notifications.

## Quick start (local dev)
1) `cd backend`
2) `npm install`
3) `npm run dev`
4) Open `http://localhost:5000/api/health`

If you do not have a `.env`, the server will use an in-memory DB and log emails to the console in development.

## Real services
1) Copy `backend/.env.example` to `backend/.env`
2) Fill in `DB_*` and `EMAIL_*`
3) `npm run dev`

## Dev-only flags
- `USE_MOCK_DB=true` to force in-memory data even if `DB_*` is set
- `USE_MOCK_DB=false` to require a real DB in development
- `USE_MOCK_EMAIL=true` to log emails instead of sending

## Endpoints
- `GET /api/health`
- `POST /api/leads`
- `GET /api/slots`
- `POST /api/appointments`
- `PATCH /api/appointments/:id`
- `DELETE /api/appointments/:id`
