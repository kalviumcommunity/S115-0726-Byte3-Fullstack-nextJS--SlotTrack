Technical Requirements Document (TRD)
Project: Cure.fit Class Booking System
Version: 1.0
Technology Stack: MERN + Next.js + Socket.IO + MongoDB Transactions + JWT
1. Project Overview
Problem Statement
Cure.fit requires a real-time class booking system where users can view available fitness classes, seat availability updates instantly across all users, booking/cancellation avoids race conditions, users can view paginated booking history, and admins can manage classes and bookings.
2. Functional Requirements
Authentication
• User Registration
• User Login
• JWT Authentication
• Password Hashing (bcrypt)

Roles
• Admin
• Member

User Module
• Register/Login
• View & Update Profile
• Browse Classes
• Book/Cancel Class
• View Booking History
• Receive Live Seat Updates

Admin Module
• Manage Users (CRUD)
• Manage Classes (CRUD)
• Timetable Management
• Booking History
3. Frontend Requirements
Pages
• Login/Register
• Dashboard
• Profile
• Booking Page
• User Booking History (Pagination)
• Admin Dashboard
4. Backend Requirements
• JWT Authentication
• RBAC
• CRUD APIs for Users, Classes, Bookings
5. Database Models
User: name, email, password, role
Class: title, instructor, date, startTime, endTime, totalSeats, availableSeats
Booking: userId, classId, bookingStatus, bookedAt
6. API Endpoints
Auth:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

Users:
GET/PUT/DELETE /api/users/:id

Classes:
GET /api/classes
POST /api/classes
PUT /api/classes/:id
DELETE /api/classes/:id

Bookings:
POST /api/bookings
DELETE /api/bookings/:id
GET /api/bookings/history
7. Real-Time Features
Socket.IO Events
Client: joinClassRoom, bookSeat, cancelSeat
Server: seatUpdated, bookingSuccess, bookingFailed, classUpdated
8. Race Condition Handling
Use MongoDB Transactions:
1. Start transaction
2. Check available seats
3. Create booking
4. Decrement seats
5. Commit transaction
Rollback if class is full.
9. Pagination
Booking history supports page and limit parameters.
10. RBAC
Members can book/cancel and view own history. Admins manage users, classes, and bookings.
11. Non-Functional Requirements
Performance (<2s booking), Security (JWT, bcrypt, validation, CORS), Scalability (Modular architecture, Socket.IO, MongoDB indexing).
12. Folder Structure
client/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  sockets/
README.md
13. Technologies
Frontend: Next.js, React, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB
Realtime: Socket.IO
Authentication: JWT + bcrypt
Testing: Postman
Version Control: Git/GitHub
14. Deliverables
Authentication, User Dashboard, Profile, Booking System, Live Seat Availability,
Booking History with Pagination, Admin Dashboard, User Management,
Class CRUD, Timetable Management, MongoDB Transactions, RBAC,
REST APIs, Socket.IO, Responsive Frontend.
