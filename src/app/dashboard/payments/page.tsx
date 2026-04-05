import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RecordPaymentForm } from './RecordPaymentForm'
import { PaymentItem } from './EditPaymentRow'

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
              <PaymentItem
                key={p.id}
                payment={{
                  id:          p.id,
                  amount:      p.amount,
                  status:      p.status,
                  method:      p.method,
                  dueDate:     p.dueDate,
                  paidDate:    p.paidDate,
                  notes:       p.notes,
                  studentName: p.student.name,
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
