import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { EventCalendar } from './EventCalendar'
import { CreateEventForm } from './CreateEventForm'
import { EventItem } from './EditEventRow'
import { Calendar } from 'lucide-react'

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

  const now      = new Date()
  const upcoming = events.filter((e) => new Date(e.eventDate) >= now)
  const past     = events.filter((e) => new Date(e.eventDate) <  now).reverse()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Events</h1>
          <p className="text-sm text-gray-400 mt-0.5">{upcoming.length} upcoming · {past.length} past</p>
        </div>
      </div>

      {/* Calendar */}
      <EventCalendar events={events} />

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-orange" />
          <h2 className="font-semibold text-gray-700 text-sm">Create new event</h2>
        </div>
        <div className="p-5">
          <CreateEventForm />
        </div>
      </div>

      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming</h2>
          {upcoming.length > 0 && (
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{upcoming.length}</span>
          )}
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-gray-400 text-sm">No upcoming events.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-50">
              {upcoming.map((e) => (
                <EventItem key={e.id} event={e} />
              ))}
            </ul>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Past</h2>
            <span className="text-xs text-gray-300">{past.length}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden opacity-75">
            <ul className="divide-y divide-gray-50">
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
