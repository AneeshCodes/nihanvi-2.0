import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostAnnouncementForm } from './PostAnnouncementForm'
import { AnnouncementItem } from './EditAnnouncementRow'

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
              <AnnouncementItem key={a.id} announcement={a} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
