Tech Stack

Framework: Next.js

Why: It gives you Server-Side Rendering (SSR) out of the box. Tech events need to be indexed by Google. A standard React (CRA/Vite) Single Page App (SPA) struggles with SEO. Next.js also blends backend and frontend, simplifying your deployment.

Language: TypeScript

Why: In a ticketing system, ticket_price cannot be a string "20". TypeScript catches these errors before you even run the code. It acts as self-documentation.

Database: PostgreSQL (hosted on Supabase)

Why: Ticketing data is highly relational (User -> Orders -> Tickets -> Events). NoSQL (MongoDB) is risky here because data consistency is harder to enforce. You don't want to sell a ticket that doesn't exist.

ORM: Prisma

Why: Writing raw SQL is error-prone. These tools give you type-safe database access.

Styling: Tailwind CSS + Shadcn/UI

Why: Shadcn gives you accessible, professional-looking components (Dates, Modals, Inputs) that you can copy-paste and own. It speeds up UI development by 10x.

Auth: Clerk

Why: Don't build auth from scratch. It’s a security risk.
