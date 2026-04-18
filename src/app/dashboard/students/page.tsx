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

  let activeFilter: boolean | undefined = true
  if (status === 'inactive') activeFilter = false
  else if (status === 'all') activeFilter = undefined

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
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Students</h1>
          <p className="text-sm text-gray-400 mt-0.5">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Invite card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-orange" />
          <h2 className="font-semibold text-gray-700 text-sm">Invite a new student</h2>
        </div>
        <div className="p-5">
          <InviteForm />
        </div>
      </div>

      {/* Filters */}
      <Suspense>
        <StudentFilters />
      </Suspense>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">No students match these filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Students</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{students.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {students.map((s) => (
              <li key={s.id}>
                <a
                  href={`/dashboard/students/${s.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-orange-50/30 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${s.active ? 'bg-gradient-to-br from-brand-orange to-brand-brown-mid' : 'bg-gray-200'}`}>
                    <span className={`text-xs font-bold ${s.active ? 'text-white' : 'text-gray-400'}`}>
                      {s.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm truncate ${s.active ? 'text-gray-800' : 'text-gray-400'}`}>{s.name}</div>
                    <div className="text-xs text-gray-400 truncate">{s.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!s.active && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Inactive</span>
                    )}
                    {s.levelGroup && (
                      <span className="text-xs bg-orange-50 text-brand-orange border border-orange-100 px-2 py-0.5 rounded-full font-medium">
                        {s.levelGroup}
                      </span>
                    )}
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
