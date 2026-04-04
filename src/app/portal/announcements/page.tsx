import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function PortalAnnouncementsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  // Fetch the student's level so we can filter level-targeted announcements
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
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Announcements</h1>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No announcements yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              {a.targetLevel && (
                <span className="inline-block text-xs bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full font-medium mb-2">
                  {a.targetLevel}
                </span>
              )}
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{a.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(a.postedAt).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
