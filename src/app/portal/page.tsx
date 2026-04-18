import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function PortalPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = session.user?.id

  const userRecord = await db.user.findUnique({
    where: { id: userId },
    select: { levelGroup: true },
  })
  const level = userRecord?.levelGroup ?? null

  const [announcements, events, homeworkItems] = await Promise.all([
    db.announcement.findMany({
      where: {
        OR: [
          { targetLevel: null },
          ...(level ? [{ targetLevel: level }] : []),
        ],
      },
      orderBy: { postedAt: 'desc' },
      take: 3,
    }),
    db.event.findMany({
      where: { eventDate: { gte: new Date() } },
      orderBy: { eventDate: 'asc' },
      take: 3,
    }),
    db.homework.findMany({
      where: {
        archived: false,
        OR: [
          { targetType: 'ALL' },
          ...(level ? [{ targetType: 'LEVEL' as const, targetLevel: level }] : []),
          { targetType: 'STUDENT', targetStudentId: userId },
        ],
        dueDate: { gte: new Date() },
      },
      orderBy: { dueDate: 'asc' },
      take: 3,
    }),
  ])

  const firstName = (session.user?.name ?? 'there').split(' ')[0]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-brand-brown-dark">
          Hello, {firstName}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Announcements */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Announcements</h2>
          </div>
          <Link href="/portal/announcements" className="text-xs font-medium text-brand-orange hover:text-brand-brown-mid transition-colors flex items-center gap-1">
            See all
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {announcements.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-400">No announcements yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {announcements.map((a) => (
              <li key={a.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{a.body}</div>
                <div className="text-xs text-gray-400 mt-1.5 font-medium">
                  {new Date(a.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming events */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Upcoming Events</h2>
          </div>
          <Link href="/portal/events" className="text-xs font-medium text-brand-orange hover:text-brand-brown-mid transition-colors flex items-center gap-1">
            See all
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-400">No upcoming events.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {events.map((e) => (
              <li key={e.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl px-2.5 py-2 text-center min-w-[52px] shrink-0">
                  <div className="text-[10px] text-brand-orange font-bold tracking-wide uppercase">
                    {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-lg font-bold text-brand-brown-dark leading-none mt-0.5">
                    {new Date(e.eventDate).getDate()}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-gray-800 leading-snug">{e.title}</div>
                  {e.description && (
                    <div className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{e.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Homework */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Homework</h2>
          </div>
          <Link href="/portal/homework" className="text-xs font-medium text-brand-orange hover:text-brand-brown-mid transition-colors flex items-center gap-1">
            See all
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {homeworkItems.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-400">You&apos;re all caught up! 🎉</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {homeworkItems.map((h) => (
              <li key={h.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="font-medium text-sm text-gray-800 leading-snug">
                  {h.description ?? h.youtubeUrl}
                </div>
                {h.dueDate && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-400 font-medium">
                      Due {new Date(h.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
