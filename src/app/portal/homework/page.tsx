import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { markDoneAction, markUndoneAction } from './actions'
import { BookOpen, Check, Clock } from 'lucide-react'

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
            <BookOpen className="w-6 h-6 text-amber-600" />
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
                          <svg className="w-4 h-4 shrink-0 text-brand-orange" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
                          <Clock className="w-3.5 h-3.5" />
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
                        <Check className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
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
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
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
                      <Check className="w-4 h-4 text-green-500" />
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
