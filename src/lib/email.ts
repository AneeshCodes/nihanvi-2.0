const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

function brevoHeaders() {
  return {
    'Content-Type': 'application/json',
    'api-key': process.env.BREVO_API_KEY!,
  }
}

const SENDER = { name: 'Nihanvi School of Dance', email: 'aneeshparasa@gmail.com' }

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: brevoHeaders(),
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Brevo error ${res.status}: ${body}`)
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  sendEmail(
    to,
    'Reset your Nihanvi portal password',
    `
      <p>Hello,</p>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request a password reset, you can ignore this email.</p>
      <p>— Nihanvi School of Dance</p>
    `
  ).catch(console.error)
}

export async function sendEnrollmentInviteEmail(to: string, enrollUrl: string): Promise<void> {
  sendEmail(
    to,
    "You're invited to Nihanvi School of Dance",
    `
      <p>Hello,</p>
      <p>You have been invited to enroll at <strong>Nihanvi School of Dance</strong>.</p>
      <p>Please click the link below to complete your enrollment form:</p>
      <p><a href="${enrollUrl}">${enrollUrl}</a></p>
      <p>This link is unique to you. If you did not expect this email, you can ignore it.</p>
      <p>— Nihanvi School of Dance</p>
    `
  ).catch(console.error)
}

export async function sendSetupPasswordEmail(to: string, studentName: string, setupUrl: string): Promise<void> {
  sendEmail(
    to,
    'Set up your Nihanvi portal password',
    `
      <p>Hello ${studentName},</p>
      <p>Your enrollment is complete! Click the link below to set up your password and access the student portal.</p>
      <p><a href="${setupUrl}">${setupUrl}</a></p>
      <p>This link expires in 72 hours.</p>
      <p>— Nihanvi School of Dance</p>
    `
  ).catch(console.error)
}
