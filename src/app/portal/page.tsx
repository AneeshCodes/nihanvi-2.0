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
      <h1 className="text-2xl font-bold text-brand-brown-dark">
        Hello, {firstName} 👋
      </h1>

      {/* Announcements */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Announcements</h2>
          <Link href="/portal/announcements" className="text-sm text-brand-orange hover:text-brand-brown-mid">
            See all →
          </Link>
        </div>
        {announcements.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">No announcements yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {announcements.map((a) => (
              <li key={a.id} className="px-5 py-4">
                <div className="text-sm text-gray-800 line-clamp-2">{a.body}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(a.postedAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming events */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Upcoming Events</h2>
          <Link href="/portal/events" className="text-sm text-brand-orange hover:text-brand-brown-mid">
            See all →
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">No upcoming events.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {events.map((e) => (
              <li key={e.id} className="px-5 py-4 flex items-start gap-3">
                <div className="bg-brand-orange/10 rounded-lg px-2 py-1 text-center min-w-[44px]">
                  <div className="text-xs text-brand-orange font-bold">
                    {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="text-sm font-bold text-brand-brown-dark">
                    {new Date(e.eventDate).getDate()}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-800">{e.title}</div>
                  {e.description && (
                    <div className="text-xs text-gray-400 mt-0.5">{e.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Homework */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Homework</h2>
          <Link href="/portal/homework" className="text-sm text-brand-orange hover:text-brand-brown-mid">
            See all →
          </Link>
        </div>
        {homeworkItems.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">You&apos;re all caught up! 🎉</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {homeworkItems.map((h) => (
              <li key={h.id} className="px-5 py-4">
                <div className="font-medium text-sm text-gray-800">{h.description ?? h.youtubeUrl}</div>
                {h.dueDate && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    Due {new Date(h.dueDate).toLocaleDateString()}
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
