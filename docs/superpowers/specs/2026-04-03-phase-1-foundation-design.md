# Phase 1: Foundation — Design Spec

**Project:** Nihanvi School of Dance  
**Date:** 2026-04-03  
**Status:** Approved

---

## Overview

Phase 1 establishes the complete project scaffold, database schema, authentication system, and all public auth-related pages. No feature pages are built here — only the foundation that every other phase depends on.

---

## 1. Project Scaffold

### Dependencies
- Next.js 14.2 (App Router)
- TypeScript
- Tailwind CSS v3 with custom brand tokens
- Prisma v7 with `prisma.config.ts` at the **project root** (not inside `prisma/`)
- NextAuth v4 (credentials provider, JWT sessions)
- Resend (email)
- bcryptjs (password hashing)
- Vitest + Testing Library (testing)
- tsx (seed script runner)

### Key config files
| File | Location | Purpose |
|---|---|---|
| `tailwind.config.ts` | project root | brand color tokens, font classes |
| `prisma/schema.prisma` | `prisma/` | full data model — no `url =` line |
| `prisma.config.ts` | **project root** | reads `DATABASE_URL`; loads `.env.local` for local dev |
| `prisma/seed.ts` | `prisma/` | creates teacher account |
| `src/lib/db.ts` | `src/lib/` | Prisma singleton |
| `src/tests/setup.ts` | `src/tests/` | seeds test env vars |

### Brand tokens (in `tailwind.config.ts`)
| Token | Hex | Usage |
|---|---|---|
| `brand-orange` | `#E8820C` | Primary CTA buttons, links, accents |
| `brand-yellow` | `#F5C518` | Highlight text |
| `brand-red` | `#C0392B` | Required field markers, errors |
| `brand-brown-dark` | `#3d1a00` | Headings, dark backgrounds |
| `brand-brown-mid` | `#7a2800` | Hover state on orange buttons |
| `brand-cream` | `#FFF8F0` | Unauthenticated page backgrounds |

### Fonts
- **Body:** Inter (via `next/font/google`)
- **Display/Logo:** Lobster Two (CSS variable `--font-lobster-two`, Tailwind class `font-display`)

### React 18 constraint — IMPORTANT
This project uses **React 18**. Use `useFormState` and `useFormStatus` from `react-dom`.  
**Do NOT use `useActionState`** — that is React 19 only and will silently fail or throw at runtime.

### SubmitButton pattern — IMPORTANT
Every form must have a `SubmitButton` as a **separate child component** (not inline) so it can access the `useFormStatus` context. This is a project-wide convention enforced from Phase 1.

---

## 2. Database Schema

### Changes from base PRD schema
- `User` model: remove `setupToken`, `setupTokenUsed`, `setupTokenExpires`
- `User` model: add `passwordLastChangedAt DateTime?`
- New `Token` model (replaces all user-scoped token columns)

### Full schema

```prisma
enum UserRole       { TEACHER  STUDENT }
enum TokenType      { SETUP    RESET }
enum HomeworkTarget { ALL  LEVEL  STUDENT }
enum RsvpResponse   { YES  NO  MAYBE }
enum PaymentMethod  { ZELLE  CASH  OTHER }
enum PaymentStatus  { PENDING  PAID  OVERDUE }

model User {
  id                    String    @id @default(cuid())
  name                  String
  email                 String    @unique
  passwordHash          String
  role                  UserRole
  levelGroup            String?
  registrationId        String?   @unique
  active                Boolean   @default(true)
  passwordLastChangedAt DateTime?
  createdAt             DateTime  @default(now())

  registration          Registration? @relation(fields: [registrationId], references: [id])
  tokens                Token[]
  homeworkTargeted      Homework[]
  submissions           Submission[]
  rsvps                 Rsvp[]
  payments              Payment[]
}

model Token {
  id        String    @id @default(cuid())
  userId    String
  type      TokenType
  token     String    @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Registration.email is intentionally NOT @unique — a parent may enroll
// multiple children with the same contact email. User.email IS @unique.
model Registration {
  id                    String   @id @default(cuid())
  studentName           String
  dateOfBirth           DateTime
  parentName            String
  primaryPhone          String
  alternativePhone      String?
  address               String
  email                 String
  experience            String?
  certificationInterest Boolean
  performanceInterest   Boolean
  medicalConditions     String?
  signature             String
  signedDate            DateTime
  enrollToken           String?  @unique
  tokenUsed             Boolean  @default(false)
  createdAt             DateTime @default(now())

  user                  User?
}

model Homework {
  id              String         @id @default(cuid())
  targetType      HomeworkTarget
  targetLevel     String?
  targetStudentId String?
  youtubeUrl      String
  description     String?
  dueDate         DateTime?
  archived        Boolean        @default(false)
  postedAt        DateTime       @default(now())

  targetStudent   User?          @relation(fields: [targetStudentId], references: [id])
  submissions     Submission[]
}

model Submission {
  id              String    @id @default(cuid())
  homeworkId      String
  studentId       String
  markedDone      Boolean   @default(false)
  doneAt          DateTime?
  videoUrl        String?
  teacherFeedback String?
  updatedAt       DateTime  @updatedAt

  homework        Homework  @relation(fields: [homeworkId], references: [id])
  student         User      @relation(fields: [studentId], references: [id])

  @@unique([homeworkId, studentId])
}

model Announcement {
  id           String   @id @default(cuid())
  targetLevel  String?
  body         String
  postedAt     DateTime @default(now())
}

model Event {
  id          String   @id @default(cuid())
  title       String
  eventDate   DateTime
  description String?
  createdAt   DateTime @default(now())

  rsvps       Rsvp[]
}

model Rsvp {
  id        String       @id @default(cuid())
  eventId   String
  studentId String
  response  RsvpResponse
  updatedAt DateTime     @updatedAt

  event     Event        @relation(fields: [eventId], references: [id])
  student   User         @relation(fields: [studentId], references: [id])

  @@unique([eventId, studentId])
}

model Payment {
  id        String         @id @default(cuid())
  studentId String
  amount    Int
  dueDate   DateTime
  paidDate  DateTime?
  method    PaymentMethod?
  status    PaymentStatus  @default(PENDING)
  notes     String?
  createdAt DateTime       @default(now())

  student   User           @relation(fields: [studentId], references: [id])
}
```

### Seed (`prisma/seed.ts`)
Creates a single teacher account:
- Email: `aneeshparasa@gmail.com`
- Password: `nihanvi123` hashed with `bcryptjs` (saltRounds=12)
- Role: `TEACHER`
- `passwordLastChangedAt`: set to seed execution timestamp

> **Production note:** This is a dev/staging seed only. The teacher must change her password after first login in production.

---

## 3. Business Logic Layer (`src/lib/`)

### `tokens.ts`

#### `createToken(userId, type, expiresInHours): Promise<string>`
- Generates `crypto.randomBytes(32).toString('hex')` — 64-char hex string
- Inserts a `Token` row: `{ userId, type, token, expiresAt: now + expiresInHours }`
- Returns the raw token string (used to build the email URL)
- Token expiry: `RESET` tokens expire in **1 hour**; `SETUP` tokens expire in **72 hours**

#### `validateAndConsumeToken(token, type): Promise<{ valid: true, userId: string } | { valid: false, reason: 'not_found' | 'wrong_type' | 'expired' | 'already_used' }>`
- **Atomic operation**: single Prisma transaction that:
  1. Finds the token row by `token` string
  2. Returns `{ valid: false, reason: 'not_found' }` if not found
  3. Returns `{ valid: false, reason: 'wrong_type' }` if `type` doesn't match
  4. Returns `{ valid: false, reason: 'expired' }` if `expiresAt < now`
  5. Returns `{ valid: false, reason: 'already_used' }` if `usedAt` is set
  6. Sets `usedAt = now` and returns `{ valid: true, userId }`
- Validation and consumption are a single transaction — no race condition window

> Note: `validateToken` and `consumeToken` as separate functions are NOT implemented. Only `validateAndConsumeToken` exists, ensuring atomicity.

### `auth.ts`
- NextAuth credentials provider: looks up user by email, compares password with `bcryptjs.compare`, returns `{ id, name, email, role }` on success or `null` on failure
- Rejects login if `user.active === false`
- JWT callback: adds `id` and `role` to token
- Session callback: exposes `id` and `role` on `session.user`

### `email.ts`
- `sendPasswordResetEmail(to: string, resetUrl: string): Promise<void>` — sends branded reset link email via Resend; fire-and-forget
- All emails: `.catch(console.error)`, never throw, never block the caller

> `sendSetupEmail` is **Phase 2** — it is not implemented here.

### `users.ts`
- `setPassword(userId: string, newPassword: string): Promise<void>` — hashes password with bcryptjs (saltRounds=12), updates `passwordHash` and sets `passwordLastChangedAt = now()`

---

## 4. File Structure

```
src/
  app/
    (auth)/                        ← route group, shared auth layout
      layout.tsx                   ← bg-brand-cream, centered, logo above card
      login/
        page.tsx                     ← Client Component, uses signIn() from next-auth/react
      forgot-password/
        page.tsx
        actions.ts
        sent/
          page.tsx
      reset-password/
        [token]/
          page.tsx
          actions.ts
      setup-password/
        [token]/
          page.tsx
          actions.ts
  components/
    forms/
      SubmitButton.tsx              ← shared SubmitButton using useFormStatus
  lib/
    db.ts
    tokens.ts
    auth.ts
    email.ts
    users.ts
  middleware.ts
  tests/
    lib/
      tokens.test.ts
      auth.test.ts
      users.test.ts
      email.test.ts
    mocks/
      prisma.ts
    setup.ts
prisma/
  schema.prisma
  seed.ts
prisma.config.ts                   ← project root
tailwind.config.ts
```

---

## 5. Server Actions

All actions return `{ status: 'error', message: string }` on failure, or redirect on success.

### `/login` page — client-side submit (NOT a Server Action)

NextAuth v4's `signIn()` is a **client-side function** from `next-auth/react` and cannot be called inside a `'use server'` function. The login page uses a standard client-side submit handler instead:

- Login page (`page.tsx`) is a **Client Component** (`'use client'`)
- On submit, calls `signIn('credentials', { email, password, redirect: false })` from `next-auth/react`
- On `error` in the result: show inline error "Invalid email or password."
- On success: call `getSession()` to read the role, then `router.push('/dashboard')` (TEACHER) or `router.push('/portal')` (STUDENT) using `useRouter`
- No `actions.ts` file for the login route

### `src/app/(auth)/forgot-password/actions.ts`
**`forgotPasswordAction(prevState, formData)`**
- Reads: `email`
- Validates: valid email format
- Looks up user by email — **always redirects to `/forgot-password/sent` regardless of result**
- If user found and active:
  1. `createToken(userId, 'RESET', 1)` → raw token
  2. Construct `resetUrl = ${NEXT_PUBLIC_SITE_URL}/reset-password/${token}`
  3. `sendPasswordResetEmail(user.email, resetUrl).catch(console.error)`
- Redirect to `/forgot-password/sent` (unconditional — no email enumeration)

### `src/app/(auth)/reset-password/[token]/actions.ts`
**`resetPasswordAction(prevState, formData)`**
- Reads: `token` (from form hidden field), `password`, `confirmPassword`
- Validates: passwords match, password ≥ 8 characters
- Calls: `validateAndConsumeToken(token, 'RESET')`
  - On `valid: false`: return `{ status: 'error', message: 'token_invalid' }` (page renders error card)
- Calls: `setPassword(userId, password)`
- Redirect to `/login?reset=success`
- The `/login` page reads the `reset` query param and shows a success banner: "Password updated. You can now sign in."

### `src/app/(auth)/setup-password/[token]/actions.ts`
**`setupPasswordAction(prevState, formData)`**
- Same validation as reset
- Calls: `validateAndConsumeToken(token, 'SETUP')`
  - On `valid: false`: return `{ status: 'error', message: 'token_invalid' }`
- Calls: `setPassword(userId, password)`
- Redirect to `/portal`

---

## 6. Middleware (`src/middleware.ts`)

```
Public (no auth check):
  /login, /forgot-password, /forgot-password/sent,
  /reset-password/:token, /setup-password/:token

Protected:
  / → redirect to /login
  /dashboard/* → TEACHER only; STUDENT redirected to /portal
  /portal/* → STUDENT only; TEACHER redirected to /dashboard
  All other unauthenticated → /login
```

`/enroll/*` routes are **not** built or referenced in Phase 1 middleware — they are added in Phase 2.

---

## 7. UI Design

### Shared auth layout (`src/app/(auth)/layout.tsx`)
- Background: `bg-brand-cream` full screen
- Vertically + horizontally centered (`min-h-screen flex items-center justify-center`)
- "Nihanvi / School of Dance" in `font-display` (Lobster Two), `text-brand-brown-dark`, centered above the card
- White card: `bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full max-w-sm mx-auto`

### `/login`
- `h1` (sr-only): "Sign in to Nihanvi School of Dance"
- Fields: Email address (explicit `<label>`), Password (explicit `<label>`)
- "Forgot password?" link — `text-brand-orange`, min 44px touch target (achieved with `py-3`)
- Submit: `<SubmitButton>` "Sign In" — full-width, brand-orange, min-height 44px
- Success banner: if `?reset=success` query param present, show "Password updated. You can now sign in." in a green/brand banner above the card
- Error: inline below password field, `text-brand-red`, with SVG alert icon

### `/forgot-password`
- Card heading: "Reset your password"
- Subtext: "Enter your email and we'll send you a reset link."
- Field: Email address (explicit `<label>`)
- Submit: "Send reset link" — full-width, brand-orange
- Always navigates to `/forgot-password/sent` on submit
- Inline error for invalid email format only (format check before submit)

### `/forgot-password/sent`
- Card: SVG checkmark icon + "Check your email" heading + "If an account exists for that address, you'll receive a reset link shortly." body
- "Back to sign in" link — `text-brand-orange`

### `/reset-password/[token]`
- Card heading: "Set a new password"
- Fields: New password (explicit `<label>`, helper text: "At least 8 characters"), Confirm password (explicit `<label>`)
- Submit: "Update password" — full-width, brand-orange
- On invalid token (action returns `token_invalid`): replace card content with error — "This link has expired or is invalid." + "Request a new link →" linking to `/forgot-password`
- Mismatch error: inline below confirm field
- Too-short error: inline below new password field

### `/setup-password/[token]`
- Same layout as reset
- Card heading: "Welcome! Set your password"
- Subtext: "Choose a password to access your student portal."
- On invalid token: error card with "Back to sign in →" linking to `/login`

---

## 8. UI/UX Standards Applied

From UI/UX Pro Max skill — all auth pages must comply:
- **Accessibility**: Explicit `<label for>` on every input (no placeholder-only labels). Focus rings: 2px `ring-brand-orange` on all interactive elements. Heading hierarchy: `h1` (sr-only page title) → visible card headings as `h2`.
- **Touch targets**: All buttons and interactive links minimum 44×44px.
- **Forms & feedback**: Errors inline near the relevant field, with SVG icon. Never only at top.
- **Loading states**: `<SubmitButton>` renders spinner + "disabled" during pending state via `useFormStatus`.
- **Contrast**: `brand-brown-dark` on `brand-cream` and white exceeds 4.5:1. `brand-orange` on white passes for large/bold text.
- **No emoji icons**: SVG only (checkmark on success screen, alert triangle for errors).
- **Reduced motion**: Button transitions use `transition-colors` only; no layout animations.

---

## 9. Error Handling

| Scenario | Behavior |
|---|---|
| Invalid login credentials | Inline error below password field |
| Forgot password — invalid email format | Inline error below email field |
| Forgot password — account not found | Silently redirects to `/forgot-password/sent` (no enumeration) |
| Reset/setup token not found, wrong type, expired, or used | Error card rendered in place of the form |
| Reset password — passwords don't match | Inline error below confirm field |
| Reset password — password < 8 chars | Inline error below new password field |
| Server error on any form submit | Generic "Something went wrong. Please try again." inline error |

---

## 10. Testing (`src/tests/lib/`)

- **`tokens.test.ts`**: `createToken` inserts correctly; `validateAndConsumeToken` returns `not_found`, `wrong_type`, `expired`, `already_used`; valid token sets `usedAt` atomically
- **`auth.test.ts`**: valid credentials succeed; wrong password returns null; inactive user returns null; unknown email returns null
- **`users.test.ts`**: `setPassword` updates `passwordHash` and `passwordLastChangedAt`
- **`email.test.ts`**: `sendPasswordResetEmail` called with correct `to` and URL (Resend mocked)

`src/tests/setup.ts` seeds: `NOTIFICATION_EMAIL`, `TWILIO_PHONE_NUMBER`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`.

---

## 11. Environment Variables

| Variable | Phase 1 required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | NextAuth JWT secret |
| `NEXTAUTH_URL` | Yes | Full site URL |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used in reset/setup email links |
| `RESEND_API_KEY` | Yes | Resend API key |
| `NOTIFICATION_EMAIL` | Tests only | Required by `src/tests/setup.ts` env guard |
| `TWILIO_PHONE_NUMBER` | Tests only | Required by `src/tests/setup.ts` env guard |
| `ZELLE_NUMBER` | No (Phase 2) | Used in enrollment confirmation email |

---

## 12. Out of Scope (Phase 1)

- `/enroll/*` routes and enrollment flow → Phase 2
- `sendSetupEmail` function → Phase 2 (not implemented here)
- Student management pages → Phase 3
- "Resend setup link" button on student detail → Phase 3
- Dashboard / portal feature pages → Phases 4–5
- WhatsApp notifications → V2
