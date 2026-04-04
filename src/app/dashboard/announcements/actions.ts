'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function postAnnouncementAction(
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const body        = (formData.get('body')        as string).trim()
  const targetLevel = (formData.get('targetLevel') as string | null)?.trim() || null

  if (!body) return { status: 'error', message: 'Announcement text is required.' }

  await db.announcement.create({ data: { body, targetLevel } })

  revalidatePath('/dashboard/announcements')
  revalidatePath('/portal/announcements')
  return { status: 'success', message: 'Announcement posted.' }
}

export async function deleteAnnouncementAction(id: string) {
  await db.announcement.delete({ where: { id } })
  revalidatePath('/dashboard/announcements')
  revalidatePath('/portal/announcements')
}
