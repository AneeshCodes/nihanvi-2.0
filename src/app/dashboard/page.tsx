import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Users, Calendar, BookOpen, Megaphone, CreditCard, ArrowUpRight } from 'lucide-react'

function greeting(name: string) {
  const hour = new Date().getHours()
  const first = name.split(' ')[0]
  if (hour < 12) return `Good morning, ${first}`
  if (hour < 17) return `Good afternoon, ${first}`
  return `Good evening, ${first}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [studentCount, eventCount, homeworkCount] = await Promise.all([
    db.user.count({ where: { role: 'STUDENT', active: true } }),
    db.event.count(),
    db.homework.count(),
  ])

  const greet = greeting(session.user?.name ?? 'Teacher')
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const stats = [
    { label: 'Students',  value: studentCount,   href: '/dashboard/students',  icon: Users },
    { label: 'Events',    value: eventCount,     href: '/dashboard/events',    icon: Calendar },
    { label: 'Homework',  value: homeworkCount,  href: '/dashboard/homework',  icon: BookOpen },
  ]

  const quickLinks = [
    { label: 'Students',      href: '/dashboard/students',      description: 'Manage enrolled students', icon: Users },
    { label: 'Homework',      href: '/dashboard/homework',      description: 'Post assignments',          icon: BookOpen },
    { label: 'Announcements', href: '/dashboard/announcements', description: 'Share updates',             icon: Megaphone },
    { label: 'Events',        href: '/dashboard/events',        description: 'Schedule classes & events', icon: Calendar },
    { label: 'Payments',      href: '/dashboard/payments',      description: 'Track tuition payments',    icon: CreditCard },
  ]

  return (
    <div className="space-y-12">
      {/* Editorial header */}
      <header>
        <p className="text-xs text-white/40 uppercase tracking-[0.25em] mb-3">{dateStr}</p>
        <h1 className="editorial-title">
          {greet}.
        </h1>
      </header>

      {/* Stats — huge serif numerals */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="eyebrow">Overview</span>
          <div className="flex-1 hairline" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.05] glass overflow-hidden">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.label}
                href={s.href}
                className="group relative p-7 bg-[#0a0604]/80 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-5 h-5 text-white/40 group-hover:text-brand-orange transition-colors" />
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="stat-numeral text-7xl sm:text-8xl leading-none tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-[0.2em] mt-4 font-medium">
                  {s.label}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick access */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="eyebrow">Quick access</span>
          <div className="flex-1 hairline" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group glass px-5 py-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-brand-orange/20 group-hover:border-brand-orange/30 transition-all">
                    <Icon className="w-5 h-5 text-white/60 group-hover:text-brand-orange transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display italic text-lg text-white tracking-tight leading-tight">
                      {link.label}
                    </div>
                    <div className="text-xs text-white/40 mt-1 leading-relaxed">
                      {link.description}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
