# 🎓 That’s My College – Backend Service

A **production-ready NestJS backend** powering *That’s My College*, a college discovery and admission management platform.

This service provides a secure, modular, and scalable REST API for managing:

* Colleges & Courses
* Users & Roles
* Admission Applications
* Callback Requests
* Admin Operations

It uses **MongoDB (Mongoose)** for persistence, **JWT-based authentication**, **role-based authorization**, and exposes interactive **Swagger (OpenAPI 3)** documentation.

---

# 🧭 Detailed Overview

## 1️⃣ What This Backend Solves

This backend is designed to support a college exploration and admission workflow platform where:

* Students can browse colleges and courses.
* Users can apply for admission.
* Admins manage colleges, courses, and users.
* The system controls callback requests with rate-limiting.
* Secure authentication and role-based access control is enforced.

It follows **modular architecture principles** from NestJS, ensuring maintainability, scalability, and testability.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Endpoints](#endpoints)
- [Docker](#docker)
- [Project structure](#project-structure)
- [API reference](#api-reference)
- [Authentication and authorization](#authentication-and-authorization)
- [Data models](#data-models)
- [Validation and response format](#validation-and-response-format)
- [Tests](#tests)
- [Scripts reference](#scripts-reference)
- [CI/CD](#cicd)
- [License](#license)

---

## Tech stack

| Layer | Technology | Purpose |
|-------|------------|--------|
| **Runtime** | Node.js 18 | JavaScript/TypeScript execution |
| **Framework** | [NestJS](https://nestjs.com/) 10 | Modular structure, DI, HTTP, guards, pipes |
| **Database** | MongoDB via [Mongoose](https://mongoosejs.com/) 7 | ODM, schemas, connections |
| **Auth** | JWT + [Passport](https://www.passportjs.org/) | `@nestjs/jwt`, `passport-jwt` for token-based auth |
| **API docs** | [Swagger](https://swagger.io/) (OpenAPI 3) | `@nestjs/swagger` – interactive docs at `/api/doc` |
| **Validation** | `class-validator`, `class-transformer` | DTO validation and transformation |
| **Health** | `@nestjs/terminus` | MongoDB ping at `/health` |
| **Logging** | Bunyan (optional) | Structured logging; can be enabled in `main.ts` |

---

## Prerequisites

- **Node.js 18** – Required by `package.json` `engines`. Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) if you need multiple versions.
- **MongoDB** – Running locally (e.g. `mongodb://localhost:27017`) or a hosted instance (e.g. Atlas). Connection string is set via `MONGODB_URI`.
- **npm** – Comes with Node.js; the project uses `package-lock.json` for reproducible installs.

---

## Environment variables

Copy `.env.example` to `.env` in the project root and set the values. **Do not commit `.env`.**

| Variable | Required | Description | Example |
|----------|----------|-------------|--------|
| `MONGODB_URI` | Yes | Full MongoDB connection string | `mongodb://localhost:27017/thats-my-college` |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens. Use a long, random value in production. | (generate with `openssl rand -base64 32`) |
| `TMC_API_CONFIG_KEY` | Yes | API key for protected routes and Swagger. Sent in header `x-tmc-api-config-key`. | (any secure string) |
| `PORT` | No | HTTP port the app listens on. Default: `4000`. | `4000` |

Example `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/thats-my-college
JWT_SECRET=your-secret-at-least-32-chars
TMC_API_CONFIG_KEY=your-api-config-key
PORT=4000
```

---

## Installation

1. Clone the repository and go to the backend service directory:
   ```bash
   cd thats-my-college-backend-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create and fill `.env` as in [Environment variables](#environment-variables).

---

## Running the app

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in **development** with watch mode (recompile on file change). Uses `nest start --watch`. |
| `npm run start:debug` | Same as dev but with Node inspector (`--debug --watch`) for debugging. |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm run start` or `npm run start:prod` | Run the compiled app from `dist/main.js`. Use after `npm run build` for production. |

Recommended for local development:

```bash
npm run start:dev
```

---

## Endpoints

With default `PORT=4000` and global prefix `api`:

| Purpose | URL |
|--------|-----|
| **REST API base** | `http://localhost:4000/api` |
| **Swagger UI** | `http://localhost:4000/api/doc` |
| **Health check** | `http://localhost:4000/health` |
| **Root** | `http://localhost:4000/` (simple hello from `AppController`) |

- **Health** – Returns MongoDB status via `@nestjs/terminus` (e.g. `{"status":"ok","info":{"mongoose":{"status":"up"}}}`).
- **Swagger** – All API key and JWT-secured endpoints are documented; you can authorize with `x-tmc-api-config-key` and/or Bearer token in the UI.

---

## Docker

- **Image**: Dockerfile uses `node:18.16.1-slim`, installs dependencies, runs `npm run build`, and runs `npm run start:prod`. Default port inside the container is **4000**.
- **docker-compose**: Builds the app image and runs it with env from `.env` and port mapping `4000:4000`.

Commands:

```bash
# Build and start (foreground)
docker-compose up --build

# Build and start in background
docker-compose up -d --build
```

Ensure `.env` exists with `MONGODB_URI`, `JWT_SECRET`, `TMC_API_CONFIG_KEY`, and optionally `PORT`. For a full stack with MongoDB in Docker, you would add a `mongo` service and set `MONGODB_URI` to that service name.

---

## Project structure

```
thats-my-college-backend-service/
├── src/
│   ├── main.ts                 # Bootstrap: Nest app, CORS, global prefix "api", ValidationPipe, Swagger
│   ├── app.module.ts           # Root module: imports Config, DB, Terminus, Auth, and all feature modules
│   ├── app.controller.ts       # Root route + GET /health (MongoDB health check)
│   ├── app.service.ts          # Root service (e.g. getHello)
│   ├── config/
│   │   └── config.ts           # App constants (JWT expiry, callback request limit/expiry)
│   ├── common/
│   │   ├── database/           # Mongoose connection (DatabaseModule, DatabaseConfig using MONGODB_URI)
│   │   ├── decorators/         # e.g. GetAuthToken for extracting JWT
│   │   ├── entity/             # BaseEntity (createdAt, updatedAt, createdBy, isDeleted, etc.)
│   │   └── entity-utils/       # Shared entity utilities (EntityUtilsService)
│   ├── logger/                 # Bunyan logger provider (optional; commented out in main.ts)
│   ├── middlewares/
│   │   └── request.middleware.ts  # PerformanceMiddleware: logs method, URL, status, response time, CPU/memory
│   ├── modules/
│   │   ├── admin/              # Admin login (POST /admin/login)
│   │   ├── auth/               # JWT: generate-token, validate-token; guards (JWT, API key, role)
│   │   ├── college/            # College CRUD + details (with courses)
│   │   ├── courses/           # Course CRUD; by college; all courses with college details
│   │   ├── users/             # User CRUD; OAuth login; role update (Super Admin)
│   │   ├── admission-application/  # Admission applications (create, list, update status, delete)
│   │   └── callback-requests/  # Callback request create/check; list/delete (admin)
│   └── utils/                 # constants (app name, global prefix, Swagger), enums (users), helpers
├── test/                      # E2E tests (jest-e2e.json)
├── .env.example               # Template for environment variables
├── docker-compose.yml         # App service + env + port 4000
├── Dockerfile                 # Node 18 slim, build, start:prod
└── .github/workflows/         # PR Docker build; main: lint, Docker build/push, deploy to EC2
```

---

## API reference

All routes are under the **`/api`** prefix. Auth requirements are summarized below; see [Authentication and authorization](#authentication-and-authorization) for details.

### Health and root

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | Simple hello response from AppController. |
| GET | `/health` | None | Terminus health check (MongoDB ping). |

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/generate-token` | API key | Authenticate user (email/password); returns JWT. |
| POST | `/api/auth/validate-token` | API key | Validate JWT and return user payload. |

### Admin (`/api/admin`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/admin/login` | API key | Admin login; returns admin user/token info. |

### College (`/api/college`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/college` | JWT + API key, Admin | Create college. |
| GET | `/api/college` | API key | List colleges (with query filters). |
| GET | `/api/college/details/:collegeId` | API key | Get college and its courses. |
| GET | `/api/college/:collegeId` | API key | Get college by ID. |
| PATCH | `/api/college/:collegeId` | JWT + API key, Admin | Update college. |
| DELETE | `/api/college/:collegeId` | JWT + API key, Admin | Delete college and its courses. |

### Courses (`/api/courses`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/courses` | JWT + API key, Admin | Create course(s) for a college. |
| GET | `/api/courses` | API key | Get all courses. |
| GET | `/api/courses/get-all/college-details` | API key | Get all courses with college details (query filters). |
| GET | `/api/courses/college/:collegeId` | API key | Get courses by college ID. |
| GET | `/api/courses/:courseId` | API key | Get course by course ID. |
| PATCH | `/api/courses/:courseId` | JWT + API key, Admin | Update course by course ID. |
| PATCH | `/api/courses/college/:collegeId` | JWT + API key, Admin | Update course by college ID. |
| DELETE | `/api/courses/:courseId` | JWT + API key, Admin | Delete course by course ID. |
| DELETE | `/api/courses/college/:collegeId` | JWT + API key, Admin | Delete all courses for a college. |

### Users (`/api/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users` | API key | Create user (form sign-up). |
| POST | `/api/users/oauth-login` | API key | Create/update user from OAuth login. |
| GET | `/api/users` | JWT + API key, Admin or Super Admin | List all users. |
| GET | `/api/users/email/:email` | API key | Get user by email. |
| GET | `/api/users/:userId` | JWT + API key | Get user by ID. |
| PATCH | `/api/users/:userId` | JWT + API key | Update user by ID. |
| PATCH | `/api/users/role/update` | JWT + API key, Super Admin | Update user role by email. |
| DELETE | `/api/users/:userId` | JWT + API key, Admin | Delete user by ID. |

### Admission application (`/api/admission-application`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/admission-application` | JWT + API key | Create admission application. |
| GET | `/api/admission-application` | JWT + API key, Admin | List all applications. |
| GET | `/api/admission-application/user/:userId` | JWT + API key | List applications for a user (owner or Admin/Super Admin). |
| GET | `/api/admission-application/:id` | JWT + API key | Get application by ID. |
| PATCH | `/api/admission-application/:id` | JWT + API key | Update application. |
| PATCH | `/api/admission-application/update-status/:id` | JWT + API key, Admin | Update application status. |
| DELETE | `/api/admission-application/:applicationId` | JWT + API key | Delete application (owner). |

### Callback requests (`/api/callback-requests`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/callback-requests` | JWT + API key | Check/create callback request for current user (rate-limited per user). |
| GET | `/api/callback-requests/:userId` | JWT + API key, Admin or Super Admin | Get callback requests for a user. |
| DELETE | `/api/callback-requests/:userId` | JWT + API key, Admin or Super Admin | Delete callback request for a user. |

---

## Authentication and authorization

- **API key**  
  - Header: `x-tmc-api-config-key`.  
  - Value: same as `TMC_API_CONFIG_KEY` in `.env`.  
  - Used for: Swagger, and all routes that require “API key” in the table above.  
  - Guard: `KeyPermissionsGuard`.

- **JWT (Bearer)**  
  - Header: `Authorization: Bearer <token>`.  
  - Token is obtained from `POST /api/auth/generate-token` (or admin login where applicable).  
  - Guard: `JwtAuthGuard`; strategy: `JwtStrategy` (uses `JWT_SECRET`).  
  - Config: token expiry is set in `src/config/config.ts` (e.g. `12h`).

- **Roles**  
  - Stored on user: `UserRoleEnum` – `USER`, `ADMIN`, `SUPER_ADMIN`.  
  - Guard: `RoleGuard` with allowed roles per route (e.g. `new RoleGuard([UserRoleEnum.ADMIN])`).  
  - Typical usage: read-only or public-like endpoints use API key only; create/update/delete often require JWT + Admin or Super Admin where noted.

---

## Data models

- **Base entity** (`src/common/entity/base.entity.ts`): `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`, `deletedBy`, `isDeleted`. Other entities extend this where applicable.

- **College** (collection: `colleges`): `name`, `address`, `contact[]`, `city`, `state`, `collegeType[]`, `established`, `university`, `logo`, `image[]`, `message`, `details`, `rating`, `featured`, plus base fields.

- **Course** (collection: `courses`): `collegeId` (ref: College), `courses` (array of course DTOs), plus base fields.

- **User** (collection: `users`): `email`, `phone`, `firstName`, `lastName`, `profilePic`, `password`, `qualification`, `role[]` (UserRoleEnum), `gender` (GenderEnum), plus base fields.

- **Admission application** (collection: `admission-applications`): `applicantName`, `applicantMobile`, `applicantEmail`, `interestedCourse`, `applicantCurrentCity`, `userId` (ref: User), `collegeId` (ref: College), `courseId` (ref: Course), `status` (AdmissionApplicationStatusEnum: APPLIED, UNDER_REVIEW, IN_PROGRESS, COMPLETED, CLOSED), plus base fields.

- **Callback request** (collection: `callbackRequests`): `userId` (ref: User), `createdAt`, `expireAt`. TTL index is used for expiry (config: `CALLBACK_REQUEST_EXPIRY_HOURS`, `CALLBACK_REQUEST_LIMIT` in `src/config/config.ts`).

---

## Validation and response format

- **Global ValidationPipe** (in `main.ts`): `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`, `enableImplicitConversion: true`. Request bodies must conform to DTOs; extra properties are stripped or rejected.

- **Typical success response**:
  ```json
  { "status": true, "data": { ... }, "message": "..." }
  ```
- **Error response** (e.g. 500):
  ```json
  { "status": false, "message": "Error message" }
  ```

---

## Tests

| Command | Description |
|--------|-------------|
| `npm run test` | Run unit tests (Jest, `*.spec.ts` under `src`). |
| `npm run test:watch` | Run unit tests in watch mode. |
| `npm run test:cov` | Run unit tests with coverage report. |
| `npm run test:e2e` | Run E2E tests (config: `test/jest-e2e.json`). |

Unit tests live next to the code (e.g. `app.controller.spec.ts`, `admin.service.spec.ts`). E2E tests are in the `test/` directory.

---

## Scripts reference

| Script | Description |
|--------|-------------|
| `npm run prebuild` | Remove `dist/` (via rimraf). |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm run start` | Run `node dist/main`. |
| `npm run start:dev` | `nest start --watch`. |
| `npm run start:debug` | `nest start --debug --watch`. |
| `npm run start:prod` | `node dist/main` (same as start). |
| `npm run lint` | ESLint with fix for `src`, `apps`, `libs`, `test`. |
| `npm run format` | Prettier for `src/**/*.ts` and `test/**/*.ts`. |
| `npm run test` | Jest unit tests. |
| `npm run test:watch` | Jest in watch mode. |
| `npm run test:cov` | Jest with coverage. |
| `npm run test:e2e` | E2E with `test/jest-e2e.json`. |
| `npm run test:debug` | Jest with Node inspector. |

---

## CI/CD

- **Pull requests (to `main`)** – `.github/workflows/pr-docker-build.yml`  
  - Runs in `node:18.16.1-slim`.  
  - Steps: checkout → `npm install` → `npm run lint`.  
  - Then builds Docker image `tmc-backend:latest` and cleans up.  
  - (Optional test step is commented out.)

- **Push to `main`** – `.github/workflows/build-docker-image-and-deploy.yml`  
  - **lint_and_test**: checkout → `npm install` → `npm run lint`.  
  - **build_and_publish**: Docker build → login to Docker Hub → push `$DOCKERHUB_USERNAME/tmc-backend:latest` → logout and clean images.  
  - **deploy** (runner: `aws-ec2`, only if build succeeds): stop/remove existing `tmc-backend-container` → pull new image → create `.env` from GitHub secrets (`MONGODB_URI`, `JWT_SECRET`, `TMC_API_CONFIG_KEY`, `PORT`) → run container with `-p 4000:4000` and `--env-file .env`.  

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `MONGODB_URI`, `JWT_SECRET`, `TMC_API_CONFIG_KEY`, `PORT` (and any others referenced in the workflow).

---

## License

UNLICENSED (private).
