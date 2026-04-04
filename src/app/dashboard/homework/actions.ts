'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function postHomeworkAction(
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const targetType    = formData.get('targetType')      as string
  const targetLevel   = (formData.get('targetLevel')    as string | null)?.trim() || null
  const targetStudentId = (formData.get('targetStudentId') as string | null) || null
  const youtubeUrl    = (formData.get('youtubeUrl')     as string).trim()
  const description   = (formData.get('description')    as string | null)?.trim() || null
  const dueDateRaw    = (formData.get('dueDate')        as string | null) || null

  if (!['ALL', 'LEVEL', 'STUDENT'].includes(targetType)) {
    return { status: 'error', message: 'Invalid target type.' }
  }
  if (!youtubeUrl) {
    return { status: 'error', message: 'YouTube URL is required.' }
  }
  if (targetType === 'LEVEL' && !targetLevel) {
    return { status: 'error', message: 'Level group is required when targeting by level.' }
  }
  if (targetType === 'STUDENT' && !targetStudentId) {
    return { status: 'error', message: 'Please select a student.' }
  }

  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null

  await db.homework.create({
    data: {
      targetType:      targetType as 'ALL' | 'LEVEL' | 'STUDENT',
      targetLevel:     targetType === 'LEVEL'   ? targetLevel   : null,
      targetStudentId: targetType === 'STUDENT' ? targetStudentId : null,
      youtubeUrl,
      description,
      dueDate,
    },
  })

  revalidatePath('/dashboard/homework')
  return { status: 'success', message: 'Homework posted.' }
}

export async function archiveHomeworkAction(id: string) {
  await db.homework.update({ where: { id }, data: { archived: true } })
  revalidatePath('/dashboard/homework')
}
