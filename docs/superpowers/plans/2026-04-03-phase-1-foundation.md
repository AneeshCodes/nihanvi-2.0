# Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Nihanvi School of Dance Next.js 14.2 project with full database schema, authentication (login, forgot/reset password, setup password), and middleware — ready for feature phases to build on.

**Architecture:** Next.js 14.2 App Router with a `(auth)` route group for all public auth pages sharing a cream-background centered layout. Business logic lives in `src/lib/` (pure functions, no Next.js imports). Auth uses NextAuth v4 with a credentials provider + JWT; the login page calls `signIn()` client-side from `next-auth/react`. All token operations (setup, reset) go through a single `Token` table via an atomic `validateAndConsumeToken` transaction.

**Tech Stack:** Next.js 14.2, TypeScript, Tailwind CSS v3, Prisma v7, NextAuth v4, Resend, bcryptjs, Vitest + Testing Library, React 18 (`useFormState`/`useFormStatus` — NOT `useActionState`)

---

## File Map

```
prisma.config.ts                              ← project root; reads DATABASE_URL; loads .env.local
prisma/
  schema.prisma                               ← full schema (no url= line)
  seed.ts                                     ← creates teacher account
tailwind.config.ts                            ← brand color tokens + font classes
vitest.config.ts                              ← test config + @/ alias
src/
  types/
    next-auth.d.ts                            ← extend Session with id + role
  middleware.ts                               ← route protection via withAuth
  app/
    layout.tsx                                ← root layout (Inter + Lobster Two fonts)
    page.tsx                                  ← redirect / → /login
    api/
      auth/
        [...nextauth]/
          route.ts                            ← NextAuth v4 GET/POST handler
    (auth)/
      layout.tsx                              ← cream bg, centered, logo above card
      login/
        page.tsx                              ← Server Component; reads searchParams for reset banner
        LoginForm.tsx                         ← Client Component; signIn() from next-auth/react
      forgot-password/
        page.tsx                              ← email form; useFormState
        actions.ts                            ← server action; always redirects to /sent
        sent/
          page.tsx                            ← static confirmation
      reset-password/
        [token]/
          page.tsx                            ← new password form; useFormState
          actions.ts                          ← validateAndConsumeToken + setPassword
      setup-password/
        [token]/
          page.tsx                            ← same form as reset; useFormState
          actions.ts                          ← validateAndConsumeToken + setPassword
  components/
    forms/
      SubmitButton.tsx                        ← useFormStatus spinner button
  lib/
    db.ts                                     ← Prisma singleton
    tokens.ts                                 ← createToken, validateAndConsumeToken
    users.ts                                  ← setPassword
    email.ts                                  ← sendPasswordResetEmail
    auth.ts                                   ← authorizeUser + authOptions
  tests/
    setup.ts                                  ← seeds process.env test vars
    mocks/
      prisma.ts                               ← vi.mock('@/lib/db')
    lib/
      tokens.test.ts
      users.test.ts
      email.test.ts
      auth.test.ts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.env.local.example`

- [ ] **Step 1: Bootstrap Next.js 14.2**

```bash
cd "c:/Aneesh/Development/Websites/Nihanvi School Of Dance/Website 2.0"
npx create-next-app@14.2.29 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted: accept all defaults. If the directory is not empty, confirm overwrite.

- [ ] **Step 2: Install project dependencies**

```bash
npm install next-auth@^4.24.0 @prisma/client@^7 bcryptjs resend dotenv
npm install -D prisma@^7 @types/bcryptjs tsx vitest@^3 @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Create `.env.local.example`**

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=generate-a-secret-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=teacher@example.com
ZELLE_NUMBER=+15551234567
```

Copy to `.env.local` and fill in real values.

- [ ] **Step 4: Add seed script to `package.json`**

In `package.json`, add under `"scripts"`:
```json
"seed": "tsx prisma/seed.ts"
```

- [ ] **Step 5: Commit**

```bash
# If this directory is already inside a git repo, skip `git init`.
# If it's a new standalone repo, run it:
git init
git add .
git commit -m "feat: initial Next.js 14.2 scaffold with dependencies"
```

---

## Task 2: Tailwind Brand Tokens + Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Configure Tailwind brand tokens**

Replace the contents of `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange':     '#E8820C',
        'brand-yellow':     '#F5C518',
        'brand-red':        '#C0392B',
        'brand-brown-dark': '#3d1a00',
        'brand-brown-mid':  '#7a2800',
        'brand-cream':      '#FFF8F0',
      },
      fontFamily: {
        display: ['var(--font-lobster-two)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Add Google Fonts to root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter, Lobster_Two } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const lobsterTwo = Lobster_Two({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lobster-two',
})

export const metadata: Metadata = {
  title: 'Nihanvi School of Dance',
  description: 'Student & Teacher Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lobsterTwo.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx
git commit -m "feat: configure tailwind brand tokens and Google Fonts"
```

---

## Task 3: Prisma Schema + Config

**Files:**
- Create: `prisma.config.ts` (project root)
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Create `prisma.config.ts` at the project root**

```ts
// prisma.config.ts  — must be at the project root, NOT inside prisma/
import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local for local dev. Vercel injects DATABASE_URL directly.
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
})
```

> **Note for Prisma v7:** The database URL is read from `process.env.DATABASE_URL` automatically. Do NOT add `url = env("DATABASE_URL")` to schema.prisma — Prisma v7 forbids this.

- [ ] **Step 2: Write `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum UserRole       { TEACHER  STUDENT }
enum TokenType      { SETUP    RESET }
enum HomeworkTarget { ALL      LEVEL  STUDENT }
enum RsvpResponse   { YES      NO     MAYBE }
enum PaymentMethod  { ZELLE    CASH   OTHER }
enum PaymentStatus  { PENDING  PAID   OVERDUE }

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

  registration   Registration? @relation(fields: [registrationId], references: [id])
  tokens         Token[]
  homeworkTargeted Homework[]
  submissions    Submission[]
  rsvps          Rsvp[]
  payments       Payment[]
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

// Registration.email is NOT @unique — a parent may enroll multiple children.
// User.email IS @unique.
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

  homework  Homework  @relation(fields: [homeworkId], references: [id])
  student   User      @relation(fields: [studentId], references: [id])

  @@unique([homeworkId, studentId])
}

model Announcement {
  id          String   @id @default(cuid())
  targetLevel String?
  body        String
  postedAt    DateTime @default(now())
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

  event   Event @relation(fields: [eventId], references: [id])
  student User  @relation(fields: [studentId], references: [id])

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

- [ ] **Step 3: Run migration**

Make sure `.env.local` has a valid `DATABASE_URL` before running.

```bash
npx prisma migrate dev --name init
```

Expected: migration file created + client generated.

- [ ] **Step 4: Commit**

```bash
git add prisma.config.ts prisma/schema.prisma prisma/migrations/
git commit -m "feat: add full prisma schema and initial migration"
```

---

## Task 4: Prisma Singleton + Test Infrastructure

**Files:**
- Create: `src/lib/db.ts`
- Create: `vitest.config.ts`
- Create: `src/tests/setup.ts`
- Create: `src/tests/mocks/prisma.ts`

- [ ] **Step 1: Create Prisma singleton**

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 3: Create `src/tests/setup.ts`**

```ts
// src/tests/setup.ts
// Seed env vars that lib functions guard against missing
process.env.NOTIFICATION_EMAIL    = 'test-teacher@example.com'
process.env.TWILIO_PHONE_NUMBER   = '+15551234567'
process.env.NEXT_PUBLIC_SITE_URL  = 'http://localhost:3000'
process.env.RESEND_API_KEY        = 'test_resend_key'
process.env.NEXTAUTH_SECRET       = 'test_secret_32_chars_minimum_xx'
```

- [ ] **Step 4: Create Prisma mock**

```ts
// src/tests/mocks/prisma.ts
import { vi, beforeEach } from 'vitest'

export const prismaM = {
  user: {
    findUnique: vi.fn(),
    create:     vi.fn(),
    update:     vi.fn(),
  },
  token: {
    create:     vi.fn(),
    findUnique: vi.fn(),
    update:     vi.fn(),
  },
  $transaction: vi.fn((fn: (tx: typeof prismaM) => unknown) => fn(prismaM)),
}

vi.mock('@/lib/db', () => ({ db: prismaM }))

beforeEach(() => {
  vi.clearAllMocks()
})
```

- [ ] **Step 5: Add test script to `package.json`**

Ensure `"test": "vitest run"` is in `scripts`. (create-next-app may have added it — verify.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/db.ts vitest.config.ts src/tests/
git commit -m "feat: prisma singleton and vitest test infrastructure"
```

---

## Task 5: Token Library (TDD)

**Files:**
- Create: `src/lib/tokens.ts`
- Create: `src/tests/lib/tokens.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/tests/lib/tokens.test.ts
import '../mocks/prisma'
import { describe, it, expect, vi } from 'vitest'
import { prismaM } from '../mocks/prisma'
import { createToken, validateAndConsumeToken } from '@/lib/tokens'

const FUTURE = new Date(Date.now() + 60 * 60 * 1000)
const PAST   = new Date(Date.now() - 60 * 60 * 1000)

describe('createToken', () => {
  it('inserts a token row and returns the raw token string', async () => {
    prismaM.token.create.mockResolvedValue({ token: 'abc123' })
    const result = await createToken('user-1', 'SETUP', 72)
    expect(prismaM.token.create).toHaveBeenCalledOnce()
    const callArgs = prismaM.token.create.mock.calls[0][0].data
    expect(callArgs.userId).toBe('user-1')
    expect(callArgs.type).toBe('SETUP')
    expect(typeof callArgs.token).toBe('string')
    expect(callArgs.token.length).toBe(64) // 32 bytes → 64 hex chars
    expect(typeof result).toBe('string')
  })
})

describe('validateAndConsumeToken', () => {
  it('returns not_found when token does not exist', async () => {
    prismaM.$transaction.mockImplementation((fn: any) => fn({ token: { findUnique: vi.fn().mockResolvedValue(null), update: vi.fn() } }))
    const result = await validateAndConsumeToken('bad-token', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'not_found' })
  })

  it('returns wrong_type when type does not match', async () => {
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'SETUP', expiresAt: FUTURE, usedAt: null, userId: 'u1' }),
        update: vi.fn(),
      },
    }
    prismaM.$transaction.mockImplementation((fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'wrong_type' })
  })

  it('returns expired when expiresAt is in the past', async () => {
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'RESET', expiresAt: PAST, usedAt: null, userId: 'u1' }),
        update: vi.fn(),
      },
    }
    prismaM.$transaction.mockImplementation((fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'expired' })
  })

  it('returns already_used when usedAt is set', async () => {
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'RESET', expiresAt: FUTURE, usedAt: PAST, userId: 'u1' }),
        update: vi.fn(),
      },
    }
    prismaM.$transaction.mockImplementation((fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'already_used' })
  })

  it('sets usedAt and returns valid + userId on success', async () => {
    const updateMock = vi.fn().mockResolvedValue({})
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'RESET', expiresAt: FUTURE, usedAt: null, userId: 'u1' }),
        update: updateMock,
      },
    }
    prismaM.$transaction.mockImplementation((fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: true, userId: 'u1' })
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { usedAt: expect.any(Date) },
    })
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/tests/lib/tokens.test.ts
```

Expected: fail with "Cannot find module '@/lib/tokens'"

- [ ] **Step 3: Implement `src/lib/tokens.ts`**

```ts
// src/lib/tokens.ts
import crypto from 'crypto'
import { db } from './db'
import { TokenType } from '@prisma/client'

export async function createToken(
  userId: string,
  type: TokenType,
  expiresInHours: number
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex') // 64-char hex string
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
  await db.token.create({ data: { userId, type, token, expiresAt } })
  return token
}

export async function validateAndConsumeToken(
  token: string,
  type: TokenType
): Promise<
  | { valid: true; userId: string }
  | { valid: false; reason: 'not_found' | 'wrong_type' | 'expired' | 'already_used' }
> {
  return db.$transaction(async (tx) => {
    const record = await tx.token.findUnique({ where: { token } })

    if (!record)                      return { valid: false, reason: 'not_found' }
    if (record.type !== type)         return { valid: false, reason: 'wrong_type' }
    if (record.expiresAt < new Date()) return { valid: false, reason: 'expired' }
    if (record.usedAt)                return { valid: false, reason: 'already_used' }

    await tx.token.update({ where: { id: record.id }, data: { usedAt: new Date() } })
    return { valid: true, userId: record.userId }
  })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/tests/lib/tokens.test.ts
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tokens.ts src/tests/lib/tokens.test.ts
git commit -m "feat: token library with atomic validateAndConsumeToken"
```

---

## Task 6: Users Library (TDD)

**Files:**
- Create: `src/lib/users.ts`
- Create: `src/tests/lib/users.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/tests/lib/users.test.ts
import '../mocks/prisma'
import { describe, it, expect } from 'vitest'
import { prismaM } from '../mocks/prisma'
import { setPassword } from '@/lib/users'

describe('setPassword', () => {
  it('updates passwordHash and passwordLastChangedAt', async () => {
    prismaM.user.update.mockResolvedValue({})
    await setPassword('user-1', 'newPassword123')

    expect(prismaM.user.update).toHaveBeenCalledOnce()
    const args = prismaM.user.update.mock.calls[0][0]
    expect(args.where).toEqual({ id: 'user-1' })
    expect(typeof args.data.passwordHash).toBe('string')
    expect(args.data.passwordHash).not.toBe('newPassword123') // must be hashed
    expect(args.data.passwordLastChangedAt).toBeInstanceOf(Date)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/tests/lib/users.test.ts
```

- [ ] **Step 3: Implement `src/lib/users.ts`**

```ts
// src/lib/users.ts
import bcrypt from 'bcryptjs'
import { db } from './db'

export async function setPassword(userId: string, newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await db.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      passwordLastChangedAt: new Date(),
    },
  })
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/tests/lib/users.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/users.ts src/tests/lib/users.test.ts
git commit -m "feat: setPassword with bcrypt hashing and timestamp"
```

---

## Task 7: Email Library (TDD)

**Files:**
- Create: `src/lib/email.ts`
- Create: `src/tests/lib/email.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/tests/lib/email.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMock = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}))

import { sendPasswordResetEmail } from '@/lib/email'

beforeEach(() => { sendMock.mockReset() })

describe('sendPasswordResetEmail', () => {
  it('calls resend with correct to address and reset URL in html', async () => {
    sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null })
    await sendPasswordResetEmail('student@example.com', 'http://localhost:3000/reset-password/abc123')

    expect(sendMock).toHaveBeenCalledOnce()
    const args = sendMock.mock.calls[0][0]
    expect(args.to).toBe('student@example.com')
    expect(args.html).toContain('http://localhost:3000/reset-password/abc123')
  })

  it('does not throw if resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'rate limited' } })
    await expect(sendPasswordResetEmail('x@y.com', 'http://localhost:3000/reset-password/tok')).resolves.not.toThrow()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/tests/lib/email.test.ts
```

- [ ] **Step 3: Implement `src/lib/email.ts`**

```ts
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Nihanvi School of Dance <onboarding@resend.dev>'

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  resend.emails
    .send({
      from: FROM,
      to,
      subject: 'Reset your Nihanvi portal password',
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a password reset, you can ignore this email.</p>
        <p>— Nihanvi School of Dance</p>
      `,
    })
    .catch(console.error)
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/tests/lib/email.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts src/tests/lib/email.test.ts
git commit -m "feat: email library with sendPasswordResetEmail"
```

---

## Task 8: Auth Library + NextAuth Config (TDD)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/types/next-auth.d.ts`
- Create: `src/tests/lib/auth.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/tests/lib/auth.test.ts
import '../mocks/prisma'
import { describe, it, expect, vi } from 'vitest'
import { prismaM } from '../mocks/prisma'

// Mock bcrypt BEFORE importing auth — use vi.hoisted so the mock is available
// inside the vi.mock() factory (Vitest 4.x requirement)
const bcryptCompareMock = vi.hoisted(() => vi.fn())
vi.mock('bcryptjs', () => ({
  default: {
    compare: bcryptCompareMock,
    hash:    vi.fn(),
  },
}))

import { authorizeUser } from '@/lib/auth'

const TEACHER_USER = {
  id:           'u1',
  name:         'Nihanvi Teacher',
  email:        'teacher@example.com',
  passwordHash: 'hashed_password',   // arbitrary — bcrypt.compare is mocked
  role:         'TEACHER' as const,
  active:       true,
}

describe('authorizeUser', () => {
  it('returns user object on valid credentials', async () => {
    prismaM.user.findUnique.mockResolvedValue(TEACHER_USER)
    bcryptCompareMock.mockResolvedValue(true)

    const result = await authorizeUser(TEACHER_USER.email, 'correctpassword')

    expect(result).toEqual({
      id:    TEACHER_USER.id,
      name:  TEACHER_USER.name,
      email: TEACHER_USER.email,
      role:  TEACHER_USER.role,
    })
  })

  it('returns null when user is not found', async () => {
    prismaM.user.findUnique.mockResolvedValue(null)
    const result = await authorizeUser('unknown@example.com', 'any')
    expect(result).toBeNull()
  })

  it('returns null when user is inactive', async () => {
    prismaM.user.findUnique.mockResolvedValue({ ...TEACHER_USER, active: false })
    bcryptCompareMock.mockResolvedValue(true)
    const result = await authorizeUser(TEACHER_USER.email, 'correctpassword')
    expect(result).toBeNull()
  })

  it('returns null when password is wrong', async () => {
    prismaM.user.findUnique.mockResolvedValue(TEACHER_USER)
    bcryptCompareMock.mockResolvedValue(false)
    const result = await authorizeUser(TEACHER_USER.email, 'wrongpassword')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/tests/lib/auth.test.ts
```

- [ ] **Step 3: Implement `src/lib/auth.ts`**

```ts
// src/lib/auth.ts
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'

export async function authorizeUser(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user || !user.active) return null
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        return authorizeUser(credentials.email, credentials.password)
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as { role: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id   as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
  pages:   { signIn: '/login' },
}
```

- [ ] **Step 4: Create NextAuth type extension**

```ts
// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:   string
      role: string
    } & DefaultSession['user']
  }
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npx vitest run src/tests/lib/auth.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts src/types/next-auth.d.ts src/tests/lib/auth.test.ts
git commit -m "feat: auth library with authorizeUser and NextAuth v4 config"
```

---

## Task 9: NextAuth API Route

**Files:**
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create the route handler**

```ts
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

- [ ] **Step 2: Verify dev server starts without errors**

```bash
npm run dev
```

Navigate to `http://localhost:3000/api/auth/providers` — should return a JSON object with `credentials` provider.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: NextAuth v4 API route handler"
```

---

## Task 10: Seed Script

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Write seed**

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const db = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('nihanvi123', 12)

  await db.user.upsert({
    where: { email: 'aneeshparasa@gmail.com' },
    update: {},
    create: {
      name:                 'Nihanvi Teacher',
      email:                'aneeshparasa@gmail.com',
      passwordHash,
      role:                 'TEACHER',
      active:               true,
      passwordLastChangedAt: new Date(),
    },
  })

  console.log('✓ Teacher account seeded')
  console.log('  Email:    aneeshparasa@gmail.com')
  console.log('  Password: nihanvi123  ← change this before going live')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
```

- [ ] **Step 2: Run seed**

```bash
npm run seed
```

Expected output:
```
✓ Teacher account seeded
  Email:    aneeshparasa@gmail.com
  Password: nihanvi123  ← change this before going live
```

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed teacher account"
```

---

## Task 11: Middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Write middleware**

```ts
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { token }   = req.nextauth
    const { pathname } = req.nextUrl

    // Role enforcement: wrong role gets redirected to their own portal
    if (pathname.startsWith('/dashboard') && token?.role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/portal', req.url))
    }
    if (pathname.startsWith('/portal') && token?.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      // Return true = user is authenticated; withAuth handles unauthenticated → /login
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*'],
}
```

- [ ] **Step 2: Add root redirect to `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/login')
}
```

- [ ] **Step 3: Verify manually**

Start `npm run dev`. Visit `http://localhost:3000` — should redirect to `/login`.

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts src/app/page.tsx
git commit -m "feat: middleware for role-based routing and root redirect"
```

---

## Task 12: Auth Route Group Layout

**Files:**
- Create: `src/app/(auth)/layout.tsx`

- [ ] **Step 1: Create shared auth layout**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-brand-brown-dark leading-tight">
            Nihanvi<br />School of Dance
          </h1>
        </div>
        {children}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify layout renders**

Visit `http://localhost:3000/login` (will 404 for now — that's fine, verify no layout errors).

- [ ] **Step 3: Commit**

```bash
git add src/app/(auth)/layout.tsx
git commit -m "feat: auth route group layout with brand cream background and logo"
```

---

## Task 13: SubmitButton Component

**Files:**
- Create: `src/components/forms/SubmitButton.tsx`

This must be a **separate component** — not inlined in forms — so `useFormStatus` has access to the form's pending state.

- [ ] **Step 1: Create SubmitButton**

```tsx
// src/components/forms/SubmitButton.tsx
'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
}

export function SubmitButton({ label, pendingLabel = 'Please wait…' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand-orange text-white font-bold py-4 rounded-lg text-sm
                 hover:bg-brand-brown-mid transition-colors disabled:opacity-50
                 flex items-center justify-center gap-2 min-h-[44px]"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>{pendingLabel}</span>
        </>
      ) : (
        label
      )}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/forms/SubmitButton.tsx
git commit -m "feat: SubmitButton with useFormStatus spinner"
```

---

## Task 14: Login Page

**Files:**
- Create: `src/app/(auth)/login/page.tsx`

The login page is a **Client Component** because it calls `signIn()` from `next-auth/react`. It does NOT use `useFormState` — it uses a plain `onSubmit` handler.

- [ ] **Step 1: Create login page**

The login page is split into two components:
- `LoginPage` — Server Component (can safely read `searchParams`)
- `LoginForm` — Client Component (handles `signIn()` and state)

This is required because `searchParams` is a server-only prop in Next.js 14 App Router and cannot be read inside a Client Component directly. The form logic needs to be client-side, so we split them.

```tsx
// src/app/(auth)/login/page.tsx
import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { reset?: string }
}) {
  return (
    <>
      {/* Success banner — rendered server-side from searchParams */}
      {searchParams.reset === 'success' && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm"
        >
          Password updated. You can now sign in.
        </div>
      )}
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  )
}
```

```tsx
// src/app/(auth)/login/LoginForm.tsx
'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router  = useRouter()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form     = e.currentTarget
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Read role from session to determine redirect target
    const session = await getSession()
    if (session?.user?.role === 'TEACHER') {
      router.push('/dashboard')
    } else {
      router.push('/portal')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* h2: layout's h1 is the logo above; card heading sits at h2 */}
      <h2 className="sr-only">Sign in to Nihanvi School of Dance</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          {error && (
            <p role="alert" className="mt-2 text-sm text-brand-red flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-orange text-white font-bold py-4 rounded-lg text-sm
                     hover:bg-brand-brown-mid transition-colors disabled:opacity-50
                     flex items-center justify-center gap-2 min-h-[44px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Signing in…</span>
            </>
          ) : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-4">
        <a
          href="/forgot-password"
          className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-block min-h-[44px] flex items-center justify-center"
        >
          Forgot password?
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify manually**

Start `npm run dev`. Visit `http://localhost:3000/login`:
- Cream background, logo, white card
- Submit with invalid credentials → inline error below password field
- Submit with `aneeshparasa@gmail.com` / `nihanvi123` → redirects to `/dashboard` (which 404s — that's fine)

- [ ] **Step 3: Commit**

```bash
git add src/app/(auth)/login/page.tsx src/app/(auth)/login/LoginForm.tsx
git commit -m "feat: login page with client-side signIn and role-based redirect"
```

---

## Task 15: Forgot Password Pages + Action

**Files:**
- Create: `src/app/(auth)/forgot-password/page.tsx`
- Create: `src/app/(auth)/forgot-password/actions.ts`
- Create: `src/app/(auth)/forgot-password/sent/page.tsx`

- [ ] **Step 1: Create the server action**

```ts
// src/app/(auth)/forgot-password/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { createToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email'

export async function forgotPasswordAction(
  _prevState: { status: string } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string | null)?.trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // Look up user — but ALWAYS redirect to /sent regardless (no email enumeration)
  const user = await db.user.findUnique({ where: { email } })
  if (user && user.active) {
    const token    = await createToken(user.id, 'RESET', 1)
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${token}`
    // sendPasswordResetEmail is fire-and-forget internally — do NOT add .catch() here,
    // it returns void and TypeScript will error if you try to chain .catch on void.
    sendPasswordResetEmail(user.email, resetUrl)
  }

  redirect('/forgot-password/sent')
}
```

- [ ] **Step 2: Create the forgot-password page**

```tsx
// src/app/(auth)/forgot-password/page.tsx
'use client'

import { useFormState } from 'react-dom'
import { forgotPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export default function ForgotPasswordPage() {
  const [state, action] = useFormState(forgotPasswordAction, null)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-brand-brown-dark mb-1">
        Reset your password
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      <form action={action} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          {state?.status === 'error' && (
            <p role="alert" className="mt-2 text-sm text-brand-red flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {state.message}
            </p>
          )}
        </div>

        <SubmitButton label="Send reset link" pendingLabel="Sending…" />
      </form>

      <div className="text-center mt-4">
        <a href="/login" className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-block">
          Back to sign in
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create the sent confirmation page**

```tsx
// src/app/(auth)/forgot-password/sent/page.tsx
export default function ForgotPasswordSentPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      {/* Checkmark icon */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Check your email</h2>
      <p className="text-sm text-gray-500 mb-6">
        If an account exists for that address, you'll receive a reset link shortly.
      </p>

      <a
        href="/login"
        className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-block"
      >
        Back to sign in
      </a>
    </div>
  )
}
```

- [ ] **Step 4: Verify manually**

Visit `http://localhost:3000/forgot-password`:
- Submit with any email → redirects to `/forgot-password/sent`
- Submit with invalid format → inline error below email field

- [ ] **Step 5: Commit**

```bash
git add src/app/(auth)/forgot-password/
git commit -m "feat: forgot password flow with no email enumeration"
```

---

## Task 16: Reset Password Page + Action

**Files:**
- Create: `src/app/(auth)/reset-password/[token]/page.tsx`
- Create: `src/app/(auth)/reset-password/[token]/actions.ts`

- [ ] **Step 1: Create the server action**

```ts
// src/app/(auth)/reset-password/[token]/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { validateAndConsumeToken } from '@/lib/tokens'
import { setPassword } from '@/lib/users'

export async function resetPasswordAction(
  _prevState: { status: string; message: string } | null,
  formData: FormData
) {
  const token           = formData.get('token')           as string
  const password        = formData.get('password')        as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password.length < 8) {
    return { status: 'error', message: 'Password must be at least 8 characters.' }
  }
  if (password !== confirmPassword) {
    return { status: 'error', message: 'Passwords do not match.' }
  }

  const result = await validateAndConsumeToken(token, 'RESET')
  if (!result.valid) {
    return { status: 'error', message: 'token_invalid' }
  }

  await setPassword(result.userId, password)
  redirect('/login?reset=success')
}
```

- [ ] **Step 2: Create the reset password page**

```tsx
// src/app/(auth)/reset-password/[token]/page.tsx
'use client'

import { useFormState } from 'react-dom'
import { resetPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [state, action] = useFormState(resetPasswordAction, null)

  // Invalid/expired token — render error card instead of form
  if (state?.message === 'token_invalid') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Link expired or invalid</h2>
        <p className="text-sm text-gray-500 mb-6">
          This link has expired or has already been used.
        </p>
        <a href="/forgot-password" className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-block">
          Request a new link →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-brand-brown-dark mb-6">Set a new password</h2>

      <form action={action} noValidate>
        <input type="hidden" name="token" value={params.token} />

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters</p>
          {state?.status === 'error' && state.message !== 'token_invalid' &&
            !state.message.includes('match') && (
            <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          {state?.message?.includes('match') && (
            <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <SubmitButton label="Update password" pendingLabel="Updating…" />
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(auth)/reset-password/
git commit -m "feat: reset password page and action"
```

---

## Task 17: Setup Password Page + Action

**Files:**
- Create: `src/app/(auth)/setup-password/[token]/page.tsx`
- Create: `src/app/(auth)/setup-password/[token]/actions.ts`

- [ ] **Step 1: Create the server action**

```ts
// src/app/(auth)/setup-password/[token]/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { validateAndConsumeToken } from '@/lib/tokens'
import { setPassword } from '@/lib/users'

export async function setupPasswordAction(
  _prevState: { status: string; message: string } | null,
  formData: FormData
) {
  const token           = formData.get('token')           as string
  const password        = formData.get('password')        as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password.length < 8) {
    return { status: 'error', message: 'Password must be at least 8 characters.' }
  }
  if (password !== confirmPassword) {
    return { status: 'error', message: 'Passwords do not match.' }
  }

  const result = await validateAndConsumeToken(token, 'SETUP')
  if (!result.valid) {
    return { status: 'error', message: 'token_invalid' }
  }

  await setPassword(result.userId, password)
  redirect('/portal')
}
```

- [ ] **Step 2: Create the setup password page**

Same structure as reset password page, with different heading and invalid-token link.

```tsx
// src/app/(auth)/setup-password/[token]/page.tsx
'use client'

import { useFormState } from 'react-dom'
import { setupPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export default function SetupPasswordPage({ params }: { params: { token: string } }) {
  const [state, action] = useFormState(setupPasswordAction, null)

  if (state?.message === 'token_invalid') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Link expired or invalid</h2>
        <p className="text-sm text-gray-500 mb-6">
          This setup link has expired. Contact your teacher to resend it.
        </p>
        <a href="/login" className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-block">
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-brand-brown-dark mb-1">Welcome! Set your password</h2>
      <p className="text-sm text-gray-500 mb-6">Choose a password to access your student portal.</p>

      <form action={action} noValidate>
        <input type="hidden" name="token" value={params.token} />

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters</p>
          {state?.status === 'error' && state.message !== 'token_invalid' &&
            !state.message.includes('match') && (
            <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          {state?.message?.includes('match') && (
            <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <SubmitButton label="Set password" pendingLabel="Setting up…" />
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: all tests pass (tokens, users, email, auth).

- [ ] **Step 4: Run build check**

```bash
npm run build
```

Expected: build succeeds with no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/(auth)/setup-password/
git commit -m "feat: setup password page and action"
```

---

## Final Verification Checklist

- [ ] `npm test` — all tests pass
- [ ] `npm run build` — no TypeScript or build errors
- [ ] `npm run dev` — dev server starts at http://localhost:3000
- [ ] `http://localhost:3000` — redirects to `/login`
- [ ] `/login` — logo visible, form renders, sign in with `aneeshparasa@gmail.com` / `nihanvi123` → `/dashboard`
- [ ] `/login` with wrong credentials — inline error below password field
- [ ] `/forgot-password` — submit any email → redirects to `/forgot-password/sent`
- [ ] `/forgot-password` with invalid email format — inline error
- [ ] `/forgot-password/sent` — confirmation card renders
- [ ] `/reset-password/invalid-token` — token_invalid triggers on submit → error card
- [ ] `/setup-password/invalid-token` — same behavior
- [ ] `/dashboard` (unauthenticated) → redirects to `/login`
- [ ] `/portal` (unauthenticated) → redirects to `/login`
- [ ] `npm run seed` — outputs teacher account confirmation without errors
