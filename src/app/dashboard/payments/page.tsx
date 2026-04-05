import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PaymentsView } from './PaymentsView'

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const students = await db.user.findMany({
    where: { role: 'STUDENT', active: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      levelGroup: true,
      createdAt: true,
      payments: {
        orderBy: { dueDate: 'desc' },
        take: 1,
        select: { id: true, status: true, amount: true, dueDate: true },
      },
    },
  })

  const data = students.map((s) => ({
    id:            s.id,
    name:          s.name,
    email:         s.email,
    levelGroup:    s.levelGroup,
    createdAt:     s.createdAt,
    latestPayment: s.payments[0] ?? null,
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Payments</h1>
      <PaymentsView students={data} />
    </div>
  )
}
