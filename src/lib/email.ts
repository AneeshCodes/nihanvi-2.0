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
