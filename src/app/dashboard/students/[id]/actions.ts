'use server'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createToken } from '@/lib/tokens'
import { sendSetupPasswordEmail } from '@/lib/email'

export async function resendSetupLinkAction(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'TEACHER') redirect('/login')

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/dashboard/students')

  const token    = await createToken(userId, 'SETUP', 72)
  const setupUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/setup-password/${token}`
  await sendSetupPasswordEmail(user.email, user.name, setupUrl)
}

export async function updateLevelGroupAction(userId: string, levelGroup: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'TEACHER') redirect('/login')

  await db.user.update({
    where: { id: userId },
    data: { levelGroup: levelGroup.trim() || null },
  })
  revalidatePath('/dashboard/students')
  revalidatePath(`/dashboard/students/${userId}`)
}

export async function unenrollStudentAction(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'TEACHER') redirect('/login')

  await db.user.update({ where: { id: userId }, data: { active: false } })
  revalidatePath('/dashboard/students')
  redirect('/dashboard/students')
}

export async function reactivateStudentAction(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'TEACHER') redirect('/login')

  await db.user.update({ where: { id: userId }, data: { active: true } })
  revalidatePath('/dashboard/students')
  revalidatePath(`/dashboard/students/${userId}`)
}
