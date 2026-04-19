import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Clock, Flame } from 'lucide-react'

export default async function PortalAnnouncementsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { levelGroup: true },
  })
  const level = user?.levelGroup ?? null

  const announcements = await db.announcement.findMany({
    where: {
      OR: [{ targetLevel: null }, ...(level ? [{ targetLevel: level }] : [])],
    },
    orderBy: { postedAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">News</p>
        <h1 className="editorial-title mt-2">Announcements</h1>
        <p className="text-sm text-white/50 mt-2">
          {announcements.length} message{announcements.length !== 1 ? 's' : ''}
        </p>
      </header>

      {announcements.length === 0 ? (
        <div className="glass px-6 py-14 text-center">
          <p className="text-sm text-white/40 italic">No announcements yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li key={a.id} className="glass overflow-hidden hover:border-white/[0.12] transition-all">
              {a.targetLevel && (
                <div className="h-0.5 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange shadow-[0_0_12px_rgba(232,130,12,0.6)]" />
              )}
              <div className="px-5 py-4">
                {a.targetLevel && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2.5 py-0.5 rounded-full font-semibold mb-3 uppercase tracking-wider">
                    <Flame className="w-3 h-3" />
                    {a.targetLevel}
                  </span>
                )}
                <p className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed">{a.body}</p>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.04]">
                  <Clock className="w-3 h-3 text-white/30" />
                  <p className="text-[11px] text-white/40">
                    {new Date(a.postedAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
