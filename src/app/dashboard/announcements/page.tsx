import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostAnnouncementForm } from './PostAnnouncementForm'
import { deleteAnnouncementAction } from './actions'

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const announcements = await db.announcement.findMany({
    orderBy: { postedAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-brown-dark">Announcements</h1>

      {/* Post form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Post announcement</h2>
        <PostAnnouncementForm />
      </div>

      {/* List */}
      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No announcements yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {announcements.map((a) => (
              <li key={a.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {a.targetLevel && (
                      <span className="inline-block text-xs bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full font-medium mb-1">
                        {a.targetLevel}
                      </span>
                    )}
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{a.body}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(a.postedAt).toLocaleString()}
                    </p>
                  </div>
                  <form action={deleteAnnouncementAction.bind(null, a.id)}>
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:text-brand-red transition-colors whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
