# Memory Log

### 2026-04-04 — Phase 3 complete: enrollment flow
- Teacher invites student via email (inviteStudentAction → createInvite → Registration shell with enrollToken)
- Student fills form at /enroll/[token] (EnrollForm → enrollAction → DB transaction: create User + update Registration + tokenUsed=true)
- After enrollment: createToken(SETUP, 72h) → sendSetupPasswordEmail → redirect /enroll/success
- /setup-password/[token] from Phase 1 handles the rest
- email.ts now has 3 functions: sendPasswordResetEmail, sendEnrollmentInviteEmail, sendSetupPasswordEmail
- dev script uses -H 0.0.0.0 for phone access on local network (run ipconfig to find IP)

### 2026-04-04 — Phase 2 complete: authenticated shell + home pages
- Created AppShell (client, sidebar state), SignOutButton, DashboardLayout, PortalLayout
- Dashboard home: greeting, 3 stat cards (students/events/homework), quick-access link grid
- Portal home: announcements (line-clamp-2 preview), upcoming events (date badge), homework due
- Schema field corrections: Announcement has `body`/`postedAt` (no `title`); Event has `eventDate`; Homework has `targetType`/`targetStudentId`/`postedAt`
- Active nav detection: exact match for `/dashboard` and `/portal`, startsWith for sub-pages
- 13/13 tests passing; TypeScript clean

### 2026-04-03 — Database connected; migration + seed run
- DATABASE_URL set in .env.local (Neon pooler URL with channel_binding=require)
- Prisma v7 requires `@prisma/adapter-neon` + `@neondatabase/serverless` + `ws` packages
- `PrismaNeon` is a factory — pass `{ connectionString }` config object to it, NOT a Pool instance
- `neonConfig.webSocketConstructor = ws` required unconditionally in Node.js env (even Node 24 which has native WebSocket)
- `prisma.config.ts` needs `datasource: { url: process.env.DATABASE_URL! }` for `migrate dev` to work
- Migration: `20260404022440_init` applied; teacher account seeded (aneeshparasa@gmail.com / nihanvi123)
- 13/13 tests still passing after db.ts rewrite

### 2026-04-03 — Phase 1 Foundation complete (all 17 tasks)
- Completed Tasks 9-17: NextAuth API route, seed script, middleware, auth layout, SubmitButton, login page, forgot/reset/setup password flows
- Login: Server Component (searchParams) + Client Component (signIn from next-auth/react) split — critical Next.js 14 pattern
- Password form actions return `{ status, field, message }` — `field` discriminator routes errors to correct input
- `sendPasswordResetEmail` is fire-and-forget (void return) — never chain `.catch()` at call site
- 13/13 tests passing; `npx tsc --noEmit` clean; final reviewer: GREEN
- `package.json` build script: `prisma generate && next build`
- LoginForm.tsx intentionally uses inline button (not SubmitButton) — login uses onSubmit not useFormState, so useFormStatus has no form context
- Git: commits up to 4b52a49

### 2026-04-03 — Fixed globals.css scaffold conflicts
- Removed Next.js scaffold defaults from `src/app/globals.css` (--background/--foreground CSS vars, dark mode media query, Arial font override)
- Kept only the three Tailwind directives (@tailwind base/components/utilities)
- This resolves Arial overriding Inter font and dark mode breaking brand design (bg-brand-cream)
- TypeScript verification passed, committed as 7646b46
