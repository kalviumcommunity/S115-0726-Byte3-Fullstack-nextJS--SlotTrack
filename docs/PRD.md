# SlotTrack — Product Requirements Document (PRD)

> **Product Name:** SlotTrack  
> **Team:** Byte3 (Kalvium Simulated Work Integration — Track 1)  
> **Document Version:** 2.0  
> **Status:** Production / Implemented Architecture Audit  
> **Target Audience:** Product Reviewers, Evaluators, Engineering Lead, Onboarding Developers  

---

## 1. Executive Product Overview

### 1.1 Product Vision & Description
**SlotTrack** is a high-performance, full-stack fitness class reservation and attendance tracking platform inspired by the core class-booking requirements of Cure.fit. The application provides members with real-time class discovery, instant seat reservation, transparent cancellation management, and attendance history tracking. Simultaneously, it equips fitness instructors and administrators with comprehensive class scheduling, location management, capacity planning, and attendance monitoring tools.

### 1.2 Problem Statement
In fitness platforms, physical class capacity is strictly constrained by room limits. When high-demand classes open for booking, hundreds of concurrent users attempt to secure limited slots simultaneously. Naive reservation architectures suffer from severe flaws:
1. **Race Conditions & Overbooking:** Simultaneous HTTP requests execute read-then-write sequences, allowing multiple members to book the final available seat and driving seat counts below zero.
2. **Inconsistent Cancellation Restoration:** When members cancel, seats must be reopened immediately without double-incrementing or exceeding maximum room capacity.
3. **Perceived User Latency:** Server-side database transactions over WAN connections introduce roundtrip latency. Without optimistic client state management, users experience unresponsive UI buttons and click lag.
4. **Historical Visibility:** Members require transparent, paginated access to their past booking records for personal attendance tracking.

SlotTrack solves these core issues through an atomic database locking model, optimistic UI state updates, layered API architecture, and real-time seat synchronization.

### 1.3 Value Proposition
- **Guaranteed Zero-Overbooking:** Strict database row-level locking (`FOR UPDATE`) and composite unique constraints guarantee that class capacity is never exceeded regardless of concurrent traffic.
- **Instant Perceived Responsiveness:** Optimistic state management updates UI states (button states, seat counters, schedules) instantly (<10ms), handling backend synchronization asynchronously with automated rollback on failure.
- **Dual-Role Workflow Optimization:** Streamlined interfaces tailored for Members (discovery, booking, schedule) and Administrators (class creation, timetable editing, attendance history).

---

## 2. Product Goals & Non-Goals

### 2.1 Product Goals
- **G-1: Real-Time Seat Availability:** Provide exact, real-time available seat counts for all upcoming fitness classes across multiple city locations.
- **G-2: Atomic Concurrency Protection:** Guarantee that simultaneous booking or cancellation requests execute atomically without race conditions or overselling.
- **G-3: Responsive User Interaction:** Eliminate perceived UI latency for booking and scheduling actions through client-side optimistic updates.
- **G-4: Comprehensive Booking Lifecycle:** Support full reservation workflows including booking, cancellation, duplicate prevention, and past attendance history.
- **G-5: Efficient Class Management:** Enable authorized administrators/instructors to create, edit, delete, and monitor fitness classes with location and pricing controls.

### 2.2 Non-Goals (Explicitly Out of Scope)
- **NG-1: Payment Gateway Integration:** SlotTrack records class prices for display and tracking purposes but does not execute real-money transactions or credit card processing.
- **NG-2: Multi-Tenant Enterprise Waitlists:** Automated waitlist queueing with background notification workers is out of scope for the current release.
- **NG-3: Mobile Native Apps:** The application is built as a responsive web platform and does not include iOS/Android native app builds.
- **NG-4: WebSockets / Distributed SSE:** Real-time seat sync across disparate browser sessions relies on optimistic state reconciliation and on-demand refetching rather than active WebSocket subscriptions.

---

## 3. User Roles & Permissions Matrix

SlotTrack enforces role-based authorization across client interfaces and backend route handlers.

### 3.1 Role Definitions
- **MEMBER:** Default registered user. Members discover fitness classes, book available slots, cancel active reservations, edit personal profile details, and view attendance history.
- **ADMIN:** Authorized administrator/instructor. Admins possess full member capabilities plus access to the **Instructor Dashboard** (`/admin`), where they can create new classes, update schedule/location/capacity parameters, delete classes, and inspect all past class records.

### 3.2 Permissions Matrix

| Functional Capability | Unauthenticated Guest | MEMBER | ADMIN |
| :--- | :---: | :---: | :---: |
| Browse Upcoming Classes | Yes | Yes | Yes |
| Filter Classes by Location / Category | Yes | Yes | Yes |
| Member Registration & Login | Yes | Yes | Yes |
| Book Class Slot | No | **Yes** | **Yes** |
| Cancel Booking Slot | No | **Yes (Own)** | **Yes (Any)** |
| View Personal Schedule & Profile | No | **Yes** | **Yes** |
| View Paginated Booking History | No | **Yes** | **Yes** |
| Update Profile (Name, Age, Gender) | No | **Yes** | **Yes** |
| Access Admin Dashboard (`/admin`) | No | No | **Yes** |
| Create New Fitness Class | No | No | **Yes** |
| Edit Fitness Class Details | No | No | **Yes** |
| Delete Fitness Class | No | No | **Yes** |

---

## 4. Core User Journeys

### 4.1 Member Registration & Authentication Journey
```
Guest Visits Site ➔ Selects Register ➔ Submits Name, Email, Password
  ➔ System Hashes Password (bcrypt) & Creates Account (Role: MEMBER)
  ➔ Redirects to Login ➔ Authenticates Credentials
  ➔ Issues JWT Session Cookie ➔ Redirects to Booking Dashboard (`/dashboard`)
```

### 4.2 Member Class Discovery & Booking Journey
```
Member Views Dashboard ➔ Selects City Filter (e.g., Pune / Bangalore / Mumbai)
  ➔ Browses Fitness Class Cards ➔ Inspects Seat Count & Category
  ➔ Clicks "Book Slot" ➔ UI Optimistically Updates ("Booked", Seat -1)
  ➔ Asynchronous POST /api/bookings Request Executes
  ➔ [Success] State Reconciled with Database ➔ Toast: "Slot booked successfully"
  ➔ [Failure] Rollback UI State (Re-enable Button, Restore Seat) ➔ Toast Error Displayed
```

### 4.3 Member Cancellation Journey
```
Member Views Schedule / Booking Card ➔ Clicks "Cancel Booking"
  ➔ UI Optimistically Updates (Remove from Schedule, Seat +1)
  ➔ Asynchronous CANCEL /api/bookings/:id Request Executes
  ➔ Database Transaction Sets Booking status: CANCELLED & Increments Available Seats
  ➔ [Success] State Reconciled ➔ Toast: "Booking cancelled successfully"
  ➔ [Failure] Rollback UI State ➔ Toast Error Displayed
```

### 4.4 Admin Class Management Journey
```
Admin Logged In ➔ Navigates to Instructor Dashboard (`/admin`)
  ➔ Views Upcoming Schedule & Class History Table
  ➔ Clicks "Create New Class" ➔ Enters Title, Category, Location, Detailed Location, Date, Start/End Time, Capacity, Price
  ➔ Clicks Submit ➔ Modal Closes Instantly ➔ Card Optimistically Inserted into UI ("Syncing...")
  ➔ POST /api/classes Executes ➔ Database Persists Class Record
  ➔ UI Reconciles with Server Response (Replaces Temp Card)
```

---

## 5. Functional Requirements by Module

### 5.1 Authentication Module
- **FR-AUTH-1 (Registration):** The system shall allow new users to register with `name`, `email`, `password`, `age`, `gender`, and optional `employeeId`. Email must be unique. Passwords must be hashed using `bcrypt` (10 rounds). Default role assigned is `MEMBER`.
- **FR-AUTH-2 (Login):** The system shall validate email and password credentials against stored hashes. On success, it shall issue a NextAuth JWT session cookie.
- **FR-AUTH-3 (Session Guard):** Protected routes (`/dashboard`, `/admin`) and API handlers shall verify JWT session validity, returning HTTP 401 Unauthorized for invalid sessions.
- **FR-AUTH-4 (Profile Retrieval & Update):** Users shall be able to fetch their profile (`GET /api/auth/profile`) and update properties (`PATCH /api/auth/profile`) including name, age, and gender, dynamically updating active sessions.

### 5.2 Classes Module
- **FR-CLS-1 (Class Catalogue Retrieval):** The system shall return all upcoming fitness classes (`GET /api/classes`), ordered by `startTime` ascending.
- **FR-CLS-2 (Location & Category Filtering):** The catalogue shall support location filtering (`?location=Pune`) with automatic city alias matching (e.g., "Bangalore" matches "Indiranagar", "Koramangala", "HSR") and category filtering (`?category=Strength`).
- **FR-CLS-3 (Class Creation):** Authorized Admins shall create new classes (`POST /api/classes`) specifying title, description, category, instructor name, location, detailed location (e.g., "Amanora Mall, 5th Floor"), startTime, endTime, capacity, price, and imageUrl. `availableSeats` shall automatically initialize to `capacity`.
- **FR-CLS-4 (Class Editing):** Admins shall update class attributes (`PATCH /api/classes/:id`). If capacity is updated, available seats must be safely recalculated.
- **FR-CLS-5 (Class Deletion):** Admins shall delete classes (`DELETE /api/classes/:id`). Cascade deletion shall automatically clean up associated booking records.

### 5.3 Booking & Concurrency Module
- **FR-BKG-1 (Atomic Booking Execution):** When a member books a class (`POST /api/bookings`), the system shall execute an atomic database transaction using row-level locking (`FOR UPDATE` on `FitnessClass`).
- **FR-BKG-2 (Capacity Enforcement):** If `availableSeats` is zero or less, the system shall abort the transaction and return HTTP 409 Conflict ("The selected class is already fully booked.").
- **FR-BKG-3 (Duplicate Booking Prevention):** The system shall enforce duplicate booking checks at both application layer (active booking check within transaction lock) and database layer (`@@unique([userId, classId])` schema constraint).
- **FR-BKG-4 (Seat Decrement):** Upon successful booking, `FitnessClass.availableSeats` shall decrement by 1, strictly bounded between 0 and `capacity`.
- **FR-BKG-5 (Atomic Cancellation):** When a member cancels a booking (`PATCH /api/bookings/:id`), the system shall lock the booking and class rows. It shall set booking `status` to `CANCELLED`, set `cancelledAt` timestamp, and increment `availableSeats` by 1 up to `capacity`.
- **FR-BKG-6 (Cancellation Idempotency):** Cancelling an already-cancelled booking shall return success without double-incrementing available seats.

### 5.4 Booking History & Pagination Module
- **FR-HIS-1 (Paginated History):** The system shall provide a paginated history endpoint (`GET /api/bookings/history?page=1&limit=10`) returning active and cancelled booking records alongside class details and total pagination metadata.
- **FR-HIS-2 (User Profile Integration):** Member booking history shall be rendered inside the interactive Profile Drawer (`ProfileDrawer.tsx` / `HistoryTable.tsx`), displaying class name, category, date, and formatted time slot.

---

## 6. Business & Domain Rules

1. **Capacity Boundaries:** `0 <= availableSeats <= capacity` at all times. Database update logic uses `Math.max(0, Math.min(capacity, seats))` logic.
2. **Single Active Booking Rule:** A user may hold only **one active booking** per class slot. Re-booking a cancelled class reactivates the existing booking record rather than creating an orphaned row.
3. **Admin Ownership & Access:** Only users with `role === "ADMIN"` may access `/admin` or invoke class write/delete endpoints. Non-admin access redirects to `/dashboard`.
4. **Location Specificity:** Every class possesses a high-level city `location` (used for primary filtering) and an optional `detailedLocation` (used for venue directions).

---

## 7. Current Implementation Status Matrix

| Feature / Module | Status | Verification Source | Notes |
| :--- | :---: | :--- | :--- |
| NextAuth Credentials Auth | **Implemented** | `app/lib/auth.ts`, `app/api/auth/` | Uses JWT strategy & bcrypt |
| Member Class Discovery | **Implemented** | `app/(dashboard)/dashboard/page.tsx` | Full UI grid with category icons |
| City & Category Filters | **Implemented** | `LocationSelector.tsx`, `classRepository.ts` | Case-insensitive alias matching |
| Atomic Concurrency Booking | **Implemented** | `booking.repository.ts` | Uses `prisma.$transaction` + `FOR UPDATE` |
| Idempotent Cancellation | **Implemented** | `booking.repository.ts` | Atomic seat increment with cap bounds |
| Optimistic Booking UI | **Implemented** | `app/(dashboard)/layout.tsx` | Instant state update with rollback |
| Optimistic Admin Operations | **Implemented** | `app/(dashboard)/admin/page.tsx` | Instant create/edit/delete with sync badge |
| Paginated History API | **Implemented** | `GET /api/bookings/history` | `findByUserIdPaginated` with transaction count |
| Detailed Venue Location | **Implemented** | `FitnessClass` schema, Forms | Displayed across cards and tables |
| Containerized Docker Build | **Implemented** | `Dockerfile`, `docker-compose.yml` | Multi-stage Alpine standalone build |
| E2E / API Performance Profiler | **Implemented** | `scripts/`, `perf-logger.ts` | Microsecond level layer timing |
| WebSocket Live Seat Stream | **Not Implemented** | Code Audit | Out of scope; relies on optimistic polling |
