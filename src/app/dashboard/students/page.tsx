import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { InviteForm } from './InviteForm'
import { StudentFilters } from './StudentFilters'
import { ChevronRight } from 'lucide-react'

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { level?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const level = searchParams.level ?? ''
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
    <div className="space-y-10">
      {/* Editorial header */}
      <header>
        <p className="eyebrow">Directory</p>
        <h1 className="editorial-title mt-2">Students</h1>
        <p className="text-sm text-white/50 mt-2">
          {students.length} student{students.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Invite */}
      <section className="glass overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(232,130,12,0.8)]" />
          <h2 className="text-xs font-semibold text-white/80 uppercase tracking-widest">Invite new student</h2>
        </div>
        <div className="p-5">
          <InviteForm />
        </div>
      </section>

      <Suspense>
        <StudentFilters />
      </Suspense>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="glass px-6 py-14 text-center">
          <p className="text-sm text-white/40 italic">No students match these filters.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
            <span className="eyebrow">Students</span>
            <span className="text-xs text-white/40 font-medium">{students.length}</span>
          </div>
          <ul className="divide-y divide-white/[0.04]">
            {students.map((s) => (
              <li key={s.id}>
                <a
                  href={`/dashboard/students/${s.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      s.active
                        ? 'bg-gradient-to-br from-brand-orange to-amber-700 shadow-lg shadow-brand-orange/20'
                        : 'bg-white/[0.05] border border-white/[0.08]'
                    }`}
                  >
                    <span className={`text-xs font-bold ${s.active ? 'text-white' : 'text-white/30'}`}>
                      {s.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${s.active ? 'text-white/90' : 'text-white/40'}`}>
                      {s.name}
                    </div>
                    <div className="text-xs text-white/40 truncate">{s.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!s.active && (
                      <span className="text-[10px] bg-white/[0.06] text-white/40 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                        Inactive
                      </span>
                    )}
                    {s.levelGroup && (
                      <span className="text-[10px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2 py-0.5 rounded-full font-medium">
                        {s.levelGroup}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-brand-orange transition-colors" />
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
