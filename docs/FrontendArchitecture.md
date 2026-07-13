# SlotTrack - Frontend Architecture Documentation

> Version: 1.0
> Project: SlotTrack - Cure.fit Class Booking System
> Framework: Next.js 15 (App Router)
> Styling: Tailwind CSS
> Language: TypeScript

---

# 1. Objective

This document defines the frontend architecture, component hierarchy, design system, folder structure, and development guidelines for the SlotTrack application.

It acts as the single source of truth for frontend implementation and should be followed while generating components using AI tools such as Figma MCP, Cursor, Claude, or ChatGPT.

The goal is to maintain:

- Component Reusability
- Consistent Design
- Scalable Codebase
- Clean Folder Structure
- Maintainable UI

---

# 2. Design Principles

The frontend should follow these principles:

- Component-first architecture
- Reusable UI over page-specific UI
- Composition over duplication
- Responsive by default
- Minimalistic and modern design
- Soft shadows
- Rounded corners
- Spacious layouts
- Clean typography
- Accessibility friendly

---

# 3. Technology Stack

| Layer | Technology |
|---------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Forms | React Hook Form |
| Validation | Zod |
| Images | next/image |
| Fonts | Sora + Manrope |

---

# 4. Folder Structure

app/
│
├── (auth)
│ ├── login
│ └── register
│
├── (dashboard)
│ ├── dashboard
│ ├── booking
│ ├── profile
│ └── admin
│
├── layout.tsx
├── globals.css
└── page.tsx

components/
│
├── ui/
├── layout/
├── navigation/
├── cards/
├── booking/
├── schedule/
├── profile/
├── forms/
├── tables/
├── feedback/
└── shared/

hooks/

lib/

types/

constants/

public/

styles/

---

# 5. UI Hierarchy

Pages

↓

Layouts

↓

Sections

↓

Feature Components

↓

Reusable Components

↓

Primitive Components

Never create page-specific components unless absolutely necessary.

---

# 6. Primitive Components

These components contain no business logic.

Button

Input

Textarea

Select

Dropdown

Avatar

Badge

Card

Modal

Drawer

Tooltip

Popover

Table

Skeleton

Spinner

Pagination

---

# 7. Shared Components

Navbar

Logo

Location Selector

Profile Dropdown

Search Bar

Empty State

Confirmation Modal

Page Header

Section Header

Breadcrumb

These components can be reused across multiple pages.

---

# 8. Feature Components

## Dashboard

ClassCard

ClassGrid

ScheduleSidebar

ScheduleItem

UpcomingClass

BookButton

## Booking

BookingSummary

BookingDetails

InstructorCard

BookingConfirmation

BookingStatus

## Profile

ProfileCard

ProfileDrawer

HistoryTable

BookingHistoryRow

## Admin

ClassOverviewCard

StatsCard

CreateClassForm

EditClassModal

ClassHistoryTable

AttendanceCard

---

# 9. Layouts

## Auth Layout

Centered authentication form

Used by

- Login
- Register

---

## Dashboard Layout

Navbar

↓

Page Content

Used by

- User Dashboard
- Booking Page
- Profile
- History

---

## Admin Layout

Navbar

↓

Admin Dashboard

---

# 10. Pages

## Login

Email

Password

Remember Me

Login Button

Register Link

---

## Register

Name

Email

Password

Confirm Password

Register Button

---

## User Dashboard

Navbar

↓

Available Classes Heading

↓

Scrollable 2x2 Class Grid

↓

Fixed Schedule Sidebar

---

## Booking Page

Navbar

↓

Back Button

↓

Class Hero

↓

Booking Widget

↓

Class Information

↓

Instructor Information

---

## Profile

Navbar

↓

Slide-over Drawer

↓

Profile Information

↓

Booking History

---

## Admin Dashboard

Navbar

↓

Today's Schedule

↓

Quick Stats

↓

Class History Table

↓

Create Class Button

---

# 11. Class Card Structure

Image

↓

Floating Category Badge

↓

Curved White Information Panel

↓

Class Title

↓

Time

↓

Date

↓

Location

↓

Book Button

Every class displayed throughout the application must use this component.

---

# 12. Schedule Sidebar

Heading

Today's Date

Scrollable Schedule Items

View Full Schedule Button

Each Schedule Item contains

Time

Class Name

Status

Location

---

# 13. Navigation Bar

Logo (Left)

Location Selector (Center)

Profile Dropdown (Right)

Navbar remains fixed across all dashboard pages.

---

# 14. Design Tokens

## Primary

#63C15B

## Background

#F8FAFC

## Surface

#FFFFFF

## Border

#E5E7EB

## Text Primary

#111827

## Text Secondary

#6B7280

## Success

#22C55E

## Danger

#EF4444

---

# 15. Typography

## Heading

Font

Sora

Weight

700

Size

36px

---

## Sub Heading

Font

Sora

Weight

600

Size

24px

---

## Body

Font

Manrope

Weight

400

Size

16px

---

## Small Text

14px

---

## Caption

12px

---

# 16. Border Radius

Cards

20px

Buttons

14px

Inputs

12px

Modal

24px

Badge

999px

---

# 17. Shadows

Cards

0px 8px 30px rgba(0,0,0,0.08)

Hover

0px 12px 40px rgba(0,0,0,0.12)

---

# 18. Spacing

Use only

4

8

12

16

20

24

32

40

48

64

Follow an 8-point spacing system.

---

# 19. Responsive Behaviour

Desktop

1440+

Laptop

1280

Tablet

768

Mobile

390

Dashboard

Desktop

2-column grid + sidebar

Tablet

1-column grid

Sidebar moves below grid

Mobile

Single-column cards

Schedule becomes bottom sheet or drawer

---

# 20. State Handling

Each page should support

Loading

Empty

Success

Error

Skeleton UI should be used while fetching data.

---

# 21. Naming Convention

PascalCase

Examples

ClassCard.tsx

BookingSummary.tsx

ProfileDrawer.tsx

Navbar.tsx

ScheduleSidebar.tsx

---

# 22. Component Guidelines

Each component should

- Be reusable
- Accept props
- Never contain hardcoded data
- Support loading states
- Support disabled states if applicable
- Follow TypeScript best practices
- Use semantic HTML
- Use Tailwind utility classes only

---

# 23. AI Generation Rules

When generating components with AI:

- Generate one component at a time.
- Never generate an entire page in one prompt.
- Match the Figma design exactly.
- Use reusable props.
- Avoid hardcoded values.
- Export components as default unless specified.
- Use Next.js conventions.
- Use next/image for images.
- Use Lucide React icons.
- Maintain responsive behaviour.

---

# 24. Development Order

Phase 1

Design Tokens

Typography

Colors

Spacing

---

Phase 2

Primitive Components

Buttons

Inputs

Cards

Tables

Modal

Drawer

---

Phase 3

Shared Components

Navbar

Profile Dropdown

Location Selector

Headers

---

Phase 4

Feature Components

Class Card

Schedule Sidebar

Booking Widget

Instructor Card

History Table

---

Phase 5

Pages

Login

Register

Dashboard

Booking

Profile

Admin Dashboard

---

Phase 6

API Integration

Authentication

Classes

Bookings

Profile

History

---

Phase 7

Animations

Loading States

Error Handling

Skeletons

Polish

---

# 25. Coding Standards

- Strict TypeScript
- Functional Components
- No inline styles
- Tailwind only
- Reusable hooks
- Reusable components
- No duplicated UI
- Keep components under ~250 lines where possible
- Prefer composition over inheritance

---

# 26. Final Goal

The SlotTrack frontend should resemble a modern SaaS dashboard with a clean, spacious, and premium interface.

Every page should feel visually consistent by reusing the same components, spacing, typography, and color system throughout the application.

The design should prioritize usability, readability, and maintainability while remaining scalable for future features.