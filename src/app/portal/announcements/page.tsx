import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

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
        <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Announcements</h1>
          <p className="text-sm text-gray-400 mt-0.5">{announcements.length} message{announcements.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9" />
            </svg>
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
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    {a.targetLevel}
                  </span>
                )}
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{a.body}</p>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                  <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
