import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RsvpButtons } from './RsvpButtons'

export default async function PortalEventsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = session.user.id

  const events = await db.event.findMany({
    orderBy: { eventDate: 'asc' },
    include: {
      rsvps: {
        where: { studentId: userId },
        take: 1,
      },
    },
  })

  const upcoming = events.filter((e) => new Date(e.eventDate) >= new Date())
  const past     = events.filter((e) => new Date(e.eventDate) <  new Date())

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Events</h1>

      {upcoming.length === 0 && past.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No events scheduled.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
          <ul className="space-y-3">
            {upcoming.map((e) => {
              const myRsvp = e.rsvps[0]?.response as 'YES' | 'NO' | 'MAYBE' | undefined
              return (
                <li key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex gap-4">
                  <div className="bg-brand-orange/10 rounded-xl px-3 py-2 text-center min-w-[52px] shrink-0">
                    <div className="text-xs text-brand-orange font-bold">
                      {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-xl font-bold text-brand-brown-dark leading-none mt-0.5">
                      {new Date(e.eventDate).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800">{e.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                    {e.description && (
                      <div className="text-xs text-gray-500 mt-1">{e.description}</div>
                    )}
                    <RsvpButtons eventId={e.id} current={myRsvp ?? null} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past</h2>
          <ul className="space-y-3">
            {[...past].reverse().map((e) => {
              const myRsvp = e.rsvps[0]?.response as 'YES' | 'NO' | 'MAYBE' | undefined
              return (
                <li key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex gap-4 opacity-60">
                  <div className="bg-gray-100 rounded-xl px-3 py-2 text-center min-w-[52px] shrink-0">
                    <div className="text-xs text-gray-500 font-bold">
                      {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-xl font-bold text-gray-600 leading-none mt-0.5">
                      {new Date(e.eventDate).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-700">{e.title}</div>
                    {myRsvp && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        You responded: {myRsvp === 'YES' ? 'Going' : myRsvp === 'MAYBE' ? 'Maybe' : "Can't go"}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
