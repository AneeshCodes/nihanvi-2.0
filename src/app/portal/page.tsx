import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Megaphone, Calendar, BookOpen, ChevronRight, Clock, Flame } from 'lucide-react'

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
          Hello, {firstName}!
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Announcements */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-sky-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Announcements</h2>
          </div>
          <Link href="/portal/announcements" className="text-xs font-medium text-brand-orange hover:text-brand-brown-mid transition-colors flex items-center gap-0.5">
            See all <ChevronRight className="w-3.5 h-3.5" />
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
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-gray-300" />
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(a.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming events */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Upcoming Events</h2>
          </div>
          <Link href="/portal/events" className="text-xs font-medium text-brand-orange hover:text-brand-brown-mid transition-colors flex items-center gap-0.5">
            See all <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Homework</h2>
          </div>
          <Link href="/portal/homework" className="text-xs font-medium text-brand-orange hover:text-brand-brown-mid transition-colors flex items-center gap-0.5">
            See all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {homeworkItems.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-400">You&apos;re all caught up!</p>
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
                    <Flame className="w-3 h-3 text-amber-400" />
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
