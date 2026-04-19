import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { EventCalendar } from './EventCalendar'
import { CreateEventForm } from './CreateEventForm'
import { EventItem } from './EditEventRow'

export default async function EventsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const events = await db.event.findMany({
    orderBy: { eventDate: 'asc' },
    include: {
      rsvps: {
        include: { student: { select: { name: true } } },
        orderBy: { student: { name: 'asc' } },
      },
    },
  })

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.eventDate) >= now)
  const past = events.filter((e) => new Date(e.eventDate) < now).reverse()

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Calendar</p>
        <h1 className="editorial-title mt-2">Events</h1>
        <p className="text-sm text-white/50 mt-2">
          {upcoming.length} upcoming · {past.length} past
        </p>
      </header>

      {/* Calendar */}
      <EventCalendar events={events} />

      {/* Create form */}
      <section className="glass overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(232,130,12,0.8)]" />
          <h2 className="text-xs font-semibold text-white/80 uppercase tracking-widest">Create event</h2>
        </div>
        <div className="p-5">
          <CreateEventForm />
        </div>
      </section>

      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="eyebrow">Upcoming</span>
          {upcoming.length > 0 && (
            <span className="text-xs text-white/40 font-medium">{upcoming.length}</span>
          )}
          <div className="flex-1 hairline" />
        </div>
        {upcoming.length === 0 ? (
          <div className="glass px-6 py-12 text-center">
            <p className="text-sm text-white/40 italic">No upcoming events.</p>
          </div>
        ) : (
          <div className="glass overflow-hidden">
            <ul className="divide-y divide-white/[0.04]">
              {upcoming.map((e) => (
                <EventItem key={e.id} event={e} />
              ))}
            </ul>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">Past</span>
            <span className="text-xs text-white/30 font-medium">{past.length}</span>
            <div className="flex-1 hairline" />
          </div>
          <div className="glass overflow-hidden opacity-70">
            <ul className="divide-y divide-white/[0.04]">
              {past.map((e) => (
                <EventItem key={e.id} event={e} past />
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
