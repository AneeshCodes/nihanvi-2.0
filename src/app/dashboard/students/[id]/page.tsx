import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ResendSetupButton } from './ResendSetupButton'
import { LevelGroupForm } from './LevelGroupForm'
import { unenrollStudentAction, reactivateStudentAction } from './actions'

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const student = await db.user.findUnique({
    where: { id: params.id, role: 'STUDENT' },
    include: {
      registration: true,
      payments: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })

  if (!student) notFound()

  const initials = student.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Back link */}
      <Link href="/dashboard/students" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-orange transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All students
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
          <span className="text-white text-lg font-bold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-brand-brown-dark truncate">{student.name}</h1>
          <p className="text-sm text-gray-500">{student.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${student.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {student.active ? 'Active' : 'Inactive'}
            </span>
            {student.levelGroup && (
              <span className="text-xs bg-orange-50 text-brand-orange px-2 py-1 rounded-full">
                {student.levelGroup}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Level group */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Level / Group</h2>
        <LevelGroupForm userId={student.id} current={student.levelGroup ?? ''} />
      </div>

      {/* Password info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500">Password last changed</span>
            <span className="text-gray-800 font-medium">
              {student.passwordLastChangedAt ? formatDate(student.passwordLastChangedAt) : 'Never set'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Enrolled</span>
            <span className="text-gray-800 font-medium">{formatDate(student.createdAt)}</span>
          </div>
        </div>
        <div className="mt-4">
          <ResendSetupButton userId={student.id} />
        </div>
      </div>

      {/* Registration info */}
      {student.registration && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Registration details</h2>
          <dl className="space-y-2 text-sm">
            {[
              ['Date of birth', formatDate(student.registration.dateOfBirth)],
              ['Parent / guardian', student.registration.parentName],
              ['Primary phone', student.registration.primaryPhone],
              student.registration.alternativePhone ? ['Alt phone', student.registration.alternativePhone] : null,
              ['Address', student.registration.address],
              student.registration.experience ? ['Experience', student.registration.experience] : null,
              student.registration.medicalConditions ? ['Medical notes', student.registration.medicalConditions] : null,
            ].filter((item): item is [string, string] => item !== null).map(([label, value]) => (
              <div key={label as string} className="flex justify-between items-start gap-4 py-1.5 border-b border-gray-50 last:border-0">
                <dt className="text-gray-500 shrink-0">{label}</dt>
                <dd className="text-gray-800 text-right">{value}</dd>
              </div>
            ))}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`w-3 h-3 rounded-full ${student.registration.certificationInterest ? 'bg-brand-orange' : 'bg-gray-200'}`} />
                <span className="text-gray-600">Certification interest</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`w-3 h-3 rounded-full ${student.registration.performanceInterest ? 'bg-brand-orange' : 'bg-gray-200'}`} />
                <span className="text-gray-600">Performance interest</span>
              </div>
            </div>
          </dl>
        </div>
      )}

      {/* Enrolment status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {student.active ? (
          <>
            <h2 className="font-semibold text-gray-800 mb-1">Unenroll student</h2>
            <p className="text-sm text-gray-500 mb-4">
              Deactivates the account. All data is preserved and the student can be reactivated at any time.
            </p>
            <form action={unenrollStudentAction.bind(null, student.id)}>
              <button
                type="submit"
                className="w-full border-2 border-brand-red text-brand-red font-bold py-3 rounded-lg text-sm
                           hover:bg-red-50 transition-colors min-h-[44px]"
              >
                Unenroll {student.name}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-gray-800 mb-1">Reactivate student</h2>
            <p className="text-sm text-gray-500 mb-4">
              This student is currently inactive. Reactivating will restore their portal access immediately.
            </p>
            <form action={reactivateStudentAction.bind(null, student.id)}>
              <button
                type="submit"
                className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg text-sm
                           hover:bg-brand-brown-mid transition-colors min-h-[44px]"
              >
                Reactivate {student.name}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Recent payments</h2>
          <Link href="/dashboard/payments" className="text-sm text-brand-orange hover:text-brand-brown-mid">
            View all →
          </Link>
        </div>
        {student.payments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No payments recorded.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {student.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-gray-800">{formatCents(p.amount)}</span>
                  {p.method && <span className="text-gray-400 ml-2">{p.method.charAt(0) + p.method.slice(1).toLowerCase()}</span>}
                  {p.notes && <span className="text-gray-400 ml-2">· {p.notes}</span>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  p.status === 'PAID'    ? 'bg-green-100 text-green-700' :
                  p.status === 'OVERDUE' ? 'bg-red-100 text-brand-red' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
