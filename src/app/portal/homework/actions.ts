'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function markDoneAction(homeworkId: string) {
  const session = await getServerSession(authOptions)
  if (!session) return

  await db.submission.upsert({
    where: { homeworkId_studentId: { homeworkId, studentId: session.user.id } },
    create: {
      homeworkId,
      studentId:  session.user.id,
      markedDone: true,
      doneAt:     new Date(),
    },
    update: {
      markedDone: true,
      doneAt:     new Date(),
    },
  })

  revalidatePath('/portal/homework')
}

export async function markUndoneAction(homeworkId: string) {
  const session = await getServerSession(authOptions)
  if (!session) return

  await db.submission.upsert({
    where: { homeworkId_studentId: { homeworkId, studentId: session.user.id } },
    create: {
      homeworkId,
      studentId:  session.user.id,
      markedDone: false,
    },
    update: {
      markedDone: false,
      doneAt:     null,
    },
  })

  revalidatePath('/portal/homework')
}
