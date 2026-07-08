# SlotTrack

A real-time fitness class booking system built for the **Cure.fit Class Booking System** problem statement as part of the **Simulated Work Integration (SWI)** project.

## Team Byte3

SlotTrack is developed by **Team Byte3**.

---

## About the Project

SlotTrack is a full-stack class booking platform that allows members to browse fitness classes, check live seat availability, book or cancel classes, and view their booking history.

The system focuses on maintaining accurate seat availability and preventing overbooking when multiple users attempt to book the same class simultaneously.

---

## Problem Statement

Cure.fit requires a class booking system with live seat availability.

When a member books a class, the available seat count should decrease immediately for all users. When a booking is cancelled, the seat should become available again.

The system must also prevent race conditions and overbooking during simultaneous booking requests.

Members should be able to view their attendance and booking history with pagination.

---

## Key Features

### Member Features

* User authentication
* Browse available fitness classes
* View live seat availability
* Book a fitness class
* Cancel a booking
* View booking history
* Paginated attendance history

### Admin Features

* Create fitness classes
* Edit class details
* Delete classes
* Set class capacity
* Schedule classes
* Monitor class bookings

### Booking System

* Live seat availability
* Duplicate booking prevention
* Race condition handling
* Overbooking prevention
* Database transaction-based booking
* Seat restoration after cancellation

---

## Tech Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| Frontend        | Next.js                                 |
| Backend         | Next.js Route Handlers / Server Actions |
| Database        | PostgreSQL                              |
| ORM             | Prisma                                  |
| Authentication  | Auth.js / NextAuth                      |
| Deployment      | Google Cloud Platform                   |
| Version Control | Git & GitHub                            |


   ---

## Technical Requirements

SlotTrack is designed around the following technical requirements:

- Responsive and user-friendly web application
- Secure authentication with role-based access control
- RESTful architecture for scalable backend services
- Transaction-safe booking operations to prevent overbooking
- Real-time seat availability synchronization
- Modular and maintainable codebase
- Efficient database design supporting concurrent users
- Paginated booking and attendance history

---

## Non-Functional Requirements

### Performance

- Fast booking and cancellation operations
- Support for concurrent booking requests
- Efficient pagination for booking history

### Security

- Secure authentication and authorization
- Protected routes based on user roles
- Input validation and secure handling of user data

### Scalability

- Modular application architecture
- Extensible backend services
- Database optimized for future feature expansion

---

---

## High-Level Booking Flow

```text
Member
   │
   ▼
Browse Available Classes
   │
   ▼
Select a Class
   │
   ▼
Book / Cancel
   │
   ▼
Backend Validation
   │
   ▼
Database Transaction
   │
   ▼
Update Seat Availability
   │
   ▼
Return Updated Data
   │
   ▼
Update User Interface
```

---

## Core Database Entities

### User

Stores member and administrator information.

* `id`
* `name`
* `email`
* `password`
* `role`
* `createdAt`

### Class

Stores fitness class information.

* `id`
* `title`
* `instructor`
* `description`
* `startTime`
* `endTime`
* `capacity`
* `availableSeats`
* `createdAt`

### Booking

Stores class booking information.

* `id`
* `userId`
* `classId`
* `status`
* `createdAt`

---

## Project Structure

```text
slottrack/
│
├── app/                    # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/
│   │   ├── classes/
│   │   ├── bookings/
│   │   ├── history/
│   │   └── admin/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── classes/
│   │   ├── bookings/
│   │   └── users/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── class/
│   ├── booking/
│   └── common/
│
├── controllers/
│   ├── auth.controller.ts
│   ├── class.controller.ts
│   ├── booking.controller.ts
│   └── user.controller.ts
│
├── services/
│   ├── auth.service.ts
│   ├── class.service.ts
│   ├── booking.service.ts
│   └── user.service.ts
│
├── repositories/
│   ├── auth.repository.ts
│   ├── class.repository.ts
│   ├── booking.repository.ts
│   └── user.repository.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations.ts
│   ├── constants.ts
│   └── utils.ts
│
├── middleware.ts
│
├── hooks/
│
├── types/
│
├── interfaces/
│
├── validations/
│
├── public/
│
├── styles/
│
├── .env
├── package.json
└── README.md
```

> The project structure may change as development progresses.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git

### Clone the Repository

```bash
git clone <repository-url>
cd slottrack
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL="your-postgresql-database-url"
AUTH_SECRET="your-auth-secret"
```

Do not commit the `.env` file to GitHub.

### Setup the Database

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Development Workflow

The `main` branch is protected.

All development must be completed using feature branches and Pull Requests.

```text
main
 │
 ├── feature/authentication
 ├── feature/class-management
 ├── feature/booking-system
 └── feature/booking-history
```

### Create a Feature Branch

```bash
git checkout -b feature/feature-name
```

### Push the Branch

```bash
git push -u origin feature/feature-name
```

Create a Pull Request on GitHub and request at least one team member to review the changes before merging.

Direct pushes to `main` are not allowed.

---

## MVP Scope

The initial version of SlotTrack includes:

* Authentication
* Role-based access
* Class management
* Class booking
* Booking cancellation
* Live seat availability
* Race condition handling
* Duplicate booking prevention
* Paginated booking history
* GCP deployment

---

## Future Enhancements

Potential future improvements include:

* Class search and filters
* Waitlist system
* Email notifications
* Calendar view
* WebSocket or Server-Sent Events based live updates
* Admin analytics dashboard
* Multi-center support

---

## Success Criteria

SlotTrack will be considered successful when:

* Members can book and cancel fitness classes.
* Seat availability remains accurate.
* Concurrent booking requests do not cause overbooking.
* Duplicate bookings are prevented.
* Members can view paginated booking history.
* Administrators can manage fitness classes.
* The application is successfully deployed on GCP.

---

## Documentation

Detailed product requirements and project planning can be found in the project documentation.

* `PRD.md` – Product Requirements Document
* Additional technical documentation will be added as development progresses.

---

## License

This project is developed for educational purposes as part of the **Simulated Work Integration (SWI)** course.
