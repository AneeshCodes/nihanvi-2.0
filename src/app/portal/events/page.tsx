import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RsvpButtons } from './RsvpButtons'
import { Calendar, Clock } from 'lucide-react'

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
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Events</h1>
          <p className="text-sm text-gray-400 mt-0.5">{upcoming.length} upcoming</p>
        </div>
      </div>

      {upcoming.length === 0 && past.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-purple-300" />
          </div>
          <p className="text-gray-400 text-sm font-medium">No events scheduled.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming</h2>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{upcoming.length}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <ul className="space-y-3">
            {upcoming.map((e) => {
              const myRsvp = e.rsvps[0]?.response as 'YES' | 'NO' | 'MAYBE' | undefined
              return (
                <li key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-5">
                    {/* Date chip */}
                    <div className="bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5 text-center min-w-[56px] shrink-0">
                      <div className="text-[10px] text-purple-500 font-bold uppercase tracking-wide">
                        {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-2xl font-bold text-brand-brown-dark leading-none mt-0.5">
                        {new Date(e.eventDate).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 leading-snug">{e.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        <div className="text-xs text-gray-400">
                          {new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                      {e.description && (
                        <div className="text-xs text-gray-500 mt-1.5 leading-relaxed">{e.description}</div>
                      )}
                      <div className="mt-3">
                        <RsvpButtons eventId={e.id} current={myRsvp ?? null} />
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Past</h2>
            <span className="text-xs text-gray-300">{past.length}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <ul className="space-y-2">
            {[...past].reverse().map((e) => {
              const myRsvp = e.rsvps[0]?.response as 'YES' | 'NO' | 'MAYBE' | undefined
              return (
                <li key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex gap-4 opacity-50">
                  <div className="bg-gray-100 rounded-xl px-3 py-2 text-center min-w-[52px] shrink-0">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">
                      {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-lg font-bold text-gray-500 leading-none mt-0.5">
                      {new Date(e.eventDate).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-600 leading-snug">{e.title}</div>
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
