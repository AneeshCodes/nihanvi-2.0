import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { markDoneAction, markUndoneAction } from './actions'

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
    orderBy: [
      { dueDate: 'asc' },
      { postedAt: 'desc' },
    ],
    include: {
      submissions: {
        where: { studentId: userId },
        take: 1,
      },
    },
  })

  const pending = homework.filter((h) => !h.submissions[0]?.markedDone)
  const done    = homework.filter((h) =>  h.submissions[0]?.markedDone)

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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-brown-dark">Homework</h1>
            <p className="text-sm text-gray-400 mt-0.5">{pending.length} to do · {done.length} done</p>
          </div>
        </div>
        {homework.length > 0 && (
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all"
                style={{ width: homework.length > 0 ? `${Math.round((done.length / homework.length) * 100)}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">{done.length}/{homework.length}</span>
          </div>
        )}
      </div>

      {homework.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-gray-600 text-sm font-medium">All caught up!</p>
          <p className="text-gray-400 text-xs mt-1">No assignments right now.</p>
        </div>
      )}

      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">To do</h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <ul className="space-y-3">
            {pending.map((h) => {
              const urgency = dueDateUrgency(h.dueDate)
              return (
                <li key={h.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md
                  ${urgency === 'overdue' ? 'border-red-200' : urgency === 'soon' ? 'border-amber-200' : 'border-gray-100'}`}
                >
                  {(urgency === 'overdue' || urgency === 'soon') && (
                    <div className={`h-1 ${urgency === 'overdue' ? 'bg-brand-red' : 'bg-amber-400'}`} />
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
                          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.86a4.85 4.85 0 01-1.01-.17z"/>
                          </svg>
                          Watch on YouTube
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No video link</p>
                      )}
                      {h.description && (
                        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{h.description}</p>
                      )}
                      {h.dueDate && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium
                          ${urgency === 'overdue' ? 'text-brand-red' : urgency === 'soon' ? 'text-amber-600' : 'text-gray-400'}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {urgency === 'overdue' ? 'Overdue · ' : ''}
                          Due {new Date(h.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                    <form action={markDoneAction.bind(null, h.id)} className="shrink-0">
                      <button
                        type="submit"
                        className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
                        aria-label="Mark as done"
                      >
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
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
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed</h2>
          {done.length > 0 && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{done.length}</span>
          )}
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        {done.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-400">Tap the checkmark when you finish an assignment.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {done.map((h) => (
              <li key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 opacity-60">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-500 line-through truncate">
                      {h.description ?? 'YouTube assignment'}
                    </span>
                  </div>
                  <form action={markUndoneAction.bind(null, h.id)} className="shrink-0">
                    <button
                      type="submit"
                      className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-colors"
                      aria-label="Mark as not done"
                    >
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
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
