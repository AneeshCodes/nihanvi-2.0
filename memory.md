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
    