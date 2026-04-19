import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  Users, Calendar, BookOpen, Megaphone, CreditCard, ChevronRight,
  TrendingUp, Sun, Moon, Sunset,
} from 'lucide-react'

function greeting(name: string) {
  const hour = new Date().getHours()
  const first = name.split(' ')[0]
  if (hour < 12) return { text: `Good morning, ${first}`, Icon: Sun }
  if (hour < 17) return { text: `Good afternoon, ${first}`, Icon: Sunset }
  return { text: `Good evening, ${first}`, Icon: Moon }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [studentCount, eventCount, homeworkCount] = await Promise.all([
    db.user.count({ where: { role: 'STUDENT', active: true } }),
    db.event.count(),
    db.homework.count(),
  ])

  const { text: greetingText, Icon: GreetingIcon } = greeting(session.user?.name ?? 'Teacher')

  const stats = [
    {
      label: 'Students',
      value: studentCount,
      href: '/dashboard/students',
      icon: Users,
      accent: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-100',
    },
    {
      label: 'Events',
      value: eventCount,
      href: '/dashboard/events',
      icon: Calendar,
      accent: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      ring: 'ring-purple-100',
    },
    {
      label: 'Homework',
      value: homeworkCount,
      href: '/dashboard/homework',
      icon: BookOpen,
      accent: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      ring: 'ring-amber-100',
    },
  ]

  const quickLinks = [
    { label: 'Students',      href: '/dashboard/students',      description: 'Manage enrolled students', icon: Users,      color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' },
    { label: 'Homework',      href: '/dashboard/homework',      description: 'Post assignments',          icon: BookOpen,   color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' },
    { label: 'Announcements', href: '/dashboard/announcements', description: 'Share updates',             icon: Megaphone,  color: 'bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white' },
    { label: 'Events',        href: '/dashboard/events',        description: 'Schedule classes & events', icon: Calendar,   color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' },
    { label: 'Payments',      href: '/dashboard/payments',      description: 'Track tuition payments',    icon: CreditCard, color: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <GreetingIcon className="w-5 h-5 text-brand-orange" />
            <h1 className="text-2xl font-bold text-brand-brown-dark">{greetingText}</h1>
          </div>
          <p className="text-sm text-gray-400 pl-7">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs text-gray-400">
          <TrendingUp className="w-3.5 h-3.5 text-brand-orange" />
          {studentCount} active students
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5
                         hover:border-brand-orange/30 hover:shadow-md transition-all group overflow-hidden"
            >
              {/* Subtle accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ring-4 ${s.bg} ${s.ring}`}>
                <Icon className={`w-5 h-5 ${s.text}`} />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-brand-brown-dark tracking-tight leading-none mb-1 group-hover:text-brand-orange transition-colors">
                {s.value}
              </div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              <ChevronRight className="absolute right-3 bottom-3 w-4 h-4 text-gray-200 group-hover:text-brand-orange transition-colors" />
            </Link>
          )
        })}
      </div>

      {/* Quick access */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick access</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4
                           hover:border-brand-orange/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${link.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 group-hover:text-brand-orange transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{link.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-orange transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
