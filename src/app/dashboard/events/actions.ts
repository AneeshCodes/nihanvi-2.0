'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function createEventAction(
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const title       = (formData.get('title')       as string).trim()
  const eventDateRaw = formData.get('eventDate')   as string
  const description = (formData.get('description') as string | null)?.trim() || null

  if (!title)        return { status: 'error', message: 'Title is required.' }
  if (!eventDateRaw) return { status: 'error', message: 'Event date is required.' }

  const eventDate = new Date(eventDateRaw)
  if (isNaN(eventDate.getTime())) return { status: 'error', message: 'Invalid date.' }

  await db.event.create({ data: { title, eventDate, description } })

  revalidatePath('/dashboard/events')
  revalidatePath('/portal/events')
  return { status: 'success', message: 'Event created.' }
}

export async function deleteEventAction(id: string) {
  await db.event.delete({ where: { id } })
  revalidatePath('/dashboard/events')
  revalidatePath('/portal/events')
}
