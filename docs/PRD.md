Product Requirements Document (PRD)
SlotTrack – Cure.fit Class Booking System
Team: Byte3
Members : Parnil Vyawahare, Prithvi Rajvanshi, Ruhaa Bhalerao.
Course: Simulated Work Integration (SWI)
Version: 1.0

________________________________________
1. Introduction
Project Overview
SlotTrack is a full-stack class booking system inspired by Cure.fit’s fitness class reservation platform. The system enables members to browse available classes, reserve seats in real time, cancel bookings, and view their attendance history. Administrators can create, manage, and monitor fitness classes.
The primary challenge is maintaining accurate seat availability while preventing overbooking when multiple users attempt to reserve the same seat simultaneously.
________________________________________
2. Problem Statement
Cure.fit requires a class booking system with live seat availability.
The system must:
•	Display accurate seat availability.
•	Decrease available seats immediately after a successful booking.
•	Restore seats immediately after a cancellation.
•	Prevent overbooking caused by concurrent booking requests (race conditions).
•	Allow members to view their booking history using pagination.
•	Allow administrators to manage classes.
________________________________________
3. Objectives
The project aims to:
•	Build a reliable class booking platform.
•	Provide real-time seat availability.
•	Prevent duplicate bookings and overbooking.
•	Ensure data consistency through database transactions.
•	Implement secure authentication and role-based authorization.
•	Deploy the application successfully on Google Cloud Platform (GCP).
________________________________________
4. Target Users
Member
Members can:
•	Register and log in
•	Browse available classes
•	Book fitness classes
•	Cancel bookings
•	View booking history
________________________________________
Administrator
Administrators can:
•	Create classes
•	Edit class details
•	Delete classes
•	Set class capacity and schedule
•	View bookings
________________________________________
5. Project Scope
In Scope
•	User authentication
•	Role-based authorization
•	Class management
•	Browse available classes
•	Book classes
•	Cancel bookings
•	Live seat availability
•	Booking history with pagination
•	Prevention of duplicate bookings
•	Prevention of race conditions
•	Deployment on GCP
Out of Scope (MVP)
•	Payment integration
•	Membership subscriptions
•	Mobile application
•	QR attendance
•	Push notifications
•	Multi-location support
•	Video streaming
________________________________________
6. Functional Requirements
Authentication
•	User registration
•	User login/logout
•	Role-based access control
•	Protected routes
________________________________________
Member Features
•	Browse available classes
•	View remaining seats
•	Book available classes
•	Cancel bookings
•	View booking history
•	Paginated booking history
________________________________________
Admin Features
•	Create classes
•	Edit classes
•	Delete classes
•	Set class capacity
•	Schedule classes
•	View bookings
________________________________________
Booking System
The system must:
•	Check seat availability before booking
•	Prevent duplicate bookings
•	Prevent overbooking
•	Update seat availability immediately
•	Restore seats after cancellation
________________________________________
7. Non-Functional Requirements
Performance
•	Fast page loading
•	Low booking response time
•	Efficient pagination
Reliability
•	Accurate seat counts
•	No data inconsistencies
•	Reliable booking transactions
Security
•	Password hashing
•	Secure authentication
•	Role-based authorization
•	Protected API endpoints
Scalability
The system should support future enhancements such as:
•	More users
•	More classes
•	Notifications
•	Real-time updates
________________________________________
8. User Stories
Authentication
As a new user, I want to register an account so that I can book fitness classes.
As a registered member, I want to log in securely so that I can access my bookings.
________________________________________
Browsing Classes
As a member, I want to browse available classes so that I can choose one to attend.
________________________________________
Booking
As a member, I want to reserve a seat so that my booking is confirmed.
As a member, I should not be able to book the same class more than once.
As a member, I should receive an appropriate message when a class is full.
________________________________________
Cancellation
As a member, I want to cancel my booking so another member can reserve the available seat.
________________________________________
Booking History
As a member, I want to view my previous bookings with pagination so that I can easily track my attendance.
________________________________________
Administration
As an administrator, I want to create, update, and delete classes so that schedules remain accurate.
________________________________________
9. MVP Features
User Management
•	User registration
•	User login
•	Role-based access
Class Management
•	Create class
•	Edit class
•	Delete class
•	View classes
Booking
•	Book class
•	Cancel booking
•	Prevent duplicate bookings
•	Prevent overbooking
Seat Availability
•	Display available seats
•	Update seats immediately after booking/cancellation
Booking History
•	Paginated booking history
•	Booking status
________________________________________
10. Stretch Goals
If time permits, additional features may include:
•	Search classes
•	Filter by instructor or date
•	Waitlist for full classes
•	Email notifications
•	Calendar integration
•	Real-time updates using WebSockets or Server-Sent Events (SSE)
•	Analytics dashboard
________________________________________
11. High-Level Workflow
Member Login
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
Refresh User Interface
________________________________________
12. Technical Stack
Layer	Technology
Frontend	Next.js
Backend	Next.js Route Handlers / Server Actions
Database	PostgreSQL
ORM	Prisma
Authentication	Auth.js (NextAuth)
Deployment	Google Cloud Platform (GCP)
Version Control	Git & GitHub
________________________________________
13. Initial Database Design
Users
•	id
•	name
•	email
•	password
•	role
•	createdAt
________________________________________
Classes
•	id
•	title
•	instructor
•	description
•	startTime
•	endTime
•	capacity
•	availableSeats
•	createdAt
________________________________________
Bookings
•	id
•	userId
•	classId
•	status
•	createdAt
________________________________________
14. Risks & Challenges
The primary technical challenges include:
•	Preventing race conditions during simultaneous bookings.
•	Maintaining accurate seat availability.
•	Preventing duplicate bookings.
•	Handling concurrent database transactions.
•	Implementing secure authentication and authorization.
________________________________________
15. Success Criteria
The project will be considered successful if:
•	Members can successfully book classes.
•	Members can cancel bookings.
•	Seat availability remains accurate.
•	Overbooking is prevented during concurrent booking requests.
•	Booking history supports pagination.
•	Administrators can manage classes efficiently.
•	Authentication and role-based access function correctly.
•	The application is deployed successfully on GCP.
________________________________________
16. Future Enhancements
Potential future improvements include:
•	Waitlist management
•	Email reminders
•	Calendar synchronization
•	Live updates using WebSockets or SSE
•	Analytics dashboard
•	Multi-center support
•	Membership and payment integration
