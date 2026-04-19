import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostHomeworkForm } from './PostHomeworkForm'
import { ArchiveButton } from './ArchiveButton'
import { ArchivedSection } from './ArchivedSection'
import { Clock } from 'lucide-react'

function targetLabel(hw: { targetType: string; targetLevel: string | null; targetStudent: { name: string } | null }) {
  if (hw.targetType === 'ALL') return 'Everyone'
  if (hw.targetType === 'LEVEL') return `Level: ${hw.targetLevel}`
  if (hw.targetType === 'STUDENT') return hw.targetStudent?.name ?? 'Unknown'
  return '—'
}

export default async function HomeworkPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [activeHW, archivedHW, students] = await Promise.all([
    db.homework.findMany({
      where: { archived: false },
      orderBy: { postedAt: 'desc' },
      include: { targetStudent: true, submissions: true },
    }),
    db.homework.findMany({
      where: { archived: true },
      orderBy: { postedAt: 'desc' },
      include: { targetStudent: true },
    }),
    db.user.findMany({
      where: { role: 'STUDENT', active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Assignments</p>
        <h1 className="editorial-title mt-2">Homework</h1>
        <p className="text-sm text-white/50 mt-2">
          {activeHW.length} active assignment{activeHW.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Post form */}
      <section className="glass overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(232,130,12,0.8)]" />
          <h2 className="text-xs font-semibold text-white/80 uppercase tracking-widest">Post assignment</h2>
        </div>
        <div className="p-5">
          <PostHomeworkForm students={students} />
        </div>
      </section>

      {/* Active list */}
      {activeHW.length === 0 ? (
        <div className="glass px-6 py-14 text-center">
          <p className="text-sm text-white/50 italic">No active assignments</p>
          <p className="text-xs text-white/30 mt-1">Post one above to get started.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
            <span className="eyebrow">Active</span>
            <span className="text-xs text-white/40 font-medium">{activeHW.length}</span>
          </div>
          <ul className="divide-y divide-white/[0.04]">
            {activeHW.map((hw) => {
              const done = hw.submissions.filter((s) => s.markedDone).length
              const total = students.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <li key={hw.id} className="px-5 py-4 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                          {targetLabel(hw)}
                        </span>
                        {hw.dueDate && (
                          <span className="flex items-center gap-1 text-[11px] text-white/40">
                            <Clock className="w-3 h-3" />
                            Due {new Date(hw.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      {hw.youtubeUrl ? (
                        <a
                          href={hw.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-brand-orange hover:underline truncate block"
                        >
                          {hw.youtubeUrl}
                        </a>
                      ) : (
                        <p className="text-sm text-white/40 italic">No video link</p>
                      )}
                      {hw.description && (
                        <p className="text-sm text-white/70 mt-1 leading-relaxed">{hw.description}</p>
                      )}
                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 shrink-0 font-medium uppercase tracking-wider">
                          {done}/{total}
                        </span>
                      </div>
                    </div>
                    <ArchiveButton id={hw.id} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <ArchivedSection items={archivedHW} />
    </div>
  )
}
