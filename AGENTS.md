# Node Express REST API Skill

## Purpose

This project is a small Node.js REST API built with Express.
Agents working here should treat the codebase as an API starter that will grow
into these routes:

- `GET /`
- `GET /marco`
- `GET /ping`
- `/users` for CRUD against the database
- `/login` for CRUD against the database

## Local Skill

Use the local skill at `skills/express-rest-api-finisher` when the task is to
inspect the current Express project and implement whatever is still missing from
the project contract.

## Stack

- Runtime: Node.js
- Framework: Express
- Middleware: `dotenv`, `cors`, `morgan`
- Dev workflow: `nodemon`

Install runtime dependencies with:

```bash
npm i express dotenv cors morgan
```

Install the dev dependency with:

```bash
npm i -D nodemon
```

## Current Project State

- Entry point: `index.js`
- Route folder: `routes/`
- Controller folder: `controllers/`
- Helpers can live in `utils/`
- `.env` is already ignored by git

Keep the module system consistent.
The current project uses `require(...)`, so prefer CommonJS unless a full ESM
migration is explicitly requested.

## Recommended Structure

As the API grows, keep this shape:

- `index.js` for server bootstrap
- `routes/*.routes.js` for HTTP routing
- `controllers/*.controllers.js` for request handling
- `utils/` for shared helpers
- `models/` or `db/` after the database choice is defined

Keep routes thin.
Put request orchestration in controllers.
Put persistence logic in a dedicated database layer once the BDD driver is added.

## Route Contract

Initial routes:

- `GET /` returns a basic welcome or health response
- `GET /marco` returns a fixed response
- `GET /ping` returns `pong`

Resource routes:

- `/users` must support create, read, update, and delete
- `/login` must support create, read, update, and delete because that is a
  project requirement, even though auth-only login flows are more common

If someone wants to change `/login` into auth-only endpoints such as
`POST /login`, confirm that change first instead of assuming it.

## Environment Variables

Use `.env` for all sensitive values.
When adding new variables, also add placeholders to `.env.example`.

Common values:

- `PORT`
- `DATABASE_URL` or database-specific host/user/password variables
- `JWT_SECRET` if token-based auth is introduced

Never hardcode credentials, secrets, or connection strings in source files.

## Database Guidance

Database work is blocked until the driver or ORM is chosen.
Before implementing CRUD persistence, install the matching package, for example:

- PostgreSQL: `pg`
- MySQL: `mysql2`
- MongoDB: `mongoose`

Do not fake persistence inside controllers once a real BDD requirement exists.

## Response and Error Rules

- Prefer JSON responses for API resources
- Use clear status codes
- Return predictable error payloads
- Add a shared error-handling middleware when CRUD routes are introduced

## Validation Checklist

Before considering work complete, validate:

- `GET /`
- `GET /marco`
- `GET /ping`
- full CRUD flow for `/users`
- full CRUD flow for `/login`
- `.env` values load correctly
- server boots in dev mode with `nodemon`

Use `curl`, Postman, or automated API tests depending on scope.
