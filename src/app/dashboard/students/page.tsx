import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { InviteForm } from './InviteForm'
import { StudentFilters } from './StudentFilters'

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { level?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const level  = searchParams.level  ?? ''
  const status = searchParams.status ?? ''

  // Build active filter
  let activeFilter: boolean | undefined = true // default: active only
  if (status === 'inactive') activeFilter = false
  else if (status === 'all') activeFilter = undefined

  // Build level filter
  let levelFilter: { levelGroup: string | null } | undefined
  if (level === 'none') levelFilter = { levelGroup: null }
  else if (level) levelFilter = { levelGroup: level }

  const students = await db.user.findMany({
    where: {
      role: 'STUDENT',
      ...(activeFilter !== undefined ? { active: activeFilter } : {}),
      ...levelFilter,
    },
    orderBy: { name: 'asc' },
    include: { registration: true },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Students</h1>

      {/* Invite card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Invite a new student</h2>
        <InviteForm />
      </div>

      {/* Filters */}
      <Suspense>
        <StudentFilters />
      </Suspense>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No students match these filters.</p>
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
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${s.active ? 'bg-brand-orange/10' : 'bg-gray-100'}`}>
                    <span className={`text-sm font-bold ${s.active ? 'text-brand-orange' : 'text-gray-400'}`}>
                      {s.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${s.active ? 'text-gray-800' : 'text-gray-400'}`}>{s.name}</div>
                    <div className="text-xs text-gray-400 truncate">{s.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!s.active && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Inactive</span>
                    )}
                    {s.levelGroup && (
                      <span className="text-xs bg-orange-50 text-brand-orange px-2 py-1 rounded-full">
                        {s.levelGroup}
                      </span>
                    )}
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
