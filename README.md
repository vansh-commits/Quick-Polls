## QuickPolls

A real-time polling app where users can create polls, vote, and see live results.

### Stack
- Backend: Express + Socket.io + MongoDB (Mongoose)
- Frontend: Next.js App Router, TailwindCSS

### Features
- Create polls with multiple options
- Vote and see results update live via Socket.io
- Responsive UI with smooth transitions

### Monorepo Layout
- `backend/`: Express API and Socket.io server
- `frontend/`: Next.js app

### Environment

Backend `.env` example:
```
MONGODB_URI=mongodb://127.0.0.1:27017/quickpolls
PORT=8080
```

Frontend `.env` example:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Local Setup

1) Backend
```
cd backend
npm install
npm run dev
# API: http://localhost:8080
# Swagger Docs: http://localhost:8080/docs
```

2) Frontend
```
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

### API Overview

- `POST /polls`
  - Body: `{ "question": string, "options": string[] }`
  - Creates a new poll

- `GET /polls`
  - Returns all polls

- `GET /polls/:id`
  - Returns a single poll

- `POST /polls/:id/vote`
  - Body: `{ "optionIndex": number }`
  - Records a vote and broadcasts `poll-updated` via Socket.io

### Realtime
- Socket.io path: `/socket.io`
- Join a poll room: emit `join-poll` with `pollId`
- Server emits `poll-updated` with the latest poll state

### Production
- Configure `MONGODB_URI` and `PORT` in the backend
- Configure `NEXT_PUBLIC_API_URL` in the frontend
- Build:
```
cd backend && npm run build
cd ../frontend && npm run build
```


