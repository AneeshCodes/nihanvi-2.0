'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function rsvpAction(eventId: string, response: 'YES' | 'NO' | 'MAYBE') {
  const session = await getServerSession(authOptions)
  if (!session) return

  await db.rsvp.upsert({
    where: { eventId_studentId: { eventId, studentId: session.user.id } },
    create: { eventId, studentId: session.user.id, response },
    update: { response },
  })

  revalidatePath('/portal/events')
}
