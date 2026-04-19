import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Megaphone, Calendar, BookOpen, ArrowUpRight, Clock, Flame } from 'lucide-react'

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
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-10">
      {/* Editorial header */}
      <header>
        <p className="text-xs text-white/40 uppercase tracking-[0.25em] mb-3">{dateStr}</p>
        <h1 className="editorial-title">Hello, {firstName}.</h1>
      </header>

      {/* Announcements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-4 h-4 text-brand-orange" />
            <span className="eyebrow">Announcements</span>
          </div>
          <Link href="/portal/announcements" className="text-xs font-medium text-white/40 hover:text-brand-orange transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="glass overflow-hidden">
          {announcements.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-white/40 italic">No announcements yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {announcements.map((a) => (
                <li key={a.id} className="px-5 py-4 hover:bg-white/[0.03] transition-colors">
                  <div className="text-sm text-white/85 line-clamp-2 leading-relaxed">{a.body}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3 h-3 text-white/30" />
                    <span className="text-[11px] text-white/40">
                      {new Date(a.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Upcoming events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-brand-orange" />
            <span className="eyebrow">Upcoming events</span>
          </div>
          <Link href="/portal/events" className="text-xs font-medium text-white/40 hover:text-brand-orange transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="glass overflow-hidden">
          {events.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-white/40 italic">No upcoming events.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {events.map((e) => (
                <li key={e.id} className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.03] transition-colors">
                  <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl px-3 py-2 text-center min-w-[56px] shrink-0">
                    <div className="text-[10px] text-brand-orange font-bold tracking-wider uppercase">
                      {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="font-display italic text-2xl text-white leading-none mt-0.5">
                      {new Date(e.eventDate).getDate()}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-white/90 leading-snug">{e.title}</div>
                    {e.description && (
                      <div className="text-xs text-white/40 mt-1 leading-relaxed line-clamp-2">{e.description}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Homework */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-brand-orange" />
            <span className="eyebrow">Homework</span>
          </div>
          <Link href="/portal/homework" className="text-xs font-medium text-white/40 hover:text-brand-orange transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="glass overflow-hidden">
          {homeworkItems.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-white/40 italic">You&apos;re all caught up.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {homeworkItems.map((h) => (
                <li key={h.id} className="px-5 py-4 hover:bg-white/[0.03] transition-colors">
                  <div className="font-medium text-sm text-white/90 leading-snug">
                    {h.description ?? h.youtubeUrl}
                  </div>
                  {h.dueDate && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span className="text-[11px] text-white/40 font-medium">
                        Due {new Date(h.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
