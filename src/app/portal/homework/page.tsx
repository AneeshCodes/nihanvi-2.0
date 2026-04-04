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

  const pending  = homework.filter((h) => !h.submissions[0]?.markedDone)
  const done     = homework.filter((h) => h.submissions[0]?.markedDone)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Homework</h1>

      {homework.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No assignments right now. 🎉</p>
        </div>
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">To do</h2>
          <ul className="space-y-3">
            {pending.map((h) => (
              <li key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={h.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-orange hover:underline break-all"
                    >
                      Watch on YouTube ↗
                    </a>
                    {h.description && (
                      <p className="text-sm text-gray-700 mt-1">{h.description}</p>
                    )}
                    {h.dueDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Due {new Date(h.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <form action={markDoneAction.bind(null, h.id)} className="shrink-0">
                    <button
                      type="submit"
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-brand-orange transition-colors"
                      aria-label="Mark as done"
                    >
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Completed</h2>
          <ul className="space-y-3">
            {done.map((h) => (
              <li key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 opacity-60">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={h.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-500 hover:underline break-all"
                    >
                      Watch on YouTube ↗
                    </a>
                    {h.description && (
                      <p className="text-sm text-gray-500 mt-1">{h.description}</p>
                    )}
                  </div>
                  <form action={markUndoneAction.bind(null, h.id)} className="shrink-0">
                    <button
                      type="submit"
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-brand-orange bg-brand-orange/10 transition-colors"
                      aria-label="Mark as not done"
                    >
                      <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
