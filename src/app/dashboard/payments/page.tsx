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
    id: s.id,
    name: s.name,
    email: s.email,
    levelGroup: s.levelGroup,
    createdAt: s.createdAt,
    latestPayment: s.payments[0] ?? null,
  }))

  const paid = data.filter((s) => s.latestPayment?.status === 'PAID').length
  const overdue = data.filter((s) => s.latestPayment?.status === 'OVERDUE').length
  const pending = data.filter((s) => s.latestPayment?.status === 'PENDING').length

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Finance</p>
        <h1 className="editorial-title mt-2">Payments</h1>
        <p className="text-sm text-white/50 mt-2">{students.length} active students</p>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-px bg-white/[0.05] glass overflow-hidden">
        <div className="bg-[#0a0604]/80 p-6 text-center">
          <div className="stat-numeral text-5xl leading-none tracking-tight">{paid}</div>
          <div className="text-[10px] text-emerald-300/80 font-semibold uppercase tracking-widest mt-3">Paid</div>
        </div>
        <div className="bg-[#0a0604]/80 p-6 text-center">
          <div className="font-display italic text-5xl leading-none tracking-tight text-amber-300">{pending}</div>
          <div className="text-[10px] text-amber-300/80 font-semibold uppercase tracking-widest mt-3">Pending</div>
        </div>
        <div className="bg-[#0a0604]/80 p-6 text-center">
          <div className="font-display italic text-5xl leading-none tracking-tight text-red-300">{overdue}</div>
          <div className="text-[10px] text-red-300/80 font-semibold uppercase tracking-widest mt-3">Overdue</div>
        </div>
      </div>

      <PaymentsView students={data} />
    </div>
  )
}
