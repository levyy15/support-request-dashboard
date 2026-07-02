# Support Request Dashboard

A small full-stack support request dashboard built for the Freelance Software Developer assessment. The app lets an operations user view incoming support requests, search and filter them, inspect request details, and update request status when using Editor mode.

## Tech Stack

- React
- TypeScript
- Vite
- Node.js
- Express
- Prisma ORM
- SQLite

## Features

- Dashboard summary cards for total, open, resolved, and high-priority requests
- Search by requester name or email
- Filters by status, priority, category, and assigned person
- Request detail panel with requester, email, category, priority, status, message, assignee, created date, and updated date
- Role selector with Viewer and Editor modes
- Viewer mode blocks status updates
- Editor mode can update request status
- Loading, error, empty, and success states
- Responsive layout for desktop and phone-width screens
- Prisma-backed data using SQLite and seed data

## Setup Instructions

Clone the repository:

```bash
git clone https://github.com/levyy15/support-request-dashboard.git
cd support-request-dashboard

Install dependencies:

> npm install

Create a local environment file:

> cp .env.example .env

The .env file should contain:

> DATABASE_URL="file:./dev.db"

Run the Prisma migration:

> npx prisma migrate dev

Seed the database:

> npx prisma db seed

Start the app:

> npm run dev

The React app runs at:

http://localhost:5173

The API runs at:

http://localhost:4000
API Routes
GET    /api/health
GET    /api/requests
GET    /api/requests/:id
PATCH  /api/requests/:id/status
Role Behavior

For Windows PowerShell, create the environment file with:

powershell
copy .env.example .env

Viewer mode is read-only. A Viewer can view requests and request details, but cannot update request status.

Editor mode can update a request status to:

Open
In Progress
Resolved
Closed
```
## Assumptions

- This project uses mock support request data only.
- Real authentication is not implemented.
- The Viewer and Editor roles are controlled through a simple role selector.
- SQLite is used to keep local setup simple.
- The API and React app are intended to run locally for assessment review.

## Known Limitations

- No real login or user authentication.
- No deployment setup included.
- No automated tests included due to the short assessment timeline.
- Status, priority, category, and assigned person values are kept simple for demo purposes.

## QA Checklist

| Case | Expected Result |
|---|---|
| Prisma setup and seed | Reviewer can install dependencies, run Prisma setup/seed, and see seeded requests |
| Search by requester name or email | Only matching requests remain visible |
| Filter by status and priority | List updates correctly and can be reset |
| Open request detail | Selected request detail is shown clearly |
| Viewer tries to update status | Status update is disabled and clearly blocked |
| Editor updates status | Data updates through Prisma-backed flow and UI shows a success state |
| No matching result | Clear empty state is shown |
| Simulated API failure | Clear error state is shown |
| Mobile-width view | Cards, filters, list, and detail view remain usable |