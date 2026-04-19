# memory.md

Running log of work done in this project. Appended after every request.

---

### 2026-04-03 — Added session workflow rules to CLAUDE.md
- Added "Session Workflow" section at the top of CLAUDE.md requiring Claude to read `memory.md` at the start of each request and append a concise entry to `memory.md` at the end
- Created this `memory.md` file as the persistent log

### 2026-04-03 — Spec review: Phase 1 Foundation design doc
- Reviewed `docs/superpowers/specs/2026-04-03-phase-1-foundation-design.md`
- 3 must-fix issues: K1 (useFormState constraint absent — silent React 19 footgun), C3 (no Server Actions section), R3 (validateToken + consumeToken race condition)
- 7 important issues: C1 (prisma.config.ts wrong path), C2 (forgot-password action flow unspecified), K2 (SubmitButton pattern not referenced), R1 (token generation method unspecified), R2 (missing Token userId index), O1 (enroll routes not excluded from middleware spec), O2 (NOTIFICATION_EMAIL/TWILIO missing from env table)
- 6 minor/suggestion issues logged in review output
- Spec not approved; needs revision before implementation

### 2026-04-03 — Second-pass spec review: Phase 1 Foundation (post-fix)
- Reviewed updated `docs/superpowers/specs/2026-04-03-phase-1-foundation-design.md`; all 16 first-pass issues confirmed resolved
- Found 2 new issues: (1) CRITICAL — loginAction calls NextAuth `signIn` from a Server Action, but `signIn` from `next-auth/react` is client-only in NextAuth v4; spec must switch to client-side `signIn('credentials', {...})` pattern; (2) IMPORTANT — Tailwind typo `justify-content-center` in auth layout spec (Section 7), correct class is `justify-center`
- Spec NOT approved; two issues must be addressed before implementation begins

### 2026-04-03 — Third-pass spec review: Phase 1 Foundation (final approval)
- Reviewed all 12 sections of `docs/superpowers/specs/2026-04-03-phase-1-foundation-design.md`
- Both pass-2 fixes confirmed: login page is now client-side `signIn()` from `next-auth/react`; layout uses `justify-center`
- All constraints verified: React 18 hooks, Prisma v7 config path, Token model with `@@index([userId])`, atomic `validateAndConsumeToken`, fire-and-forget emails, SubmitButton as child component, env vars table complete
- Minor implicit behavior noted (setup-password redirect to /portal without session bounces to /login) — acceptable, not a spec defect
- APPROVED for implementation

### 2026-04-03 — Plan review pass 2: Phase 1 Foundation plan
- Reviewed `docs/superpowers/plans/2026-04-03-phase-1-foundation.md` (17 tasks, 1871 lines)
- All 4 pass-1 fixes confirmed: Task 14 login split (Server + Client), Task 15 no .catch() on void, Task 8 vi.hoisted bcrypt mock + success assertion, Task 1 git init guard comment
- No issues found; schema, TDD cycles, middleware, env vars, React 18 hooks, Prisma v7 config all verified against spec
- APPROVED for implementation

### 2026-04-03 — Code review: Task 1 Project Scaffold
- Verified package.json (Next 14.2.29, all prod/dev deps, seed script), .env.local.example (all 7 vars), .gitignore (.env*.local), tsconfig.json (strict + @/* alias) — all PASS
- One gap found: no vitest.config.ts in project root; npm test will not work correctly without it (needs jsdom env, setupFiles, path alias); flagged as Important (not a Task 1 explicit requirement but must be closed before tests run)
- next.config.mjs extension confirmed correct for Next.js 14.2

### 2026-04-03 — Review result delivered: Task 1 Project Scaffold
- Overall: Spec Compliant with one pre-existing Important gap (vitest.config.ts absent)
- All 5 explicit plan steps PASS: scaffold, deps, .env.local.example, seed script, git commit
- next.config.mjs deviation from .ts confirmed non-defective for Next.js 14.2
- vitest.config.ts missing — must be created before any test task runs (Tasks 10+)

### 2026-04-03 — Code review: Task 1 Project Scaffold (second pass, reviewer role)
- All 5 plan steps PASS: scaffold, deps, .env.local.example (7 vars match plan exactly), seed script, git commit
- package.json missing "test" script — npm test will fail; vitest.config.ts also absent (confirmed no root-level file)
- tailwind.config.ts has only scaffold-default CSS variable colors, NOT brand tokens — but brand tokens are Task 2 scope, acceptable here
- src/app/layout.tsx and page.tsx are unmodified scaffold defaults (Geist font, Next.js boilerplate) — acceptable for Task 1 only; Tasks 2+ must replace them
- next.config.mjs deviation from plan's next.config.ts is non-defective; confirmed create-next-app 14.2 generates .mjs

### 2026-04-03 — Task 1: Project scaffold bootstrapped
- Ran `create-next-app@14.2.29` with `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git`; scaffolded into temp subdir then moved files to project root (workaround: directory name contains spaces/capitals, not valid npm name)
- Installed all prod deps: next-auth@^4.24, @prisma/client@^7, bcryptjs, resend, dotenv
- Installed all dev deps: prisma@^7, @types/bcryptjs, tsx, vitest@^3, @vitejs/plugin-react, @testing-library/react, @testing-library/jest-dom, jsdom
- Created `.env.local.example` with all required env vars
- Added `"seed": "tsx prisma/seed.ts"` to package.json scripts
- `.gitignore` has `.env*.local` (covers .env.local); `tsconfig.json` has strict mode + `@/*` alias to `src/`
- `git init` run; initial commit `3fcbbbb` created with all scaffold files
- `next.config.mjs` (not `.ts`) — create-next-app 14.2 generates `.mjs`; task spec says `.ts` but `.mjs` is correct for this version

### 2026-04-03 — Code review: Task 2 Tailwind Brand Tokens + Fonts
- All 13 spec requirements PASS: 6 brand color tokens correct, fontFamily.display correct, content paths correct, Inter+Lobster_Two imports correct, metadata correct, body classes correct
- Important issue flagged: `globals.css` has `body { font-family: Arial, Helvetica, sans-serif; }` (line 20) that will override inter.className — must be removed before any UI work
- Important issue flagged: `globals.css` dark-mode CSS variable block (lines 5-15) conflicts with fixed brand color system — must be removed
- Task 2 implementation itself is APPROVED; globals.css cleanup is pre-existing Task 1 debt

### 2026-04-03 — Task 2: Tailwind Brand Tokens + Fonts
- Configured Tailwind brand color tokens in `tailwind.config.ts` (orange #E8820C, yellow #F5C518, red #C0392B, brown-dark #3d1a00, brown-mid #7a2800, cream #FFF8F0)
- Added `fontFamily.display` config referencing `--font-lobster-two` CSS variable for Tailwind `font-display` class
- Replaced `src/app/layout.tsx` to import Inter and Lobster_Two from `next/font/google` (Inter for body, Lobster Two weights 400/700 for display)
- Updated metadata title to "Nihanvi School of Dance" and description to "Student & Teacher Portal"
- TypeScript verification `npx tsc --noEmit` passed with no errors
- Committed `871379f`: "feat: configure tailwind brand tokens and Google Fonts"

### 2026-04-03 — Task 3: Prisma Schema + Config
- Created `prisma.config.ts` at project root (Prisma v7 pattern: uses `defineConfig`, loads `.env.local` via dotenv, no `url =` in schema)
- Created `prisma/schema.prisma` with all 8 models (User, Token, Registration, Homework, Submission, Announcement, Event, Rsvp, Payment) and 6 enums
- Single-line enum syntax `{ A B C }` rejected by Prisma v7 parser — expanded all enums to multi-line format; schema validates cleanly (`prisma validate` passes)
- Migration skipped: `.env.local` does not exist / no real DATABASE_URL configured
- Committed `4f90826`: "feat: add Prisma schema and config for initial database setup"

### 2026-04-03 — Code review: Task 3 Prisma Schema + Config
- PASS — all requirements verified against actual files, not the implementer report
- prisma.config.ts: correct import, dotenv path, defineConfig, no url= — all pass
- schema.prisma: 6 enums (correct uppercase values), 8 models, Token @@index([userId]), Registration.email not @unique (with comment), User.passwordLastChangedAt present, no setupToken fields, no url= in datasource — all pass
- Multi-line enum expansion confirmed as required Prisma v7 adaptation, not a defect
- Commit 4f90826 confirmed present

### 2026-04-03 — Task 4: Prisma Singleton + Test Infrastructure
- Created src/lib/db.ts: Prisma singleton with NODE_ENV check (reuses globalForPrisma in dev)
- Created vitest.config.ts: node environment, globals: true, setupFiles: ['./src/tests/setup.ts'], @/ alias
- Created src/tests/setup.ts: seeds 5 env vars (NOTIFICATION_EMAIL, TWILIO_PHONE_NUMBER, NEXT_PUBLIC_SITE_URL, RESEND_API_KEY, NEXTAUTH_SECRET)
- Created src/tests/mocks/prisma.ts: Vitest mock for @/lib/db with user/token stubs, $transaction, beforeEach clearAllMocks
- Added "test": "vitest run" to package.json scripts
- Ran `npx prisma generate`: client types generated successfully (v7.6.0)
- Verified vitest startup: "No test files found" (expected; config loads without errors)
- Committed bbcef96: "feat: prisma singleton and vitest test infrastructure"

### 2026-04-03 — Code review: Task 4 Prisma Singleton + Test Infrastructure
- APPROVED — all 5 deliverables verified against actual files; tsc --noEmit clean; vitest run starts correctly
- db.ts: exact spec match, correct singleton pattern
- vitest.config.ts: node env, globals, setupFiles, @/ alias all correct
- setup.ts: all 5 env vars present; NEXTAUTH_SECRET is 32+ chars (correct)
- mocks/prisma.ts: user/token stubs, $transaction default impl (fn(prismaM)) is correct for interactive tx tests
- package.json "test" script present; vitest exit-1 on no-test-files is expected behavior, clears once first test file added

### 2026-04-03 — Task 5: Token Library (TDD)
- Created `src/lib/tokens.ts`: `createToken` (crypto.randomBytes 32→64 hex, db.token.create) and `validateAndConsumeToken` (atomic db.$transaction: find, check type/expiry/usedAt, mark usedAt)
- Created `src/tests/lib/tokens.test.ts`: 6 tests covering insert+return, not_found, wrong_type, expired, already_used, success+update
- TDD followed: tests ran first → failed "Cannot find module '@/lib/tokens'"; implementation written; all 6 tests pass
- Committed be1c423: "feat: token library with atomic validateAndConsumeToken"

### 2026-04-03 — Code review: Task 5 Token Library
- PASS — all spec requirements verified against actual files
- tokens.ts: crypto.randomBytes(32).toString('hex') correct, single db.$transaction wraps all reads+write, guard order (not_found→wrong_type→expired→already_used) correct, usedAt set via tx.update, only 2 exports
- tokens.test.ts: all 6 cases present; $transaction mocked per-test with mockImplementation; success test uses expect.any(Date) for usedAt; createToken test inspects data args and asserts token.length===64
- Minor: not_found test uses inline tx vs named-variable pattern in other 4 tests (style only); createToken does not assert expiresAt (low risk)
- Commit be1c423 approved

### 2026-04-03 — Reviewer code review: Task 5 Token Library (second-pass)
- APPROVED — 6/6 tests pass confirmed via npx vitest run
- tokens.ts: all 5 spec requirements pass; guard order correct; transaction boundary correct; only 2 named exports; TokenType from @prisma/client
- tokens.test.ts: all 6 required cases present; all assert return values; all validateAndConsumeToken tests use prismaM.$transaction.mockImplementation with isolated tx
- 0 critical, 0 important issues; 3 suggestions logged (inline tx style inconsistency on not_found test, missing expiresAt instanceof Date assertion, named return type alias for future readability)

### 2026-04-03 — Tasks 6, 7, 8: Users, Email, Auth libraries (TDD)
- Task 6: `src/lib/users.ts` — `setPassword(userId, newPassword)`: bcrypt.hash(12) + db.user.update with passwordLastChangedAt; 1 test passes; commit 350099f
- Task 7: `src/lib/email.ts` — `sendPasswordResetEmail(to, resetUrl)`: fire-and-forget via `.catch(console.error)`; 2 tests pass; commit ec509fe
  - NOTE: task spec used bare `const sendMock = vi.fn()` in email test which fails Vitest 4.x hoisting — fixed to `vi.hoisted(() => vi.fn())`
- Task 8: `src/lib/auth.ts` — `authorizeUser(email, password)` + `authOptions` (NextAuth v4 CredentialsProvider, JWT session, role in token/session); `src/types/next-auth.d.ts` extends Session type; 4 tests pass; commit ddfa0f8
- Full suite: 4 files, 13 tests, all pass

### 2026-04-03 — Code review: Tasks 6, 7, 8 — Users, Email, Auth libraries
- Task 6 (users.ts + users.test.ts): PASS — all 3 required test assertions present; bcrypt saltRounds=12; db.user.update with correct where/data shape
- Task 7 (email.ts + email.test.ts): PASS — fire-and-forget .catch(console.error) confirmed; vi.hoisted used correctly; both test cases pass
- Task 8 (auth.ts + auth.test.ts + next-auth.d.ts): CONDITIONAL PASS — logic and tests correct, but auth.ts line 32 has TS2352 type error: `(user as { role: string })` is not safe cast; correct fix is `(user as unknown as { role: string })` or extending the NextAuth User type; tsc --noEmit exits with code 2
- Important: auth.ts TypeScript error will cause `npm run build` to fail (Next.js runs tsc at build time); must fix before deployment
- Inactive user guard `!user.active` is correctly combined with `!user` in a single short-circuit check (no separate bcrypt call when inactive)

### 2026-04-03 — Tasks 9–13: NextAuth route, seed, middleware, auth layout, SubmitButton
- Task 9: `src/app/api/auth/[...nextauth]/route.ts` — NextAuth v4 GET/POST handler; commit 3b3d05b
- Task 10: `prisma/seed.ts` — upserts teacher account (aneeshparasa@gmail.com / nihanvi123); commit f7037ff
- Task 11: `src/middleware.ts` — withAuth role enforcement (TEACHER→/dashboard, STUDENT→/portal); `src/app/page.tsx` replaced with redirect('/login'); commit 3ec306d
- Task 12: `src/app/(auth)/layout.tsx` — brand-cream bg, max-w-sm centered, Lobster Two logo; commit 94aa982
- Task 13: `src/components/forms/SubmitButton.tsx` — useFormStatus spinner, React 18, min-h-[44px]; commit ffb3b1b
- `npx tsc --noEmit` passed with zero errors

### 2026-04-03 — Code review: Tasks 9–13 spec compliance check
- All 6 files verified against spec line-by-line; all 5 tasks PASS with zero violations
- Task 9 route.ts: exact 4-line spec match
- Task 10 seed.ts: all 5 import/upsert/hash requirements present
- Task 11 middleware.ts + page.tsx: withAuth, role guards, authorized callback, matcher, redirect all correct
- Task 12 (auth)/layout.tsx: all class tokens, logo text, children placement correct
- Task 13 SubmitButton.tsx: use client, useFormStatus, disabled, spinner, label, brand classes all present

### 2026-04-03 — Code quality review: Tasks 9–13 (six files)
- Overall: APPROVED with minor reservations; no Critical issues; no rework required before next task
- Important I2: seed.ts has hardcoded email + plaintext default password — pre-deployment concern, not a correctness defect
- Minor M1: middleware.ts has no explicit `return NextResponse.next()` on happy path (implicit undefined works but is non-obvious)
- Minor M2: SubmitButton.tsx SVG spinner path draws a wedge not a ring (cosmetic only)
- Minor M3: (auth)/layout.tsx uses `React.ReactNode` without import (works via global namespace; explicit import preferred)
- auth.ts double-cast `as unknown as` confirmed already fixed before this task (tsc --noEmit passes)

### 2026-04-03 — Task 14: Login page (Server + Client split)
- Created `src/app/(auth)/login/page.tsx`: Server Component reads `searchParams.reset`, renders green success banner, wraps `<LoginForm>` in `<Suspense>`
- Created `src/app/(auth)/login/LoginForm.tsx`: Client Component; `signIn('credentials', { redirect: false })`, reads role via `getSession()`, pushes to `/dashboard` (TEACHER) or `/portal` (STUDENT)
- `npx tsc --noEmit` passed with zero errors
- Committed `788f6be`: "feat: login page with client-side signIn and role-based redirect"

### 2026-04-03 — Tasks 15–17: Forgot/Reset/Setup password pages

- Task 15: `src/app/(auth)/forgot-password/` — `actions.ts` (forgotPasswordAction, no email enumeration, always redirects to /sent), `page.tsx` (useFormState, error display), `sent/page.tsx` (checkmark confirmation); commit b0dc1c6
- Task 16: `src/app/(auth)/reset-password/[token]/` — `actions.ts` (resetPasswordAction, validates RESET token, redirects to /login?reset=success), `page.tsx` (token_invalid error card + form); commit bb68ef0
- Task 17: `src/app/(auth)/setup-password/[token]/` — `setupPasswordAction` (SETUP token, redirects to /portal), page with token_invalid card; commit 2d1deaf
- sendPasswordResetEmail called as bare statement (no .catch — returns void internally)
- All 13 tests pass; tsc --noEmit exits clean

### 2026-04-03 — Code review: Task 14 Login Page (Server + Client split)
- APPROVED — all spec requirements pass for both page.tsx and LoginForm.tsx
- Important I1: `setLoading(false)` never called on success path; button stays disabled if navigation is interrupted — fix before end-to-end login tests
- Important I2: "Forgot password?" uses `<a>` not Next.js `<Link>`; causes full-page reload — fix when forgot-password route is implemented
- Minor S1: `py-3` and `min-h-[44px]` both on anchor are redundant (cosmetic only)
- Minor S2: sr-only h2 text duplicates layout logo heading (accessibility polish, not a defect)
- Minor S3: `<Suspense>` has no fallback prop (acceptable given synchronous LoginForm, but worth noting)

### 2026-04-03 — Code review: Tasks 15–17 Forgot/Reset/Setup Password
- APPROVED — all 7 files pass every spec requirement; 0 critical issues; 2 important issues
- Important I1: `forgot-password/sent/page.tsx` line 18 uses `<a>` not `<Link>` (full-page reload on "Back to sign in")
- Important I2: Both password pages (`reset-password/[token]/page.tsx`, `setup-password/[token]/page.tsx`) route password-field errors via `!state.message.includes('match')` string-sniffing — fragile; fix with `field` discriminator on action return type
- Minor: all 3 pages use `focus:ring-2 focus:ring-brand-orange` instead of design-system `focus:border-brand-orange`
- sendPasswordResetEmail correctly called as bare statement (returns void; .catch is inside email.ts)
- validateAndConsumeToken discriminated union narrowed correctly; result.userId access is type-safe

### 2026-04-03 — Phase 1 Foundation capstone review (all 22 files)
- Overall: GREEN — ready for Phase 2; tsc clean, 13/13 tests pass
- 0 Critical issues
- Important I1: LoginForm.tsx uses hand-rolled button + loading state instead of <SubmitButton>; spinner markup duplicated; acceptable debt, resolve when first Phase 2 client form is built
- Important I2: package.json build script is `next build` not `prisma generate && next build`; Vercel postinstall mitigates but local cold-start builds will fail without pre-generated client; fix before Phase 2
- Minor M2: setup-password success redirects to /portal (bounces to /login unauthenticated with no banner); cosmetic UX only, not a security defect
- Minor M3: sent/page.tsx "Back to sign in" link missing justify-center inside text-center container
- All prior task-level issues (string-sniff field routing, <a> vs <Link>, globals.css override) confirmed resolved in final implementation

### 2026-04-04 — Phase 3: enrollment flow (invite, enroll form, setup password email)
- Created `src/lib/registrations.ts`: `createInvite(email)` generates 64-hex token, writes Registration shell with placeholder fields
- Added `sendEnrollmentInviteEmail` and `sendSetupPasswordEmail` to `src/lib/email.ts` (fire-and-forget, `.catch(console.error)`)
- Created `src/app/dashboard/students/` — `actions.ts` (inviteStudentAction, teacher-only), `page.tsx` (student list + invite card), `InviteForm.tsx` (useFormState, React 18)
- Created `src/app/(auth)/enroll/[token]/` — `page.tsx` (validate token, notFound on invalid/used), `actions.ts` (enrollAction: validate, transaction user+registration create, send setup email, redirect), `EnrollForm.tsx` (long form with FieldError helpers)
- Created `src/app/(auth)/enroll/success/page.tsx` — checkmark confirmation with Link to /login
- `npx tsc --noEmit` zero errors; 13/13 tests pass; commit 36160a7

### 2026-04-04 — Phase 4: student detail page at /dashboard/students/[id]
- Created 4 files: `actions.ts` (resendSetupLinkAction, updateLevelGroupAction), `page.tsx` (server component), `ResendSetupButton.tsx` (client, 3-state idle/sending/sent), `LevelGroupForm.tsx` (client, inline save)
- Fixed 2 schema divergences from spec: `Payment.note` → `Payment.notes`; `.filter(Boolean)` type narrowed with `(item): item is [string, string]` to resolve TS2461
- `npx tsc --noEmit` zero errors; 13/13 tests pass; commit 3157b9f

### 2026-04-04 — Phase 5: content features — all 7 remaining pages built
- Dashboard: `/dashboard/homework` (post form + archive), `/dashboard/announcements` (post + delete), `/dashboard/events` (create + delete, upcoming/past split), `/dashboard/payments` (record form, outstanding total badge)
- Portal: `/portal/announcements` (level-filtered), `/portal/homework` (to-do/done split, mark done/undone via upsert), `/portal/events` (RSVP Yes/No/Maybe via upsert, `RsvpButtons` client component)
- All actions use `revalidatePath`; amounts stored in cents, displayed as dollars
- `SubmitButton` prop is `pendingLabel` not `loadingLabel` — fixed across all 4 forms
- `npx tsc --noEmit` zero errors; 13/13 tests pass

### 2026-04-04 — Phase 2: authenticated shell layout, dashboard home, student portal home
- Created `src/components/layout/SignOutButton.tsx` (client, signOut → /login)
- Created `src/components/layout/AppShell.tsx` (client, mobile sidebar drawer + desktop fixed sidebar, usePathname active detection)
- Created `src/app/dashboard/layout.tsx` (server, getServerSession, 6 nav items with inline SVG icons)
- Replaced `src/app/dashboard/page.tsx` (server, greeting function, 3 stat cards, 5 quick-link cards)
- Created `src/app/portal/layout.tsx` (server, getServerSession, 4 nav items)
- Created `src/app/portal/page.tsx` (server, 3 preview sections: announcements, events, homework)
- Schema divergences from task spec adapted: `Announcement.body`/`postedAt` (no title/createdAt), `Event.eventDate` (no date/location), `Homework.targetType`/`targetStudentId` (not target/targetUserId)
- `npx tsc --noEmit` passed with zero errors; 13/13 tests pass; commit 294e223

### 2026-04-18 — Polish pass across dashboard and portal
- Fixed raw uppercase payment status labels in `StudentDetailPage` (PAID → Paid, etc.) and added null guard on `p.method`
- Fixed `EditAnnouncementRow` using `toLocaleString()` (showed date+time) → explicit `toLocaleDateString('en-US', {...})` options
- Fixed `portal/page.tsx` announcement date using `toLocaleDateString()` with no options → explicit `en-US` options for consistent output
- Added `aria-expanded` + `aria-controls="mobile-sidebar"` to mobile menu toggle in `AppShell`; added `id="mobile-sidebar"` on drawer
- Added `aria-label="Previous month"` / `"Next month"` to calendar nav buttons in `EventCalendar`
- Fixed portal homework `<a href={h.youtubeUrl}>` rendering `href="null"` when URL is absent — now conditionally renders fallback text
- Added `hover:bg-brand-orange/20` to completed homework "mark undone" checkmark button (was missing hover state)
- `npx tsc --noEmit` zero errors

### 2026-04-18 — Full UI redesign using 21stDev MCP inspiration
- Created branch `ui-redesign-2026-04-18` for undo capability (run `git checkout master` to revert all changes)
- Auth layout: split-screen desktop with brand-brown-dark panel, decorative blobs, music note icon, tagline
- Login form: password visibility toggle, welcome heading, soft input bg (gray-50), button shadow glow
- All auth cards: upgraded to `shadow-xl shadow-brand-brown-dark/5 border border-orange-100 p-7`
- AppShell: icon logo mark (w-9 orange square), gradient avatar, active item shows dot indicator, backdrop-blur mobile overlay
- Dashboard home: stat cards have colored icon squares (blue/purple/amber), date subtitle; quick links have icon tiles that animate on hover
- Portal home: section headers get colored icon badges, event chips have border, homework items show clock icon for due date
- SubmitButton: now has shadow glow, `rounded-xl`, `className` prop for override
- globals.css: added `@layer components` with `.input-base`, `.btn-primary`, `.card`, `.page-header`, `.section-label` utilities
- Pre-existing email test failure (1/13) unrelated to UI — confirmed by testing both before/after stash

### 2026-04-18 — Overhaul all inner dashboard and portal pages
- User noted previous UI redesign didn't visibly change the inner pages — only auth + home pages had been updated
- Sidebar: changed background from white to warm cream (#FFF8F0) + orange-tinted border — visible on every authenticated page
- All 8 inner pages now have consistent page header (colored icon square + title + count subtitle) and section dividers
- Dashboard: Students (gradient avatar, hover rows), Homework (progress bar, due urgency), Events (icon empty states), Payments (stat cards)
- Portal: Announcements (level accent bar + fire badge), Homework (overdue urgency system, strikethrough done, progress widget), Events (purple chip, RSVP layout)
- Pushed to Vercel preview branch `ui-redesign-2026-04-18`

### 2026-04-18 — Complete UI overhaul: Lucide icons + modernized all pages
- Replaced ALL inline SVG icons across every page/component with lucide-react imports
- dashboard/page.tsx: new dramatic stat cards (4xl numbers, ring icon badges, accent bar on hover, trend widget), greeting with time-of-day icon (Sun/Sunset/Moon)
- portal/page.tsx: section headers use Lucide icons (Megaphone/Calendar/BookOpen), Clock icon for timestamps
- SubmitButton.tsx: Loader2 from lucide-react instead of inline SVG spinner
- All dashboard inner pages (students/homework/announcements/events/payments): Lucide header icons, empty state icons
- Payments page: stat cards now include CheckCircle2/Clock/AlertCircle icons above numbers
- All portal inner pages (announcements/homework/events): Lucide icons throughout
- All auth sub-pages (forgot-password, sent, setup-password, reset-password): new LoginForm card style (header strip, border-gray-200, AlertCircle/XCircle/ArrowLeft/CheckCircle2 from Lucide)
- TypeScript: tsc --noEmit clean (0 errors)
- Pushed branch ui-redesign-2026-04-18 to origin — Vercel preview deploying
