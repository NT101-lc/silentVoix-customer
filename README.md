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

- `client/` - React app
- `server/` - Express API

## Quick Start

### 1) Database

Create a PostgreSQL database, for example `silentvoix`.

### 2) Backend setup

```bash
cd server
cp .env.example .env
# update DB config in .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Backend runs at `http://localhost:4000`.

### 3) Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

- `GET /api/health`
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
