import nodemailer from 'nodemailer'

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

const FROM = `Nihanvi School of Dance <${process.env.GMAIL_USER}>`

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  createTransport()
    .sendMail({
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

export async function sendEnrollmentInviteEmail(to: string, enrollUrl: string): Promise<void> {
  try {
    const result = await createTransport().sendMail({
      from: FROM,
      to,
      subject: "You're invited to Nihanvi School of Dance",
      html: `
        <p>Hello,</p>
        <p>You have been invited to enroll at <strong>Nihanvi School of Dance</strong>.</p>
        <p>Please click the link below to complete your enrollment form:</p>
        <p><a href="${enrollUrl}">${enrollUrl}</a></p>
        <p>This link is unique to you. If you did not expect this email, you can ignore it.</p>
        <p>— Nihanvi School of Dance</p>
      `,
    })
    console.log('[email] invite sent:', result.messageId, 'to:', to)
  } catch (err) {
    console.error('[email] invite FAILED to:', to, err)
  }
}

export async function sendSetupPasswordEmail(to: string, studentName: string, setupUrl: string): Promise<void> {
  createTransport()
    .sendMail({
      from: FROM,
      to,
      subject: 'Set up your Nihanvi portal password',
      html: `
        <p>Hello ${studentName},</p>
        <p>Your enrollment is complete! Click the link below to set up your password and access the student portal.</p>
        <p><a href="${setupUrl}">${setupUrl}</a></p>
        <p>This link expires in 72 hours.</p>
        <p>— Nihanvi School of Dance</p>
      `,
    })
    .catch(console.error)
}
