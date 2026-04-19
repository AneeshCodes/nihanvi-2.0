import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PaymentsView } from './PaymentsView'
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

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
          <CreditCard className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Payments</h1>
          <p className="text-sm text-gray-400 mt-0.5">{students.length} active students</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <div className="text-2xl font-bold text-green-600">{paid}</div>
          <div className="text-xs text-gray-400 font-medium">Paid</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-1.5">
          <Clock className="w-5 h-5 text-yellow-500" />
          <div className="text-2xl font-bold text-yellow-500">{pending}</div>
          <div className="text-xs text-gray-400 font-medium">Pending</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-1.5">
          <AlertCircle className="w-5 h-5 text-brand-red" />
          <div className="text-2xl font-bold text-brand-red">{overdue}</div>
          <div className="text-xs text-gray-400 font-medium">Overdue</div>
        </div>
      </div>

      <PaymentsView students={data} />
    </div>
  )
}
