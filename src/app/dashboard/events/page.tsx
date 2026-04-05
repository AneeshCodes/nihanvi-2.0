import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
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
  const past     = events.filter((e) => new Date(e.eventDate) <  now).reverse()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Events</h1>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Create event</h2>
        <CreateEventForm />
      </div>

      {/* Upcoming */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
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

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
