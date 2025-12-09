# Local Host Event: Event Ticketing Platform

A production-ready full-stack application designed for hosting and booking technology events. This platform facilitates a complete e-commerce lifecycle, including event creation, secure payments, digital ticket generation, and gate management via QR code scanning.

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Application Pages](#application-pages)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

## About the Project

This application resolves common challenges in event ticketing systems, specifically focusing on data integrity during high-concurrency sales and secure payment verification. It utilizes a modern "T3-style" stack to ensure type safety from the database to the frontend.

## Key Features

### User Features

- **Browse & Discovery:** Server-side search and offset-based pagination to handle large event lists.
- **Secure Booking:** Integrated Stripe Checkout with a custom verification pattern.
- **Discount System:** Support for coupon codes with usage limits and percentage-based discounts.
- **Digital Wallet:** access to purchased tickets with unique QR codes.
- **Email Notifications:** Automated purchase receipts via Resend.

### Admin Features

- **Event Management:** Create, edit, and delete events with cascading database cleanups.
- **Sales Analytics:** View revenue and ticket count per event.
- **Gatekeeper System:** Built-in QR code scanner (camera integration) to verify and mark tickets as "USED" in real-time.

### Technical Highlights

- **Concurrency Control:** Uses atomic database transactions and SQL check constraints to prevent overselling tickets (race conditions).
- **Payment Verification:** Implements a pull-based verification pattern instead of webhooks to ensure transaction reliability without network tunnel dependencies.
- **Role-Based Access Control (RBAC):** Distinguishes between standard users and administrators via database roles.

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Authentication:** Clerk
- **Payments:** Stripe
- **Email:** Resend
- **Utilities:** html5-qrcode (Scanning), qrcode.react (Generation), lucide-react (Icons)

## System Architecture

The application moves away from traditional webhooks for the critical payment path. Instead, it uses a verification strategy:

1. User is redirected to Stripe with metadata (User ID, Ticket ID) attached to the session.
2. Upon redirecting to the success page, the server validates the session status directly with Stripe.
3. If valid, the server performs an atomic transaction: Upsert User -> Create Order -> Create Ticket -> Decrement Stock.

## Database Design

The database is normalized and relies on strict foreign key relationships.

**Core Models:**

- **User:** Stores identity and role (Admin/User).
- **Event:** Contains details like title, date, location, and organizer ID.
- **TicketVariant:** Represents price tiers (e.g., VIP, General) and manages stock inventory.
- **Coupon:** Stores discount codes, usage limits, and event associations.
- **Order:** Links a User to a Stripe Payment ID and total amount.
- **Ticket:** The unique digital asset linking an Order to an Event. Contains the unique QR token and status (VALID/USED).

**Concurrency Safety:**
A SQL Check Constraint (`CHECK "totalStock" >= 0`) is applied to the TicketVariant table to enforce inventory limits at the database engine level.

## Application Pages

- **/** (Home): Displays paginated events with a search bar.
- **/events/[id]:** Event details, ticket selection, and checkout initiation.
- **/events/create:** (Admin) Form to publish new events and define ticket tiers.
- **/events/[id]/edit:** (Admin) Interface to modify existing event details.
- **/account:** User dashboard showing purchased tickets; Admin dashboard showing organized events and sales stats.
- **/tickets/[id]:** A standalone "Boarding Pass" page displaying the large QR code for entry.
- **/admin/scan:** A mobile-optimized camera interface for verifying attendee tickets.

## Environment Variables

To run this project, you must set up the following variables in a `.env` file:

```env
# Database (Supabase / PostgreSQL)
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email (Resend)
RESEND_API_KEY=re_...

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Getting Started
Follow these steps to run the application locally:

Clone the repository

```
Bash

git clone [https://github.com/your-username/event-ticketing-platform.git](https://github.com/your-username/event-ticketing-platform.git)
cd event-ticketing-platform
Install dependencies
```

```
Bash

npm install
Set up the database Ensure your .env file is configured, then sync the schema:
```

```
Bash

npx prisma db push
Apply SQL Constraints (Important) Run this SQL in your database editor (Supabase SQL Editor) to prevent overselling:

SQL

ALTER TABLE "TicketVariant" ADD CONSTRAINT "stock_non_negative" CHECK ("totalStock" >= 0);
Run the development server
```

```
Bash

npm run dev
```
