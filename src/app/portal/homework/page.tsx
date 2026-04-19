import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { markDoneAction, markUndoneAction } from './actions'
import { Check, Clock } from 'lucide-react'

export default async function PortalHomeworkPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = session.user.id

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { levelGroup: true },
  })
  const level = user?.levelGroup ?? null

  const homework = await db.homework.findMany({
    where: {
      archived: false,
      OR: [
        { targetType: 'ALL' },
        ...(level ? [{ targetType: 'LEVEL' as const, targetLevel: level }] : []),
        { targetType: 'STUDENT', targetStudentId: userId },
      ],
    },
    orderBy: [{ dueDate: 'asc' }, { postedAt: 'desc' }],
    include: {
      submissions: {
        where: { studentId: userId },
        take: 1,
      },
    },
  })

  const pending = homework.filter((h) => !h.submissions[0]?.markedDone)
  const done = homework.filter((h) => h.submissions[0]?.markedDone)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const threeDays = new Date(today)
  threeDays.setDate(threeDays.getDate() + 3)

  function dueDateUrgency(dueDate: Date | null) {
    if (!dueDate) return null
    const d = new Date(dueDate)
    d.setHours(0, 0, 0, 0)
    if (d < today) return 'overdue'
    if (d <= threeDays) return 'soon'
    return 'ok'
  }

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Practice</p>
          <h1 className="editorial-title mt-2">Homework</h1>
          <p className="text-sm text-white/50 mt-2">
            {pending.length} to do · {done.length} done
          </p>
        </div>
        {homework.length > 0 && (
          <div className="flex items-center gap-2 glass px-3 py-2 shrink-0">
            <div className="w-16 h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${Math.round((done.length / homework.length) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
              {done.length}/{homework.length}
            </span>
          </div>
        )}
      </header>

      {homework.length === 0 && (
        <div className="glass px-6 py-14 text-center">
          <p className="font-display italic text-2xl text-white">All caught up.</p>
          <p className="text-sm text-white/40 mt-2">No assignments right now.</p>
        </div>
      )}

      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">To do</span>
            <span className="text-xs text-white/40 font-medium">{pending.length}</span>
            <div className="flex-1 hairline" />
          </div>
          <ul className="space-y-3">
            {pending.map((h) => {
              const urgency = dueDateUrgency(h.dueDate)
              return (
                <li
                  key={h.id}
                  className={`glass overflow-hidden transition-all hover:border-white/[0.12]
                    ${urgency === 'overdue' ? 'border-red-500/25' : urgency === 'soon' ? 'border-amber-500/25' : ''}`}
                >
                  {(urgency === 'overdue' || urgency === 'soon') && (
                    <div
                      className={`h-0.5 ${
                        urgency === 'overdue'
                          ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                          : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      }`}
                    />
                  )}
                  <div className="px-5 py-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {h.youtubeUrl ? (
                        <a
                          href={h.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:underline"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          Watch on YouTube
                        </a>
                      ) : (
                        <p className="text-sm text-white/40 italic">No video link</p>
                      )}
                      {h.description && <p className="text-sm text-white/70 mt-1.5 leading-relaxed">{h.description}</p>}
                      {h.dueDate && (
                        <div
                          className={`flex items-center gap-1 mt-2 text-xs font-medium
                            ${urgency === 'overdue' ? 'text-red-300' : urgency === 'soon' ? 'text-amber-300' : 'text-white/40'}`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {urgency === 'overdue' ? 'Overdue · ' : ''}
                          Due {new Date(h.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                    <form action={markDoneAction.bind(null, h.id)} className="shrink-0">
                      <button
                        type="submit"
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all group"
                        aria-label="Mark as done"
                      >
                        <Check className="w-5 h-5 text-white/30 group-hover:text-emerald-300 transition-colors" />
                      </button>
                    </form>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="eyebrow">Completed</span>
          {done.length > 0 && <span className="text-xs text-white/40 font-medium">{done.length}</span>}
          <div className="flex-1 hairline" />
        </div>
        {done.length === 0 ? (
          <div className="glass px-6 py-8 text-center">
            <p className="text-sm text-white/40">Tap the checkmark when you finish an assignment.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {done.map((h) => (
              <li key={h.id} className="glass px-5 py-3 opacity-60">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-white/60 line-through truncate">
                      {h.description ?? 'YouTube assignment'}
                    </span>
                  </div>
                  <form action={markUndoneAction.bind(null, h.id)} className="shrink-0">
                    <button
                      type="submit"
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                      aria-label="Mark as not done"
                    >
                      <Check className="w-4 h-4 text-emerald-300" />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
