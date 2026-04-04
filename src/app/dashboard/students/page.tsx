import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { InviteForm } from './InviteForm'

export default async function StudentsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const students = await db.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    include: { registration: true },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-brown-dark">Students</h1>
      </div>

      {/* Invite card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Invite a new student</h2>
        <InviteForm />
      </div>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No students yet. Send an invite above to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {students.map((s) => (
              <li key={s.id}>
                <a
                  href={`/dashboard/students/${s.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <span className="text-brand-orange text-sm font-bold">
                      {s.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-800 truncate">{s.name}</div>
                    <div className="text-xs text-gray-400 truncate">{s.email}</div>
                  </div>
                  {s.levelGroup && (
                    <span className="text-xs bg-orange-50 text-brand-orange px-2 py-1 rounded-full">
                      {s.levelGroup}
                    </span>
                  )}
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
