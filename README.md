# SilentVoix Customer - PERN Sign Language App

PERN full-stack app for sign language learning with:

- Lesson section (`EN` / `VI`)
- Webcam practice while following lesson videos
- PostgreSQL-backed lesson storage

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL

## Project Structure

- `frontend/` - React app
- `backend/` - Express API

## Quick Start

### 1) Docker Compose

Run the full stack with Docker Compose:

```bash
docker compose up -d
```

Frontend runs at `http://localhost:8080`.
Backend runs at `http://localhost:4000`.
PostgreSQL runs at `localhost:5432` and loads `backend/src/db/schema.sql` on first initialization.

### 2) Backend setup for manual dev

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:4000`.

### 3) Frontend setup for manual dev

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

- `GET /api/health`
- `GET /api/signs/sources`
- `GET /api/signs/trending?limit=12`
- `GET /api/signs/lookup?term=hello&sources=signasl,anysign`
- `GET /api/lessons?lang=en|vi`
- `GET /api/lessons/:id?lang=en|vi`

## Features

- Language toggle `English` / `Tiếng Việt`
- Lesson cards with tags and difficulty
- Lesson detail page with:
  - demo tutorial video
  - webcam panel using `getUserMedia`
  - playback speed controls

## Notes

- Current app uses embedded demo videos (public sample URLs).
- Webcam stream is local in-browser and not uploaded.

## Docker

Docker Compose runs PostgreSQL, the backend API, and the frontend:

```bash
docker compose up -d
```

Rebuild images after code changes:

```bash
docker compose up --build -d
```

Stop containers:

```bash
docker compose down
```
