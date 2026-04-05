# Nihanvi School of Dance — Manual Test Checklist

Go through each test in order. Mark each as ✅ pass, ❌ fail, or ⚠️ partial.
For any failure, note what you actually saw vs what was expected.

---

## Phase 1 — Authentication

### 1.1 Root redirect
1. Go to `/`
- **Expected:** Immediately redirected to `/login`

### 1.2 Login — invalid credentials
1. Go to `/login`
2. Enter email: `wrong@example.com`, password: `wrongpassword`
3. Click Sign in
- **Expected:** Error message "Invalid email or password." appears. No redirect.

### 1.3 Login — teacher account
1. Go to `/login`
2. Enter email: `aneeshparasa@gmail.com`, password: `nihanvi123`
3. Click Sign in
- **Expected:** Redirected to `/dashboard`

### 1.4 Teacher can't access portal
1. While logged in as teacher, go to `/portal`
- **Expected:** Redirected back to `/dashboard`

### 1.5 Sign out
1. From dashboard, click the Sign Out button in the sidebar
- **Expected:** Redirected to `/login`, session cleared

### 1.6 Authenticated route protection
1. While logged out, go to `/dashboard`
- **Expected:** Redirected to `/login`

### 1.7 Forgot password — no email enumeration
1. Go to `/forgot-password`
2. Enter a fake email: `doesnotexist@example.com`
3. Click Send reset link
- **Expected:** Redirected to `/forgot-password/sent` with "Check your email" message — no error saying the account doesn't exist

### 1.8 Forgot password — real account
1. Go to `/forgot-password`
2. Enter `aneeshparasa@gmail.com`
3. Click Send reset link
- **Expected:** Redirected to `/forgot-password/sent`
- **Also check:** An email arrives at aneeshparasa@gmail.com with a reset link

### 1.9 Reset password — valid link
1. Click the reset link from the email in test 1.8
- **Expected:** Page shows a "Reset your password" form (not an "invalid link" error)

### 1.10 Reset password — mismatched passwords
1. On the reset password form, enter password: `newpass123`, confirm: `different123`
3. Click Reset Password
- **Expected:** Error shown, password NOT changed

### 1.11 Reset password — success
1. On the reset password form, enter password: `nihanvi123`, confirm: `nihanvi123`
2. Click Reset Password
- **Expected:** Redirected to `/login` with a green "Password reset successfully" banner

### 1.12 Reset link can't be used twice
1. Try clicking the same reset link from test 1.8 again
- **Expected:** "This link has expired or already been used" error card shown

---

## Phase 2 — Authenticated Shell

### 2.1 Dashboard layout
1. Log in as teacher and go to `/dashboard`
- **Expected:** Sidebar visible on desktop with nav items: Dashboard, Students, Homework, Announcements, Events, Payments. Top bar with hamburger visible on mobile.

### 2.2 Dashboard home stats
1. On `/dashboard`
- **Expected:** Three stat cards showing counts for Students, Events, Homework. Greeting uses time of day (Good morning/afternoon/evening).

### 2.3 Dashboard quick links
1. On `/dashboard`, click each quick-access card (Students, Homework, Announcements, Events, Payments)
- **Expected:** Each navigates to the correct page

### 2.4 Active nav highlight
1. Navigate to `/dashboard/students`
- **Expected:** "Students" is highlighted in the sidebar. "Dashboard" is not.

### 2.5 Mobile sidebar
1. On a mobile screen (or narrow browser window), go to `/dashboard`
- **Expected:** Sidebar is hidden. Hamburger icon in top bar opens a slide-in drawer. Tapping outside or a nav link closes it.

---

## Phase 3 — Enrollment Flow

### 3.1 Invite a student
1. Log in as teacher, go to `/dashboard/students`
2. Enter a real email address you can check (e.g. a second email account)
3. Click Send Invite
- **Expected:** Green "Invitation sent to [email]" confirmation shown
- **Also check:** An email arrives at that address with an enrollment link

### 3.2 Enrollment form — invalid token
1. Go to `/enroll/invalidtoken123`
- **Expected:** 404 page (not found)

### 3.3 Enrollment form — valid link
1. Click the enrollment link from the email in test 3.1
- **Expected:** Full enrollment form appears with fields for student name, DOB, parent name, phone, address, email, etc.

### 3.4 Enrollment form — validation
1. On the enrollment form, leave the Student Name blank and submit
- **Expected:** Error shown next to the Student Name field

### 3.5 Enrollment form — complete submission
1. Fill in all required fields on the enrollment form and submit
- **Expected:** Redirected to `/enroll/success` with a checkmark confirmation
- **Also check:** A "Set up your password" email arrives at the student's email

### 3.6 Enrollment link can't be reused
1. Try clicking the same enrollment link from test 3.1 again
- **Expected:** 404 page (token already used)

### 3.7 Setup password — valid link
1. Click the setup password link from the email in test 3.5
- **Expected:** "Set up your password" form appears (not an error)

### 3.8 Setup password — success
1. Enter a password and matching confirm password, click Set Password
- **Expected:** Redirected to `/portal` (or to `/login` first, then portal after logging in)

### 3.9 Student can't access dashboard
1. Log in as the newly enrolled student
2. Go to `/dashboard`
- **Expected:** Redirected to `/portal`

---

## Phase 4 — Student Detail Page

### 4.1 Student appears in list
1. Log in as teacher, go to `/dashboard/students`
- **Expected:** The enrolled student from Phase 3 appears in the list with name and email

### 4.2 Student detail page
1. Click on the student in the list
- **Expected:** Detail page shows avatar with initials, account info, and registration details (name, DOB, parent, phone, address, etc.)

### 4.3 Set level group
1. On the student detail page, click the level group field
2. Type "Beginner" and click Save
- **Expected:** "Saved ✓" feedback shown. On refresh, "Beginner" is still shown.

### 4.4 Level group badge in list
1. Go back to `/dashboard/students`
- **Expected:** Student row shows an orange "Beginner" badge

### 4.5 Resend setup link
1. On the student detail page, click "Resend setup link"
- **Expected:** Button shows "Sending…" then "Sent ✓". A new setup password email arrives at the student's address.

---

## Phase 5 — Content Features

### Homework

### 5.1 Post homework — everyone
1. Log in as teacher, go to `/dashboard/homework`
2. Select "Everyone", enter a YouTube URL, add a description and due date
3. Click Post Homework
- **Expected:** Green "Homework posted." confirmation. Assignment appears in the list below.

### 5.2 Post homework — specific student
1. On `/dashboard/homework`, select "Specific student", pick the enrolled student
2. Enter a YouTube URL and click Post Homework
- **Expected:** Assignment appears with student's name as the target

### 5.3 Archive homework
1. On `/dashboard/homework`, click "Archive" next to an assignment
- **Expected:** Assignment disappears from the active list

### 5.4 Student sees homework
1. Log in as student, go to `/portal/homework`
- **Expected:** Both the "Everyone" assignment and the student-specific one appear in the "To do" section

### 5.5 Mark homework done
1. On `/portal/homework`, click the checkmark button on an assignment
- **Expected:** Assignment moves to the "Completed" section with an orange filled checkmark

### 5.6 Unmark homework
1. Click the orange checkmark on a completed assignment
- **Expected:** Assignment moves back to "To do"

---

### Announcements

### 5.7 Post announcement — everyone
1. Log in as teacher, go to `/dashboard/announcements`
2. Leave "Target level" blank, type a message, click Post Announcement
- **Expected:** Green confirmation. Announcement appears in the list.

### 5.8 Post announcement — level targeted
1. Post another announcement with Target level set to "Beginner"
- **Expected:** Announcement appears with an orange "Beginner" badge

### 5.9 Student sees announcements
1. Log in as student (level group: Beginner), go to `/portal/announcements`
- **Expected:** Both the general announcement and the "Beginner" one are visible

### 5.10 Portal home shows preview
1. Go to `/portal`
- **Expected:** Announcements section shows the 3 most recent with preview text

### 5.11 Delete announcement
1. Log in as teacher, go to `/dashboard/announcements`, click "Delete" on an announcement
- **Expected:** Announcement disappears from the list

---

### Events

### 5.12 Create event
1. Log in as teacher, go to `/dashboard/events`
2. Enter a title, pick a future date/time, add a description, click Create Event
- **Expected:** Green "Event created." confirmation. Event appears in the "Upcoming" section.

### 5.13 Past events section
1. Create an event with a date in the past
- **Expected:** It appears in the "Past" section, visually dimmed

### 5.14 Student sees events
1. Log in as student, go to `/portal/events`
- **Expected:** Upcoming event appears with date badge showing month and day

### 5.15 RSVP — Going
1. On `/portal/events`, click "Going" for the upcoming event
- **Expected:** "Going" button turns green and stays highlighted after page reload

### 5.16 RSVP — change response
1. Click "Maybe" on the same event
- **Expected:** "Maybe" button turns yellow, "Going" returns to unselected

### 5.17 Portal home shows event
1. Go to `/portal`
- **Expected:** The upcoming event appears in the "Upcoming Events" section with date badge

---

### Payments

### 5.18 Record a payment
1. Log in as teacher, go to `/dashboard/payments`
2. Select the enrolled student, enter amount: `120`, set due date, status: Pending, method: Zelle
3. Click Record Payment
- **Expected:** Green "Payment recorded." confirmation. Payment appears in the list.

### 5.19 Outstanding total
1. On `/dashboard/payments`, verify the top-right shows a red "Total outstanding" amount
- **Expected:** Shows $120.00 (or sum of all non-paid payments)

### 5.20 Record a paid payment
1. Record another payment with status: Paid and a paid date filled in
- **Expected:** Payment shows a green "Paid" badge. Outstanding total does not include this amount.

### 5.21 Student detail shows payments
1. Go to `/dashboard/students`, click on the enrolled student
- **Expected:** A "Recent Payments" section shows the payments recorded above with correct amounts, status badges, and due dates

---

## Edge Cases

### 6.1 Empty states
Verify all pages show a friendly empty state message when there's no data:
- `/dashboard/students` — "No students yet"
- `/dashboard/homework` — "No active assignments"
- `/dashboard/announcements` — "No announcements yet"
- `/dashboard/events` — "No upcoming events"
- `/dashboard/payments` — "No payments recorded yet"
- `/portal/homework` — "No assignments right now"
- `/portal/events` — "No events scheduled"
- `/portal/announcements` — "No announcements yet"

### 6.2 Mobile usability
On a phone (or browser DevTools mobile view):
- All buttons are at least thumb-sized (44×44px)
- Text is readable without zooming
- Forms don't require horizontal scrolling
- Sidebar opens/closes cleanly

---

## Summary

| Phase | Tests | Pass | Fail |
|---|---|---|---|
| Phase 1 — Auth | 1.1 – 1.12 | | |
| Phase 2 — Shell | 2.1 – 2.5 | | |
| Phase 3 — Enrollment | 3.1 – 3.9 | | |
| Phase 4 — Student Detail | 4.1 – 4.5 | | |
| Phase 5 — Content | 5.1 – 5.21 | | |
| Edge Cases | 6.1 – 6.2 | | |
| **Total** | **54** | | |
