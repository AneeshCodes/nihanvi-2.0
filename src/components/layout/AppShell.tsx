'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from './SignOutButton'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface AppShellProps {
  navItems: NavItem[]
  userName: string
  initials: string
  children: React.ReactNode
}

export function AppShell({ navItems, userName, initials, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/portal' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]
              ${active
                ? 'bg-brand-orange text-white'
                : 'text-gray-600 hover:bg-orange-50 hover:text-brand-orange'
              }`}
          >
            <span className="w-5 h-5 shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const sidebar = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <span className="font-display text-xl text-brand-brown-dark leading-tight block">
          Nihanvi<br />School of Dance
        </span>
      </div>

      {nav}

      {/* User + sign out */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <span className="text-sm font-medium text-gray-700 truncate">{userName}</span>
        </div>
        <SignOutButton />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div id="mobile-sidebar" className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col lg:hidden transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebar}
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          aria-controls="mobile-sidebar"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-display text-lg text-brand-brown-dark flex-1 text-center">
          Nihanvi School of Dance
        </span>
        <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
