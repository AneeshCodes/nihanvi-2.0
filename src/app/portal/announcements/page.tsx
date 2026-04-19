import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Megaphone, Clock, Flame } from 'lucide-react'

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
      OR: [
        { targetLevel: null },
        ...(level ? [{ targetLevel: level }] : []),
      ],
    },
    orderBy: { postedAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
          <Megaphone className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Announcements</h1>
          <p className="text-sm text-gray-400 mt-0.5">{announcements.length} message{announcements.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
            <Megaphone className="w-6 h-6 text-sky-300" />
          </div>
          <p className="text-gray-400 text-sm font-medium">No announcements yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li
              key={a.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Colored top accent if level-targeted */}
              {a.targetLevel && (
                <div className="h-1 bg-gradient-to-r from-brand-orange to-brand-yellow" />
              )}
              <div className="px-5 py-4">
                {a.targetLevel && (
                  <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-brand-orange border border-orange-100 px-2.5 py-0.5 rounded-full font-semibold mb-3">
                    <Flame className="w-3 h-3" />
                    {a.targetLevel}
                  </span>
                )}
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{a.body}</p>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                  <Clock className="w-3.5 h-3.5 text-gray-300" />
                  <p className="text-xs text-gray-400">
                    {new Date(a.postedAt).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
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
