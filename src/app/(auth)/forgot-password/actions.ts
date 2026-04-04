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
    sendPasswordResetEmail(user.email, resetUrl)
  }

  redirect('/forgot-password/sent')
}
