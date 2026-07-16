# SlotTrack

A real-time fitness class booking system built for the **Cure.fit Class Booking System** problem statement as part of the **Simulated Work Integration (SWI)** project.

## Team Byte3

SlotTrack is developed by **Team Byte3**.
Memeber : 
1. Parnil Vyawahare
2. Ruhaa Bhalerao
3. Prithvi Rajvanshi

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

## Pages and Features
### 1. User Dashboard

The User Dashboard allows members to discover available fitness classes and manage their upcoming schedule.

#### Features
- View available fitness classes.
- Display class name, instructor, date, and time.
- View live seat availability for each class.
- Navigate to the booking page by selecting a class.
- View upcoming booked classes in the Schedule section.
- Access the user profile.

---
### 2. Class Booking Page

The Class Booking Page displays detailed information about a selected fitness class and allows members to reserve a seat.

#### Class Details
- Class name and category.
- Class image.
- Date and time.
- Studio or class location.
- Instructor name.
- Current booked seats and total capacity.
- Live seat availability.

#### Booking Features
- View the number of seats currently available.
- Book a seat in the selected class.
- Seat availability updates after a successful booking.
- Prevent booking when the class reaches maximum capacity.
- Receive booking confirmation.

#### About the Class
- Description of the fitness class.
- Class duration.
- Intensity level.
- Equipment requirements.
- Maximum participant capacity.

#### About the Instructor
- Instructor name and profile image.
- Instructor specialization.
- Short instructor description.
- Certification information.
- Years of experience.

---
### 3. User Profile and Attendance History

The User Profile page allows members to view their fitness activity and previous class attendance.

#### Profile Information
- Member name and profile details.
- Basic account information.

#### Attendance Overview
- Visual representation of class attendance and fitness activity.
- Track attendance trends over time.

#### Attendance History
- View previously attended fitness classes.
- Display class name, date, instructor, and attendance status.
- Navigate through attendance records using pagination.
- View older and newer attendance records.

---

### 4. Instructor Dashboard

The Instructor Dashboard allows instructors to manage fitness classes and monitor class bookings.

#### Schedule
- View classes created by the instructor.
- Display upcoming classes.
- View class timings.
- View booked seats and total class capacity.
- Create a new fitness class.

#### Class History
- View previously created classes.
- Display class name, date, and time.
- View class capacity.
- View the number of booked seats.
- Access class management actions.
- Navigate through class records using pagination.

#### Class Management
- Create new fitness classes.
- Monitor live booking counts.
- View class capacity.
- Manage existing classes.

---

## Core System Features

- Real-time seat availability.
- Race-condition-safe class booking.
- Seat count decreases when a booking is confirmed.
- Cancelled bookings reopen seats.
- Prevention of overbooking.
- Paginated attendance history.
- Separate member and instructor interfaces.
- Responsive and consistent user interface.

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
## Design System:

### Font palette
- Heading : Manrope | 42 - Bold 
- SubHeading : Manrope | 24 - Semi-Bold
- Body : Manrope |  16 - Regular

### Colour palette
-Primary-BG: #F8F8FA
-Primary-Text: #111827
-Secondary-Text: #6B7280
-Accent : #72BF6A 
-Secondary-BG : #FEFDFE

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
## RoadMap

| Date | Progress |
|------|----------|
| **7 July 2026** | - Understood and analyzed the Cure.fit class booking problem statement.<br>- Finalized the project scope and core requirements.<br>- Set up the GitHub repository, initialized the project, and configured the team development workflow. |
| **8 July 2026** | - Created the **Product Requirements Document (PRD)**.<br>- Prepared the **Technical Requirements Document (TRD)**.<br>- Completed the project scaffolding, including folder structure, initial configuration, and technology setup. |
| **9 July 2026** | - Designed the complete **high-fidelity UI** in Figma.<br>- Finalized the system design for both Member and Admin workflows.<br>- Created responsive dashboard and booking interface designs to serve as the implementation blueprint. |

---


---

## License

This project is developed for educational purposes as part of the **Simulated Work Integration (SWI)** course.
