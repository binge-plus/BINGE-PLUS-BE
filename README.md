# Binge+ Backend (server) 

A robust Node.js/Express backend for the Binge+ OTT platform, providing RESTful APIs, business logic, and database management for movies, series, seasons, episodes, user profiles, reviews, and more. Built with TypeScript, Prisma ORM, and Supabase for storage and authentication.

---

## Table of Contents
- [Features](#features)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Overview](#api-overview)
- [Key Business Logic](#key-business-logic)
- [Development & Contribution](#development--contribution)
- [License](#license)

---

## Features
- User authentication and profile management (Supabase)
- Movie, series, season, and episode CRUD
- Cast & crew management
- Reviews, watchlists, and user progress tracking
- Video clip management (trailers, scenes, etc.)
- Image upload and storage (Supabase Storage)
- Prisma ORM with PostgreSQL
- Modular, scalable codebase

---

## Architecture & Folder Structure
```
server/
├── src/
│   ├── controllers/   # Route controllers (business logic)
│   │   ├── users/         # User creation, reviews
│   │   ├── castCrew/      # Crew management
│   │   ├── clips/         # Clip management
│   │   ├── movie/         # Movie CRUD, cast/crew assignment
│   │   └── movieform/     # Movie creation wizard (multi-step)
│   ├── routes/         # Express route definitions
│   ├── config/         # DB & Supabase config
│   └── index.js        # App entry point
├── prisma/             # Prisma schema & migrations
│   ├── schema.prisma   # Data models
│   └── migrations/     # DB migration history
└── package.json        # Backend dependencies & scripts
```

---

## Tech Stack
- **Node.js** + **Express** (REST API)
- **Prisma ORM** (PostgreSQL)
- **Supabase** (Storage & Auth)
- **TypeScript** (codebase, type safety)
- **Multer** (file uploads)
- **dotenv** (env management)

---

## Setup & Installation
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in required values (see below).
3. **Setup database:**
   - Ensure PostgreSQL is running and accessible.
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```
4. **Start the server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

---

## Environment Variables
Create a `.env` file in `server/` with the following keys:
```
PORT=your-required-port
DATABASE_URL=postgresql://user:password@host:port/dbname
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

---

## Database Schema (Prisma)
- **Movie, Series, Season, Episode**: Core media entities
- **CastCrew**: People (actors, directors, etc.)
- **MovieCast, MovieCrew, SeriesCast, ...**: Assignment tables
- **Profile**: User accounts
- **Review, Wishlist, WatchedMedia, IncompleteMedia**: User interactions

See [`prisma/schema.prisma`](./prisma/schema.prisma) for full model definitions.

---

## API Overview

### Movies
- `GET /api/movies/` — List all movies
- `GET /api/movies/:id` — Get movie by ID
- `POST /api/movies/adding` — Add a new movie
- `GET /api/movies/list` — List movies (for cast/crew assignment)
- `GET /api/movies/cast-crew` — List all cast/crew
- `POST /api/movies/cast` — Assign cast to movie
- `POST /api/movies/crew` — Assign crew to movie
- `GET /api/movies/:movieId/cast` — Get cast & crew for a movie

### Users
- `POST /api/users/add` — Register a new user
- `POST /api/users/:username/:type/:id/review` — Add a review

### Crew
- `POST /api/crew/` — Add a crew member
- `POST /api/crew/many` — Bulk add crew members

### Movie Form (Wizard)
- `POST /api/movie-form/create` — Create movie with cast, crew, clips
- `GET /api/movie-form/actors` — List actors
- `GET /api/movie-form/crew` — List crew
- `POST /api/movie-form/cast-crew` — Add or update cast/crew
- `POST /api/movie-form/check-cast-crew` — Check if cast/crew exists
- `POST /api/movie-form/upload-image` — Upload image to Supabase

### Clips
- `POST /api/clips/:movieId` — Add a clip to a movie
- `GET /api/clips/:movieId` — Get all clips for a movie

---

## Key Business Logic
- **User Registration:** Validates unique email/username, stores hashed password.
- **Movie Creation:** Validates all fields, supports bulk creation with cast, crew, and clips.
- **Cast/Crew Assignment:** Ensures no duplicates, validates existence.
- **Reviews:** Users can review movies/seasons, with rating validation.
- **Image Upload:** Images are uploaded to Supabase Storage and signed URLs are returned.
- **Database:** All data managed via Prisma ORM, migrations tracked in `prisma/migrations/`.

---

## Development & Contribution
- Fork and clone the repo
- Create a feature branch
- Make changes and commit
- Open a pull request

---

## License
MIT License. See [LICENSE](../LICENSE) for details.

---

## Further Reading
- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Express Docs](https://expressjs.com/) 

## TODO
1. CHANGE WORKFLOW ON EVENT FOR DEVELOP NEXT TIME
