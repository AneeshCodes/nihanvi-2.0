'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createInvite } from '@/lib/registrations'
import { sendEnrollmentInviteEmail } from '@/lib/email'

export async function inviteStudentAction(
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'TEACHER') {
    return { status: 'error', message: 'Unauthorized.' }
  }

  const email = (formData.get('email') as string | null)?.trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const token = await createInvite(email)
  const enrollUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/enroll/${token}`
  sendEnrollmentInviteEmail(email, enrollUrl)

  return { status: 'success', message: `Invitation sent to ${email}` }
}
