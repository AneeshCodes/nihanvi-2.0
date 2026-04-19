import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ResendSetupButton } from './ResendSetupButton'
import { LevelGroupForm } from './LevelGroupForm'
import { unenrollStudentAction, reactivateStudentAction } from './actions'
import { ArrowLeft } from 'lucide-react'

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

  const initials = student.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/students"
        className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-brand-orange transition-colors font-medium uppercase tracking-widest"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All students
      </Link>

      {/* Header card */}
      <div className="glass p-6 flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
            student.active
              ? 'bg-gradient-to-br from-brand-orange to-amber-700 shadow-xl shadow-brand-orange/30'
              : 'bg-white/[0.05] border border-white/[0.08]'
          }`}
        >
          <span className={`text-xl font-display italic ${student.active ? 'text-white' : 'text-white/40'}`}>
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display italic text-3xl text-white tracking-tight truncate">{student.name}</h1>
          <p className="text-sm text-white/50 truncate">{student.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                student.active
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-white/[0.05] text-white/40 border-white/[0.08]'
              }`}
            >
              {student.active ? 'Active' : 'Inactive'}
            </span>
            {student.levelGroup && (
              <span className="text-[10px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2 py-0.5 rounded-full font-semibold">
                {student.levelGroup}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Level group */}
      <div className="glass p-6">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Level / Group</h2>
        <LevelGroupForm userId={student.id} current={student.levelGroup ?? ''} />
      </div>

      {/* Account */}
      <div className="glass p-6">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
            <span className="text-white/50">Password last changed</span>
            <span className="text-white/85 font-medium">
              {student.passwordLastChangedAt ? formatDate(student.passwordLastChangedAt) : 'Never set'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-white/50">Enrolled</span>
            <span className="text-white/85 font-medium">{formatDate(student.createdAt)}</span>
          </div>
        </div>
        <div className="mt-4">
          <ResendSetupButton userId={student.id} />
        </div>
      </div>

      {/* Registration info */}
      {student.registration && (
        <div className="glass p-6">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Registration details</h2>
          <dl className="space-y-2 text-sm">
            {[
              ['Date of birth', formatDate(student.registration.dateOfBirth)],
              ['Parent / guardian', student.registration.parentName],
              ['Primary phone', student.registration.primaryPhone],
              student.registration.alternativePhone ? ['Alt phone', student.registration.alternativePhone] : null,
              ['Address', student.registration.address],
              student.registration.experience ? ['Experience', student.registration.experience] : null,
              student.registration.medicalConditions ? ['Medical notes', student.registration.medicalConditions] : null,
            ]
              .filter((item): item is [string, string] => item !== null)
              .map(([label, value]) => (
                <div key={label as string} className="flex justify-between items-start gap-4 py-1.5 border-b border-white/[0.04] last:border-0">
                  <dt className="text-white/50 shrink-0">{label}</dt>
                  <dd className="text-white/85 text-right">{value}</dd>
                </div>
              ))}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    student.registration.certificationInterest ? 'bg-brand-orange shadow-[0_0_8px_rgba(232,130,12,0.6)]' : 'bg-white/[0.08]'
                  }`}
                />
                <span className="text-white/60">Certification interest</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    student.registration.performanceInterest ? 'bg-brand-orange shadow-[0_0_8px_rgba(232,130,12,0.6)]' : 'bg-white/[0.08]'
                  }`}
                />
                <span className="text-white/60">Performance interest</span>
              </div>
            </div>
          </dl>
        </div>
      )}

      {/* Enrolment status */}
      <div className="glass p-6">
        {student.active ? (
          <>
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Unenroll</h2>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              Deactivates the account. All data is preserved and the student can be reactivated at any time.
            </p>
            <form action={unenrollStudentAction.bind(null, student.id)}>
              <button
                type="submit"
                className="w-full border border-red-500/30 text-red-300 bg-red-500/[0.04] font-semibold py-3 rounded-xl text-sm
                           hover:bg-red-500/10 hover:border-red-500/40 transition-colors min-h-[44px]"
              >
                Unenroll {student.name}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Reactivate</h2>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              This student is currently inactive. Reactivating will restore their portal access immediately.
            </p>
            <form action={reactivateStudentAction.bind(null, student.id)}>
              <button type="submit" className="btn-primary">
                Reactivate {student.name}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Recent payments */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Recent payments</h2>
          <Link href="/dashboard/payments" className="text-xs text-brand-orange hover:text-amber-300 transition-colors font-medium">
            View all →
          </Link>
        </div>
        {student.payments.length === 0 ? (
          <p className="text-sm text-white/40 italic text-center py-4">No payments recorded.</p>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {student.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-white/90">{formatCents(p.amount)}</span>
                  {p.method && <span className="text-white/40 ml-2">{p.method.charAt(0) + p.method.slice(1).toLowerCase()}</span>}
                  {p.notes && <span className="text-white/40 ml-2">· {p.notes}</span>}
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                    p.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : p.status === 'OVERDUE'
                      ? 'bg-red-500/10 text-red-300 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
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
