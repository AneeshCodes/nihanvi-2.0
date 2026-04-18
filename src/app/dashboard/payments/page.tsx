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

  const paid    = data.filter((s) => s.latestPayment?.status === 'PAID').length
  const overdue = data.filter((s) => s.latestPayment?.status === 'OVERDUE').length
  const pending = data.filter((s) => s.latestPayment?.status === 'PENDING').length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Payments</h1>
          <p className="text-sm text-gray-400 mt-0.5">{students.length} active students</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{paid}</div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">Paid</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">{pending}</div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">Pending</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-brand-red">{overdue}</div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">Overdue</div>
        </div>
      </div>

      <PaymentsView students={data} />
    </div>
  )
}
