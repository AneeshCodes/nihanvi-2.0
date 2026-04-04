import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function greeting(name: string) {
  const hour = new Date().getHours()
  const time = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const first = name.split(' ')[0]
  return `${time}, ${first}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [studentCount, eventCount, homeworkCount] = await Promise.all([
    db.user.count({ where: { role: 'STUDENT', active: true } }),
    db.event.count(),
    db.homework.count(),
  ])

  const stats = [
    { label: 'Students', value: studentCount },
    { label: 'Events', value: eventCount },
    { label: 'Homework', value: homeworkCount },
  ]

  const quickLinks = [
    { label: 'Students', href: '/dashboard/students', description: 'Manage enrolled students' },
    { label: 'Homework', href: '/dashboard/homework', description: 'Post assignments' },
    { label: 'Announcements', href: '/dashboard/announcements', description: 'Share updates' },
    { label: 'Events', href: '/dashboard/events', description: 'Schedule classes & events' },
    { label: 'Payments', href: '/dashboard/payments', description: 'Track tuition payments' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-brown-dark mb-6">
        {greeting(session.user?.name ?? 'Teacher')}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-3xl font-bold text-brand-orange">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5
                       hover:border-brand-orange hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-brand-orange transition-colors">
                  {link.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{link.description}</div>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-brand-orange transition-colors shrink-0"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
