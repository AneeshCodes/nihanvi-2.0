'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

function combineDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null
  const d = new Date(`${date}T${time}`)
  return isNaN(d.getTime()) ? null : d
}

export async function createEventAction(
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const title       = (formData.get('title')       as string).trim()
  const eventDateRaw = formData.get('eventDate')   as string
  const eventTimeRaw = formData.get('eventTime')   as string
  const description = (formData.get('description') as string | null)?.trim() || null

  if (!title)        return { status: 'error', message: 'Title is required.' }
  if (!eventDateRaw) return { status: 'error', message: 'Date is required.' }
  if (!eventTimeRaw) return { status: 'error', message: 'Time is required.' }

  const eventDate = combineDateTime(eventDateRaw, eventTimeRaw)
  if (!eventDate) return { status: 'error', message: 'Invalid date or time.' }

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

export async function updateEventAction(
  id: string,
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const title        = (formData.get('title')       as string).trim()
  const eventDateRaw =  formData.get('eventDate')   as string
  const eventTimeRaw =  formData.get('eventTime')   as string
  const description  = (formData.get('description') as string | null)?.trim() || null

  if (!title)        return { status: 'error', message: 'Title is required.' }
  if (!eventDateRaw) return { status: 'error', message: 'Date is required.' }
  if (!eventTimeRaw) return { status: 'error', message: 'Time is required.' }

  const eventDate = combineDateTime(eventDateRaw, eventTimeRaw)
  if (!eventDate) return { status: 'error', message: 'Invalid date or time.' }

  await db.event.update({ where: { id }, data: { title, eventDate, description } })

  revalidatePath('/dashboard/events')
  revalidatePath('/portal/events')
  return { status: 'success', message: 'Event updated.' }
}
