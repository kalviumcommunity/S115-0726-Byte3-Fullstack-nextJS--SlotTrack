# SlotTrack

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15%2F16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)](https://www.docker.com/)

SlotTrack is a high-performance, production-ready class booking platform inspired by **Cure.fit**. Built using a strictly typed, layered Next.js architecture, the application resolves the core challenges of live seat availability and race-condition-free reservations for fitness classes.

This project was developed as part of the **Simulated Work Integration (SWI) Program** at Kalvium by **Team Byte3**.

---

## The Problem Statement

In modern fitness applications like Cure.fit, class booking systems must maintain a strict, real-time inventory of seats:
* When a user books a class, the available seat count must decrement immediately across all users to prevent double-booking.
* Cancellations must safely restore slots, keeping seat tallies accurate and consistent.
* Under high volumes of concurrent reservation requests (race conditions), the system must never exceed maximum class capacity or assign duplicate slots to a single member.
* Members require transparent access to their personal booking history and attendance.

---

## Features

### Authentication
* **Role-Based Access Control (RBAC):** Distinct routing, UI views, and authorization flows for `MEMBER` and `ADMIN` roles.
* **Secure Sessions:** Secure JWT-based credentials authentication powered by Auth.js (NextAuth).
* **Password Encryption:** Hashing of user passwords at rest using `bcryptjs`.

### Member Features
* **Interactive Dashboard:** Browse and discover fitness classes with dynamic schedule tracking.
* **Class Discoverability:** Filter classes by location or search parameters.
* **Detailed Booking Page:** Inspect class descriptions, durations, specific locations, and dynamically loaded instructor details.
* **Interactive Booking Widget:** Live status indicators for booking states, seat availability, and pricing.
* **Booking History & Profile:** Access profile details and view paginated history of active or cancelled bookings.

### Admin Features
* **Timetable & Class Creation:** Create, edit, and delete fitness classes including setting capacity, price, description, images, and schedules.
* **Instructor Mapping:** Dynamically assign classes to registered instructor user profiles.
* **Attendance & Booking Audits:** Monitor bookings, seats filled, and overall attendance across all scheduled classes.

### Booking System & Concurrency Controls
* **Interactive Transactions:** Atomic database transactions (`prisma.$transaction`) executing pessimistic lock writes (`SELECT ... FOR UPDATE`) to prevent seat overbooking.
* **Duplicate Booking Prevention:** Unique database constraint preventing a user from booking the same class multiple times.
* **Seat Restoration:** Automatic incrementing of available seat counts on cancellation.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router) / React 19 | Serverless-ready components, layouts, and routing |
| **Styling** | Tailwind CSS v4 | Responsive utility-first styling and animations |
| **Database** | PostgreSQL (Neon) | Scalable serverless relational database |
| **ORM** | Prisma ORM | Type-safe database queries, schemas, and migrations |
| **Authentication** | NextAuth.js | Credentials-based JWT authentication and guards |
| **Request Validation** | Zod | Runtime payload validation schemas |
| **Developer Tools** | TypeScript / ESLint | Strict type safety and codebase consistency |
| **Containerization** | Docker | Consistent production-grade environment bundling |

---

## Architecture

SlotTrack implements a strict **Layered Architecture** to decouple concerns, ensuring each phase of the request-response lifecycle is isolated and testable.

```
Client (Browser)
       ↓
Route Handler (app/api/*)
       ↓
Controller (app/controllers/*)
       ↓
Service (app/services/*)
       ↓
Repository (app/repositories/*)
       ↓
Prisma Client
       ↓
PostgreSQL Database
```

### Architectural Layer Responsibilities

* **Route Handlers (`app/api/`)**: Act as HTTP entry points. Extract parameters, payload bodies, and dynamic headers. Pass context directly to the controller layer and serialize responses.
* **Controllers (`app/controllers/`)**: Act as entry orchestrators. Validate incoming parameters using Zod validator schemas. If valid, delegate parameters to the service layer.
* **Services (`app/services/`)**: Contain the core business logic, safety checks, transaction flow, and rule validation (e.g., confirming seat counts, checking duplicate bookings).
* **Repositories (`app/repositories/`)**: Abstract database interactions. This is the **only** layer allowed to query the database using the Prisma Client.
* **Prisma Client**: Resolves type-safe SQL statements and handles connection pooling.
* **PostgreSQL**: Persists system records with relational integrity.

---

## Database Schema

SlotTrack's database structure contains three core tables and two enums:

```
                  +------------------+
                  |       USER       |
                  +------------------+
                  | id (PK)          |
                  | name             |
                  | email (UQ)       |
                  | password         |
                  | role (Enum)      |
                  | employeeId (UQ)  |
                  | gender           |
                  | age              |
                  +------------------+
                           |
                           | 1
                           |
                           | 0..*
                  +------------------+
                  |     BOOKING      |
                  +------------------+
                  | id (PK)          |
                  | userId (FK)      |<-----+
                  | classId (FK)     |      |
                  | status (Enum)    |      |
                  | bookedAt         |      |
                  | cancelledAt      |      |
                  +------------------+      |
                           |                |
                           | 0..*           |
                           |                |
                           | 1              | 0..* (Instructor)
                  +------------------+      |
                  |  FITNESS_CLASS   |      |
                  +------------------+      |
                  | id (PK)          |      |
                  | title            |      |
                  | description      |      |
                  | instructor       |      |
                  | instructorId (FK)|------+
                  | category         |
                  | imageUrl         |
                  | location         |
                  | detailedLocation |
                  | startTime        |
                  | endTime          |
                  | capacity         |
                  | availableSeats   |
                  | price            |
                  +------------------+
```

### Models

1. **User**: Represents all members and administrators. Contains profile fields such as name, email, credentials, and profile meta (gender, age).
2. **FitnessClass**: Holds details of scheduled class sessions. Tracks total capacity and dynamic seat availability counts (`availableSeats`).
3. **Booking**: Connects users to classes. Represents active or cancelled reservations. Contains status logs and timestamps.

### Database Constraints
* **Duplicate Booking Prevention**: A composite unique constraint `@@unique([userId, classId])` ensures no member can have multiple active reservations for the same class.
* **Cascade Deletes**: Deleting a User or Fitness Class automatically cascades to remove associated Booking records.

---

## Folder Structure

```text
slottrack/
├── app/                        # Next.js App Router root directory
│   ├── (auth)/                 # Authentication pages (Login, Register)
│   ├── (dashboard)/            # Dashboard layout and feature views
│   │   ├── admin/              # Administrator scheduling and analytics views
│   │   ├── booking/            # Detailed class checkout page
│   │   ├── dashboard/          # Main fitness class catalog grid
│   │   ├── history/            # User attendance logs
│   │   └── profile/            # User profile detail panel
│   ├── api/                    # REST API route handlers
│   ├── components/             # Reusable UI component directories
│   │   ├── booking/            # Checkout components (BookingDetails, BookingWidget)
│   │   ├── cards/              # General display cards (ClassCard)
│   │   ├── navigation/         # Header bars and profile menu controls
│   │   └── ui/                 # Atomic UI primitives
│   ├── controllers/            # Controller validation & orchestration layer
│   ├── repositories/           # Data access repository classes (Prisma queries)
│   ├── services/               # Core business logic handlers
│   ├── validators/             # Zod input verification schemas
│   ├── types/                  # Shared TypeScript type definitions
│   ├── globals.css             # Main styling import sheet
│   └── layout.tsx              # Root HTML wrapper layout
├── docs/                       # Technical architecture blueprint assets
├── prisma/                     # Database schemas, migrations, and seeds
│   ├── schema.prisma           # Core relational DB mapping definitions
│   └── seed.ts                 # Dev database seeding scripts
├── Dockerfile                  # Multi-stage production container instructions
├── docker-compose.yml          # Container configuration orchestrator
├── package.json                # Project dependencies and script declarations
└── tsconfig.json               # TypeScript compiler preferences
```

---

## Getting Started

### Prerequisites
* **Node.js** (v20 or higher)
* **npm** (v10 or higher)
* **PostgreSQL Database** (local instance or serverless Neon account)
* **Docker & Docker Compose** (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd slottrack
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

### Environment Variables

| Variable Name | Type | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection String | PostgreSQL connection URL with SSL parameters. |
| `JWT_SECRET` | String | Secret key used for signing session tokens. |
| `AUTH_SECRET` | String | Secret key for Auth.js cookie encryption. |
| `PORT` | Number | Port on which the Next.js server executes (default: `8080`). |
| `NODE_ENV` | String | Runtime environment mode (`development` or `production`). |

### Database Setup

Seeding the database creates default admin credentials, members, and scheduled classes:

1. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

2. **Generate the Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

### Running Locally

```bash
# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` to view the application.

---

## Docker Configuration

SlotTrack uses a multi-stage Docker build to optimize image sizes and protect secrets in production.

### Building the Image
```bash
docker build -t slottrack:latest .
```

### Running the Container
Ensure environment variables are passed correctly:
```bash
docker run -p 3000:8080 --env-file .env slottrack:latest
```

### Orchestrating with Docker Compose
To run SlotTrack using Docker Compose:
```bash
docker compose up --build
```
This runs the application container exposing port `3000` mapped to `8080` internally.

---

## API Overview

All routes return a standard JSON payload format containing `success: boolean`, optional payload `data`, and descriptive string `error` on failure.

| Endpoint | Method | Role Allowed | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | **POST** | Public | Create a new user profile (`MEMBER` role by default). |
| `/api/auth/login` | **POST** | Public | Authenticate user credentials and establish a cookie session. |
| `/api/auth/profile` | **GET** | User Session | Retrieve the authenticated user's profile details. |
| `/api/auth/profile` | **PATCH** | User Session | Update user information (such as gender or password). |
| `/api/classes` | **GET** | Public | Browse all scheduled fitness classes. |
| `/api/classes` | **POST** | `ADMIN` | Schedule a new fitness class. |
| `/api/classes/:id` | **GET** | Public | Fetch details of a single scheduled fitness class. |
| `/api/classes/:id` | **PATCH** | `ADMIN` | Modify a scheduled class's information or capacity. |
| `/api/classes/:id` | **DELETE** | `ADMIN` | Remove a fitness class slot and cascade delete its bookings. |
| `/api/bookings` | **POST** | `MEMBER`, `ADMIN` | Reserve a seat in a fitness class (uses interactive transaction). |
| `/api/bookings/:id` | **PATCH** | `MEMBER`, `ADMIN` | Cancel a booking slot and restore available seat. |
| `/api/bookings/history` | **GET** | `MEMBER`, `ADMIN` | Get paginated booking and attendance log of the session user. |

---

## Authentication Flow

```
1. Client Registers (POST /api/auth/register) -> Save to DB (Default MEMBER role)
2. Client Logs In (POST /api/auth/login) -> Hash compared -> Token issued
3. Middleware evaluates session cookies for subsequent visits
4. Role checked against Route access specifications (RBAC)
```

1. **Credentials Validation**: Secure password comparison is handled using `bcryptjs`.
2. **Session Persistence**: Auth.js generates an encrypted JWT session cookie stored in the client browser.
3. **Role Checks**: Custom middlewares parse session roles (`ADMIN` vs `MEMBER`) to guard endpoints. Admins attempting booking flows or members accessing class creation endpoints are blocked early (HTTP 403 Forbidden).

---

## Booking Flow & Concurrency

To ensure seat limits are never exceeded and seat counts remain perfectly accurate across concurrent booking operations, reservations follow a strict verification lifecycle.

### Step-by-Step Transaction Sequence

1. **Row Lock & Availability Check**: A transaction starts (`prisma.$transaction`). The fitness class row is queried and locked via a database level read lock (`FOR UPDATE`), preventing concurrent modifications to that specific record.
2. **Double Booking Verification**: The system checks if the user has an existing active booking for this class. If found, the transaction rolls back, throwing `ConflictError` (HTTP 409).
3. **Capacity Check**: If the locked class row's `availableSeats` count is `0`, the transaction rolls back, throwing a `ValidationError` (HTTP 400).
4. **Data Writes**:
   * A new booking record with status `ACTIVE` is inserted.
   * The `FitnessClass` row is updated, decrementing `availableSeats` by 1.
5. **Commit**: The transaction commits, locking in the changes and releasing database row locks.

---

---

## Deployment

SlotTrack is packaged to support multiple containerized and serverless environments:

* **Container Engine (Docker):** Standard build variables are exposed, permitting instant deployment on container platforms like Google Cloud Run, AWS Elastic Beanstalk, or Azure App Services.
* **Serverless Hosting (Vercel):** Frontend layouts and page routes deploy as optimized edge assets, with Route Handlers compiling into API functions.
* **Relational Database (Neon):** Managed serverless PostgreSQL provides instant compute scaling and transactional stability.

---

## Contributors

* **Parnil Vyawahare** 
* **Ruhaa Bhalerao**
* **Prithvi Rajvanshi**
---

Live Deploynment - https://byte3-slot-track.vercel.app/

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
