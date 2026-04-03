# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Session Workflow (MANDATORY)

**At the start of every request:** Read both `CLAUDE.md` and `memory.md` (if it exists) before doing anything else.

**At the end of every request:** Update `memory.md` in the project root (`Website 2.0/memory.md`) with a concise entry summarizing what was just done. Entries must be short, information-dense, and append to the existing file — do not overwrite prior entries. Format:

```
### YYYY-MM-DD — <one-line summary of request>
- <bullet: key change/file/decision>
- <bullet: anything non-obvious worth remembering>
```

---

## Project Overview

**Nihanvi School of Dance** is a private, invite-only portal for a single Kuchipudi dance teacher and her students. There is no public-facing page — every route requires authentication. The site is **mobile-first**: the primary users (students and parents) are on phones.

---

## Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Database:** PostgreSQL via Neon (serverless)
- **ORM:** Prisma v7
- **Auth:** NextAuth v4 (credentials provider, JWT sessions)
- **Email:** Resend
- **Testing:** Vitest + Testing Library
- **Deployment:** Vercel
- **Node:** >= 20.19

---

## Dev Commands

```bash
npm run dev                              # Dev server at http://localhost:3000
npm test                                 # Run all tests
npx vitest run src/tests/lib/foo.test.ts # Run a single test file
npm run build                            # Production build (runs prisma generate first)
npx prisma migrate dev --name <name>     # Create and apply a migration
npx prisma studio                        # Browse the database
npm run seed                             # Seed the database (tsx prisma/seed.ts)
```

---

## Architecture

### Request Flow
```
Browser → Next.js Server Component (data fetch) → Client Component → Server Action → src/lib/ → Prisma → Neon PostgreSQL
```

### Key Layers

- **`src/lib/`** — Pure business logic, no Next.js imports. Each file owns one domain: `db.ts` (Prisma singleton), `users.ts`, `registrations.ts`, `tokens.ts`, `email.ts`, `sms.ts`, `auth.ts`, `homework.ts`, `announcements.ts`, `events.ts`, `payments.ts`, `submissions.ts`, `rsvps.ts`
- **`src/app/**/actions.ts`** — Server Actions (`'use server'`). Validate input, call `src/lib/`, return `{ status: 'error', message }` or redirect.
- **`src/components/forms/`** — Client Components (`'use client'`). Use `useFormState` + `useFormStatus` from `react-dom` (React 18 — **not** `useActionState`, which is React 19 only).
- **`src/app/**/page.tsx`** — Server Components. Fetch data directly, pass to Client Components.

### Prisma v7 Config
Prisma 7 does **not** allow `url =` in `schema.prisma`. The database URL is configured exclusively in `prisma.config.ts` (reads `process.env.DATABASE_URL`). `prisma.config.ts` also loads `.env.local` via dotenv for local dev.

---

## Route Structure

### Public
| Route | Purpose |
|---|---|
| `/login` | Credentials login; redirects to `/dashboard` (teacher) or `/portal` (student) |
| `/setup-password/[token]` | New student sets their password |
| `/enroll/[token]` | Invite-only enrollment form |
| `/enroll/success` | Post-enrollment confirmation |

### Teacher Dashboard (`/dashboard/*`) — teacher role only
`/dashboard`, `/dashboard/students`, `/dashboard/students/[id]`, `/dashboard/homework`, `/dashboard/announcements`, `/dashboard/events`, `/dashboard/payments`

### Student Portal (`/portal/*`) — student role only
`/portal`, `/portal/announcements`, `/portal/homework`, `/portal/events`

**Root `/` redirects to `/login`.** Middleware enforces role-based routing — teachers hitting `/portal` redirect to `/dashboard` and vice versa.

---

## Database Schema Notes

- Enum values are **uppercase**: `TEACHER`, `STUDENT`, `YES`, `NO`, `MAYBE`, `ZELLE`, `CASH`, `OTHER`, `PENDING`, `PAID`, `OVERDUE`, `ALL`, `LEVEL`, `STUDENT`
- `Payment.amount` is stored in **cents** (integer), displayed as dollars in the UI
- `Registration.dateOfBirth` is a `DateTime` — there is **no age field**, only DOB
- `levelGroup` is a free-text string (e.g. "Beginner", "Intermediate") — **not an enum**
- A `Registration` record is created before a `User` account — they are optionally linked

---

## Design System

### Brand Color Tokens (defined in `tailwind.config.ts`)
**Always use token names, never raw hex or generic Tailwind palette colors.**

| Token | Hex | Usage |
|---|---|---|
| `brand-orange` | `#E8820C` | Primary CTA buttons, links, accents |
| `brand-yellow` | `#F5C518` | Highlight text |
| `brand-red` | `#C0392B` | Required field markers, errors |
| `brand-brown-dark` | `#3d1a00` | Headings, dark backgrounds |
| `brand-brown-mid` | `#7a2800` | Hover state on orange buttons |
| `brand-cream` | `#FFF8F0` | Unauthenticated page backgrounds |

### Fonts
- **Body:** Inter (Google Fonts via `next/font`)
- **Display/Logo:** Lobster Two (CSS variable `--font-lobster-two`, Tailwind class `font-display`)

### Recurring UI Patterns
- Cards: `bg-white rounded-2xl border border-gray-100 shadow-sm p-6`
- Inputs: `w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white`
- Primary button: `bg-brand-orange text-white font-bold py-4 rounded-lg text-sm hover:bg-brand-brown-mid transition-colors disabled:opacity-50`
- Unauthenticated pages: `bg-brand-cream`
- Authenticated pages: `bg-gray-50`
- Sidebar: fixed 240px wide on desktop (`lg:pl-60`), top bar on mobile (`pt-14`)
- Minimum touch targets: 44×44px; minimum body font size: 16px

---

## Code Conventions

- **Mobile-first Tailwind:** base class = mobile, `sm:` / `md:` / `lg:` for larger screens
- **`SubmitButton` must be a separate child component** so it can access `useFormStatus` context
- **Amounts:** stored in cents in DB, displayed as dollars in UI
- **Emails are fire-and-forget:** always `.catch(console.error)`, never throw, never block the response
- **External URLs:** always use `process.env.NEXT_PUBLIC_SITE_URL`, never hardcode

---

## Testing Conventions

- Tests live in `src/tests/`
- All external dependencies are mocked — no real DB or email calls
- **Prisma mock:** import `src/tests/mocks/prisma.ts` at the top of any lib test
- **Mock hoisting:** use `vi.hoisted(() => vi.fn())` for constants used inside `vi.mock()` factories (Vitest 4.x requirement)
- **Env guards:** `src/tests/setup.ts` seeds `NOTIFICATION_EMAIL` and `TWILIO_PHONE_NUMBER`
- `next/navigation`'s `redirect` throws internally — wrap in try/catch or assert on the mock

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth JWT secret |
| `NEXTAUTH_URL` | Full site URL |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for enrollment/setup links |
| `RESEND_API_KEY` | Resend API key |
| `NOTIFICATION_EMAIL` | Teacher's email (receives enrollment notifications) |
| `ZELLE_NUMBER` | Teacher's Zelle number (substituted into enrollment confirmation email) |
| `TWILIO_*` | Legacy placeholders — not used in V1, reserved for V2 WhatsApp |
