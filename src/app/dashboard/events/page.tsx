import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateEventForm } from './CreateEventForm'
import { deleteEventAction } from './actions'

export default async function EventsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const events = await db.event.findMany({
    orderBy: { eventDate: 'asc' },
    include: { _count: { select: { rsvps: true } } },
  })

  const now = new Date()

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
        {events.filter((e) => new Date(e.eventDate) >= now).length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">No upcoming events.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-50">
              {events
                .filter((e) => new Date(e.eventDate) >= now)
                .map((e) => (
                  <li key={e.id} className="px-5 py-4 flex items-start gap-3">
                    <div className="bg-brand-orange/10 rounded-lg px-2 py-1 text-center min-w-[44px] shrink-0">
                      <div className="text-xs text-brand-orange font-bold">
                        {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-brand-brown-dark">
                        {new Date(e.eventDate).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800">{e.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {e.description && ` · ${e.description}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{e._count.rsvps} RSVP{e._count.rsvps !== 1 ? 's' : ''}</div>
                    </div>
                    <form action={deleteEventAction.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="text-xs text-gray-400 hover:text-brand-red transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </section>

      {/* Past */}
      {events.filter((e) => new Date(e.eventDate) < now).length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-50">
              {events
                .filter((e) => new Date(e.eventDate) < now)
                .reverse()
                .map((e) => (
                  <li key={e.id} className="px-5 py-4 flex items-start gap-3 opacity-60">
                    <div className="bg-gray-100 rounded-lg px-2 py-1 text-center min-w-[44px] shrink-0">
                      <div className="text-xs text-gray-500 font-bold">
                        {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-gray-600">
                        {new Date(e.eventDate).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-700">{e.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{e._count.rsvps} RSVP{e._count.rsvps !== 1 ? 's' : ''}</div>
                    </div>
                    <form action={deleteEventAction.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="text-xs text-gray-400 hover:text-brand-red transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
