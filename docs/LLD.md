# SlotTrack — Low-Level Design (LLD)

> **Product Name:** SlotTrack  
> **Team:** Byte3 (Kalvium Simulated Work Integration — Track 1)  
> **Document Version:** 2.0  
> **Status:** Verified Codebase Implementation Reference  

---

## 1. Codebase Directory Structure

```text
slottrack/
├── app/
│   ├── (auth)/                         # Auth Route Group
│   │   ├── layout.tsx                  # Auth Layout Wrapper
│   │   ├── login/page.tsx              # Login Page Component
│   │   └── register/page.tsx           # Registration Page Component
│   │
│   ├── (dashboard)/                    # Dashboard Route Group (Protected)
│   │   ├── layout.tsx                  # Core Dashboard Provider & Optimistic Engine
│   │   ├── admin/page.tsx              # Admin / Instructor Dashboard Page
│   │   ├── booking/[id]/page.tsx       # Class Booking Details Page
│   │   ├── dashboard/page.tsx          # Member Class Catalogue Page
│   │   ├── history/page.tsx            # Route Placeholder (Handled in ProfileDrawer)
│   │   └── profile/page.tsx            # Profile Overview Page
│   │
│   ├── api/                            # Next.js API Route Handlers
│   │   ├── auth/                       # Auth endpoints (login, register, profile, nextauth)
│   │   ├── bookings/                   # Booking endpoints (POST, GET, PATCH [id], history)
│   │   ├── classes/                    # Class endpoints (GET, POST, PATCH [id], DELETE [id])
│   │   └── health/route.ts             # Health check endpoint
│   │
│   ├── components/                     # Reusable React UI Components
│   │   ├── booking/                    # BookingDetails, BookingWidget, AboutClass
│   │   ├── cards/                      # ClassCard, ClassGrid, InstructorCard
│   │   ├── feedback/                   # CreateClassModal
│   │   ├── forms/                      # CreateClassForm, EditClassForm, LoginForm, RegisterForm
│   │   ├── navigation/                 # Navbar, LocationSelector, ProfileDropdown, Logo
│   │   ├── profile/                    # ProfileCard, ProfileDrawer
│   │   ├── schedule/                   # ScheduleItem, ScheduleSidebar
│   │   ├── tables/                     # HistoryTable
│   │   └── ui/                         # Button, Card, Modal, Drawer, Toast, Table, Badge, Input
│   │
│   ├── controllers/                    # Controller Layer (Request Orchestration)
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── class.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── services/                       # Service Layer (Business Logic Rules)
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── class.service.ts
│   │   └── user.service.ts
│   │
│   ├── repositories/                   # Repository Layer (Data Access & Prisma SQL)
│   │   ├── auth.repository.ts
│   │   ├── booking.repository.ts
│   │   ├── class.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── validators/                     # Zod Validation Schemas
│   │   ├── auth.validator.ts
│   │   ├── booking.validator.ts
│   │   ├── class.validator.ts
│   │   └── user.validator.ts
│   │
│   ├── lib/                            # Core Utilities & Singletons
│   │   ├── api/                        # Axios API Client Request Helpers
│   │   ├── auth.ts                     # NextAuth Options Configuration
│   │   ├── auth-helper.ts              # JWT Header & Cookie Decoder
│   │   ├── perf-logger.ts              # Microsecond Timing Logger (`measureSpan`)
│   │   ├── prisma.ts                   # Singleton PrismaClient Instance
│   │   └── utils.ts                    # Custom Error Classes & Helper Functions
│   │
│   └── types/                          # TypeScript Interfaces & Types
│       ├── booking.ts
│       ├── fitness-class.ts
│       └── user.ts
│
├── prisma/
│   ├── schema.prisma                   # Database Schema & Model Definitions
│   ├── add_indexes.sql                 # SQL Index Definitions
│   └── seed.ts                         # Development Database Seed Script
│
├── scripts/                            # Performance Profiling Suite
│   ├── api-profiler.ts                 # API Endpoint Latency Profiler
│   ├── benchmark-suite.ts              # System Benchmark Suite
│   └── e2e-profiler.ts                 # End-to-End Latency Instrumentation
│
├── Dockerfile                          # Multi-stage Alpine Standalone Dockerfile
├── docker-compose.yml                  # Docker Service Specification
├── performance_profile_report.md       # Empirical Performance Profiling Report
└── package.json                        # Project Dependencies & Scripts
```

---

## 2. Frontend Routing Structure

| App Route Path | File Location | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Public | Root landing page; redirects to `/login` or `/dashboard` |
| `/login` | `app/(auth)/login/page.tsx` | Public | Credentials authentication form |
| `/register` | `app/(auth)/register/page.tsx` | Public | Member account creation form |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | `MEMBER`, `ADMIN` | Primary class discovery grid & booking dashboard |
| `/booking/[id]` | `app/(dashboard)/booking/[id]/page.tsx` | `MEMBER`, `ADMIN` | Detailed view for selecting class seat slot |
| `/admin` | `app/(dashboard)/admin/page.tsx` | `ADMIN` Only | Instructor control panel for class scheduling & history |
| `/profile` | `app/(dashboard)/profile/page.tsx` | `MEMBER`, `ADMIN` | Member profile overview |

---

## 3. Client API Layer (`app/lib/api/`)

The frontend interacts with backend API route handlers through typed Axios wrappers located in `app/lib/api/`:

### 3.1 HTTP Client Base (`client.ts`)
Creates an Axios instance with standard `Content-Type: application/json` headers, custom request/response interceptors for performance timing logging, and automatic error extraction.

### 3.2 Endpoint Wrappers
- **`bookings.ts`**:
  - `getBookings()` ➔ `GET /api/bookings`
  - `bookClass(classId)` ➔ `POST /api/bookings`
  - `cancelBooking(bookingId)` ➔ `PATCH /api/bookings/:id`
  - `getBookingHistory(page, limit)` ➔ `GET /api/bookings/history?page=X&limit=Y`
- **`classes.ts`**:
  - `getClasses(params)` ➔ `GET /api/classes`
  - `getClassById(id)` ➔ `GET /api/classes/:id`
  - `createClass(data)` ➔ `POST /api/classes`
  - `updateClass(id, data)` ➔ `PATCH /api/classes/:id`
  - `deleteClass(id)` ➔ `DELETE /api/classes/:id`
- **`users.ts`**:
  - `getProfile()` ➔ `GET /api/auth/profile`
  - `updateProfile(data)` ➔ `PATCH /api/auth/profile`

---

## 4. Backend Layered Architecture Details

For every major domain, execution follows a strict pipeline:

```
Route Handler (app/api/*)
   └── Controller (app/controllers/*) ──► Validator (app/validators/*)
          └── Service (app/services/*)
                 └── Repository (app/repositories/*) ──► Prisma ──► PostgreSQL
```

### Layer File Summary Matrix

| Domain Module | Controller File | Service File | Repository File | Validator File |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `auth.controller.ts` | `auth.service.ts` | `auth.repository.ts` | `auth.validator.ts` |
| **Classes** | `class.controller.ts` | `class.service.ts` | `class.repository.ts` | `class.validator.ts` |
| **Bookings** | `booking.controller.ts` | `booking.service.ts` | `booking.repository.ts` | `booking.validator.ts` |
| **Users** | `user.controller.ts` | `user.service.ts` | `user.repository.ts` | `user.validator.ts` |

---

## 5. Exhaustive API Reference

All responses conform to a unified wrapper structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 5.1 POST `/api/auth/register`
- **Purpose:** Registers a new user account (defaults role to `MEMBER`).
- **Auth Required:** No.
- **Request Body:** `{ name: string, email: string, password: string, age?: number, gender?: string }`
- **Validation:** `registerSchema` (email format, password min 6 chars).
- **Service Method:** `authService.registerUser(data)`
- **Repository Operation:** `authRepository.create(data)`
- **Success Response (201 Created):** `{ success: true, data: { id, name, email, role, createdAt } }`
- **Error Response (409 Conflict):** Email already registered.

### 5.2 POST `/api/auth/login`
- **Purpose:** Authenticates email and password credentials.
- **Auth Required:** No.
- **Request Body:** `{ email: string, password: string }`
- **Validation:** `loginSchema`.
- **Service Method:** `authService.loginUser(email, password)` (verifies hash via `bcrypt.compare`).
- **Success Response (200 OK):** `{ success: true, data: { user: { id, name, email, role } } }`

### 5.3 GET `/api/auth/profile`
- **Purpose:** Retrieves profile details of currently authenticated user.
- **Auth Required:** Yes (`MEMBER` or `ADMIN`).
- **Service Method:** `userService.getUserById(userId)`
- **Success Response (200 OK):** `{ success: true, data: { id, name, email, role, age, gender, employeeId } }`

### 5.4 GET `/api/classes`
- **Purpose:** Retrieves scheduled fitness classes matching filter criteria.
- **Auth Required:** No.
- **Query Parameters:** `category` (optional string), `location` (optional string, e.g. "Pune", "Bangalore"), `instructorId` (optional string), `includePast` (optional boolean).
- **Repository Operation:** `classRepository.findAll(filters)`
- **Success Response (200 OK):** `{ success: true, data: [ { id, title, description, instructor, location, detailedLocation, startTime, endTime, capacity, availableSeats, price } ] }`

### 5.5 POST `/api/classes`
- **Purpose:** Creates a new fitness class (Admin only).
- **Auth Required:** Yes (`ADMIN` role enforced).
- **Request Body:** `{ title, description, instructor, category, imageUrl, location, detailedLocation, startTime, endTime, capacity, price }`
- **Validation:** `createClassSchema`.
- **Repository Operation:** `classRepository.create(data)` (initializes `availableSeats = capacity`).
- **Success Response (201 Created):** `{ success: true, data: FitnessClass }`

### 5.6 PATCH `/api/classes/[id]`
- **Purpose:** Updates an existing fitness class (Admin only).
- **Auth Required:** Yes (`ADMIN` role enforced).
- **Service Method:** `classService.updateClass(id, data)`
- **Success Response (200 OK):** `{ success: true, data: FitnessClass }`

### 5.7 DELETE `/api/classes/[id]`
- **Purpose:** Deletes a fitness class and cascade removes associated bookings.
- **Auth Required:** Yes (`ADMIN` role enforced).
- **Repository Operation:** `classRepository.delete(id)`
- **Success Response (200 OK):** `{ success: true, data: { id, message } }`

### 5.8 GET `/api/bookings`
- **Purpose:** Lists active bookings (Admins see all; Members see own active bookings).
- **Auth Required:** Yes.
- **Repository Operation:** `bookingRepository.findByUserId(userId)` or `bookingRepository.findAll()`

### 5.9 POST `/api/bookings`
- **Purpose:** Reserves a seat in a fitness classslot atomically.
- **Auth Required:** Yes (`MEMBER` or `ADMIN`).
- **Request Body:** `{ classId: string }`
- **Validation:** `createBookingSchema`.
- **Repository Method:** `bookingRepository.createBookingWithSeatDecrement(userId, classId)`
- **Success Response (201 Created):** `{ success: true, data: { booking: { id, userId, classId, status, bookedAt }, availableSeatsRemaining: number } }`
- **Error Responses:** 404 (Class not found), 409 (Class fully booked OR duplicate booking).

### 5.10 PATCH `/api/bookings/[id]`
- **Purpose:** Cancels an active booking slot and reopens class seat atomically.
- **Auth Required:** Yes (`MEMBER` owning booking or `ADMIN`).
- **Repository Method:** `bookingRepository.cancelBookingWithSeatIncrement(bookingId, classId)`
- **Success Response (200 OK):** `{ success: true, data: { id, status: "CANCELLED", cancelledAt, availableSeatsRemaining: number } }`

### 5.11 GET `/api/bookings/history`
- **Purpose:** Retrieves paginated booking history for authenticated user.
- **Auth Required:** Yes.
- **Query Parameters:** `page` (default 1), `limit` (default 10).
- **Repository Method:** `bookingRepository.findByUserIdPaginated(userId, skip, limit)`
- **Success Response (200 OK):** `{ success: true, data: { records: [...], pagination: { page, limit, total, hasNextPage, hasPreviousPage } } }`

---

## 6. Detailed Booking Concurrency Implementation

The critical booking transaction logic resides inside `app/repositories/booking.repository.ts`:

```typescript
async createBookingWithSeatDecrement(userId: string, classId: string, existingBooking?: any): Promise<any> {
  return measureSpan('REPOSITORY', 'bookingRepository.createBookingWithSeatDecrement', async () => {
    return prisma.$transaction(async (tx) => {
      // 1. Pessimistic Row Locking on FitnessClass
      const classes = await tx.$queryRaw<any[]>`
        SELECT id, capacity, "availableSeats" 
        FROM "FitnessClass" 
        WHERE id = ${classId} 
        FOR UPDATE
      `;

      if (!classes || classes.length === 0) {
        throw new NotFoundError(`Fitness class with ID ${classId} does not exist.`);
      }

      const currentClass = classes[0];
      if (currentClass.availableSeats <= 0) {
        throw new ConflictError("The selected class is already fully booked.");
      }

      let bookingRecord;
      if (existingBooking) {
        // Reactivate a cancelled booking
        bookingRecord = await tx.booking.update({
          where: { id: existingBooking.id },
          data: { status: BookingStatus.ACTIVE, bookedAt: new Date(), cancelledAt: null }
        });
      } else {
        // Check for duplicate active booking inside lock
        const existingActive = await tx.booking.findFirst({
          where: { userId, classId, status: BookingStatus.ACTIVE }
        });
        if (existingActive) {
          throw new ConflictError("You have already booked a slot in this class.");
        }

        // Create new active booking record
        bookingRecord = await tx.booking.create({
          data: { userId, classId, status: BookingStatus.ACTIVE }
        });
      }

      // Decrement availableSeats bounded strictly between 0 and capacity
      const newAvailable = Math.max(0, Math.min(currentClass.capacity, currentClass.availableSeats - 1));
      const updatedClass = await tx.fitnessClass.update({
        where: { id: classId },
        data: { availableSeats: newAvailable }
      });

      return { booking: bookingRecord, availableSeatsRemaining: updatedClass.availableSeats };
    });
  });
}
```

---

## 7. Optimistic UI Implementation Details

Implemented in `DashboardLayout` (`app/(dashboard)/layout.tsx`):

- **Optimistic State Tracking:**
  - `bookedClassIds`: Array of class IDs currently booked by user.
  - `optimisticSeatDeltas`: Key-value map (`{ [classId]: deltaNumber }`) reflecting uncommitted seat offsets.
  - `pendingMutations`: Set of IDs currently executing network mutations.
- **Seat Calculation Helper:**
  ```typescript
  const getOptimisticAvailableSeats = (classId: string, baseAvailableSeats: number) => {
    const delta = optimisticSeatDeltas[classId] || 0;
    return Math.max(0, baseAvailableSeats + delta);
  };
  ```
- **Mutation Handler (`toggleBookClass`):**
  1. Captures snapshot (`prevBookings`, `prevBookedClassIds`, `prevDeltas`).
  2. Updates local state immediately (`bookedClassIds`, `optimisticSeatDeltas`).
  3. Executes background network mutation (`bookClass` or `cancelBooking`).
  4. On success: Reconciles state with fresh server data.
  5. On failure: Restores snapshot state and calls `toast.error()`.

---

## 8. Database Schema Definition (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  MEMBER
  ADMIN
}

enum BookingStatus {
  ACTIVE
  CANCELLED
}

model User {
  id         String         @id @default(cuid())
  name       String
  email      String         @unique
  password   String
  role       Role           @default(MEMBER)
  employeeId String?        @unique
  gender     String?
  age        Int?
  bookings   Booking[]
  classes    FitnessClass[]
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt
}

model FitnessClass {
  id               String    @id @default(cuid())
  title            String
  description      String
  instructor       String
  instructorId     String?
  instructorUser   User?     @relation(fields: [instructorId], references: [id], onDelete: SetNull)
  category         String
  imageUrl         String
  location         String
  detailedLocation String?
  startTime        DateTime
  endTime          DateTime
  capacity         Int
  availableSeats   Int
  price            Float     @default(0.0)
  bookings         Booking[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([startTime])
  @@index([location])
  @@index([instructorId])
}

model Booking {
  id          String        @id @default(cuid())
  userId      String
  classId     String
  status      BookingStatus @default(ACTIVE)
  bookedAt    DateTime      @default(now())
  cancelledAt DateTime?
  createdAt   DateTime      @default(now())
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  class       FitnessClass  @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@unique([userId, classId])
  @@index([userId])
  @@index([classId])
  @@index([status])
}
```

---

## 9. Error Handling Framework

Located in `app/lib/utils.ts`:

- **`AppError` (Base Class):** Extends `Error` with `statusCode` property.
- **`NotFoundError`:** Maps to HTTP 404.
- **`ConflictError`:** Maps to HTTP 409 (used for double bookings or full classes).
- **`ValidationError`:** Maps to HTTP 400 (used for Zod parsing failures).
- **`UnauthorizedError`:** Maps to HTTP 401 (used for invalid auth sessions).
- **`ForbiddenError`:** Maps to HTTP 403 (used for missing role permissions).

Route handlers capture errors using standardized `catch` blocks and serialize them into standard `{ success: false, error: message }` JSON payloads.

---

## 10. Technical Debt & Codebase Discrepancies

1. **`app/(dashboard)/history/page.tsx` Placeholder:** The standalone `/history` page component returns `<></>` with a `// TODO` comment. History is currently rendered inside the `ProfileDrawer` component.
2. **Skeleton Hooks in `app/hooks/`:** Files like `useBookings.ts`, `useAuth.ts`, and `useClasses.ts` contain un-implemented `// TODO` function skeletons. UI components call `DashboardContext` and `app/lib/api/` request wrappers directly instead.
3. **Role Naming:** Historical product documentation references an `INSTRUCTOR` role, whereas the database schema implements `enum Role { MEMBER, ADMIN }`. Instructors are represented by `ADMIN` users or by string fields (`instructor`).
