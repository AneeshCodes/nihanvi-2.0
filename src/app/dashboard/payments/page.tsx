import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RecordPaymentForm } from './RecordPaymentForm'

const statusStyles: Record<string, string> = {
  PAID:    'bg-green-50 text-green-700',
  PENDING: 'bg-yellow-50 text-yellow-700',
  OVERDUE: 'bg-red-50 text-brand-red',
}

const methodLabel: Record<string, string> = {
  ZELLE: 'Zelle',
  CASH:  'Cash',
  OTHER: 'Other',
}

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [payments, students] = await Promise.all([
    db.payment.findMany({
      orderBy: { dueDate: 'desc' },
      include: { student: { select: { id: true, name: true } } },
    }),
    db.user.findMany({
      where: { role: 'STUDENT', active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  const totalOwed = payments
    .filter((p) => p.status !== 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-brown-dark">Payments</h1>
        {totalOwed > 0 && (
          <div className="text-right">
            <div className="text-xs text-gray-400">Total outstanding</div>
            <div className="text-lg font-bold text-brand-red">
              ${(totalOwed / 100).toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Record form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Record payment</h2>
        <RecordPaymentForm students={students} />
      </div>

      {/* List */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No payments recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {payments.map((p) => (
              <li key={p.id} className="px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-gray-800">{p.student.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>
                      {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                    </span>
                    {p.method && (
                      <span className="text-xs text-gray-400">{methodLabel[p.method]}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Due {new Date(p.dueDate).toLocaleDateString()}
                    {p.paidDate && ` · Paid ${new Date(p.paidDate).toLocaleDateString()}`}
                    {p.notes && ` · ${p.notes}`}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-800 shrink-0">
                  ${(p.amount / 100).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
