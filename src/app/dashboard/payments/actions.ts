'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function recordPaymentAction(
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const studentId  = formData.get('studentId')  as string
  const amountRaw  = formData.get('amount')     as string   // dollars
  const dueDateRaw = formData.get('dueDate')    as string
  const status     = formData.get('status')     as string
  const method     = (formData.get('method')    as string | null) || null
  const notes      = (formData.get('notes')     as string | null)?.trim() || null
  const paidDateRaw = (formData.get('paidDate') as string | null) || null

  if (!studentId)  return { status: 'error', message: 'Please select a student.' }
  if (!amountRaw)  return { status: 'error', message: 'Amount is required.' }
  if (!dueDateRaw) return { status: 'error', message: 'Due date is required.' }
  if (!['PENDING', 'PAID', 'OVERDUE'].includes(status)) {
    return { status: 'error', message: 'Invalid status.' }
  }

  const amountDollars = parseFloat(amountRaw)
  if (isNaN(amountDollars) || amountDollars <= 0) {
    return { status: 'error', message: 'Amount must be a positive number.' }
  }
  const amountCents = Math.round(amountDollars * 100)

  const dueDate  = new Date(dueDateRaw)
  const paidDate = paidDateRaw ? new Date(paidDateRaw) : null

  await db.payment.create({
    data: {
      studentId,
      amount:   amountCents,
      dueDate,
      paidDate,
      status:   status as 'PENDING' | 'PAID' | 'OVERDUE',
      method:   method as 'ZELLE' | 'CASH' | 'OTHER' | null,
      notes,
    },
  })

  revalidatePath('/dashboard/payments')
  return { status: 'success', message: 'Payment recorded.' }
}

export async function updatePaymentAction(
  id: string,
  _prev: { status: string; message: string } | null,
  formData: FormData
) {
  const amountRaw   = (formData.get('amount')   as string).trim()
  const status      = formData.get('status')    as string
  const method      = (formData.get('method')   as string | null) || null
  const paidDateRaw = (formData.get('paidDate') as string | null) || null
  const notes       = (formData.get('notes')    as string | null)?.trim() || null

  if (!amountRaw) return { status: 'error', message: 'Amount is required.' }
  if (!['PENDING', 'PAID', 'OVERDUE'].includes(status)) {
    return { status: 'error', message: 'Invalid status.' }
  }

  const amountDollars = parseFloat(amountRaw)
  if (isNaN(amountDollars) || amountDollars <= 0) {
    return { status: 'error', message: 'Amount must be a positive number.' }
  }

  await db.payment.update({
    where: { id },
    data: {
      amount:   Math.round(amountDollars * 100),
      status:   status as 'PENDING' | 'PAID' | 'OVERDUE',
      method:   method as 'ZELLE' | 'CASH' | 'OTHER' | null,
      paidDate: paidDateRaw ? new Date(paidDateRaw) : null,
      notes,
    },
  })

  revalidatePath('/dashboard/payments')
  return { status: 'success', message: 'Payment updated.' }
}
