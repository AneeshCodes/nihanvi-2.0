import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RsvpButtons } from './RsvpButtons'
import { Clock } from 'lucide-react'

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
  const past = events.filter((e) => new Date(e.eventDate) < new Date())

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Calendar</p>
        <h1 className="editorial-title mt-2">Events</h1>
        <p className="text-sm text-white/50 mt-2">{upcoming.length} upcoming</p>
      </header>

      {upcoming.length === 0 && past.length === 0 && (
        <div className="glass px-6 py-14 text-center">
          <p className="text-sm text-white/40 italic">No events scheduled.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">Upcoming</span>
            <span className="text-xs text-white/40 font-medium">{upcoming.length}</span>
            <div className="flex-1 hairline" />
          </div>
          <ul className="space-y-3">
            {upcoming.map((e) => {
              const myRsvp = e.rsvps[0]?.response as 'YES' | 'NO' | 'MAYBE' | undefined
              return (
                <li key={e.id} className="glass overflow-hidden hover:border-white/[0.12] transition-all">
                  <div className="flex gap-4 p-5">
                    {/* Date chip */}
                    <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl px-3 py-2.5 text-center min-w-[62px] shrink-0">
                      <div className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">
                        {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="font-display italic text-3xl text-white leading-none mt-0.5">
                        {new Date(e.eventDate).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white/90 leading-snug">{e.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-white/30" />
                        <div className="text-xs text-white/50">
                          {new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                      {e.description && (
                        <div className="text-xs text-white/60 mt-2 leading-relaxed">{e.description}</div>
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
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">Past</span>
            <span className="text-xs text-white/30 font-medium">{past.length}</span>
            <div className="flex-1 hairline" />
          </div>
          <ul className="space-y-2">
            {[...past].reverse().map((e) => {
              const myRsvp = e.rsvps[0]?.response as 'YES' | 'NO' | 'MAYBE' | undefined
              return (
                <li key={e.id} className="glass px-5 py-3 flex gap-4 opacity-50">
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-center min-w-[56px] shrink-0">
                    <div className="text-[10px] text-white/40 font-bold uppercase">
                      {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="font-display italic text-xl text-white/60 leading-none mt-0.5">
                      {new Date(e.eventDate).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white/70 leading-snug">{e.title}</div>
                    {myRsvp && (
                      <div className="text-xs text-white/40 mt-0.5">
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
