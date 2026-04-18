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
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/portal' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px] group
              ${active
                ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                : 'text-gray-500 hover:bg-orange-50 hover:text-brand-orange'
              }`}
          >
            <span className={`w-5 h-5 shrink-0 transition-transform duration-150 ${active ? '' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  const sidebar = (
    <div className="flex flex-col h-full bg-[#FFF8F0] border-r border-orange-100">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>
          <div>
            <span className="font-display text-base text-brand-brown-dark leading-tight block">
              Nihanvi
            </span>
            <span className="text-xs text-gray-400 leading-tight block">School of Dance</span>
          </div>
        </div>
      </div>

      {nav}

      {/* User + sign out */}
      <div className="px-3 py-3 border-t border-orange-100/60 bg-[#FFF3E6]/40">
        <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-brown-mid flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <span className="text-sm font-medium text-gray-700 truncate block">{userName}</span>
          </div>
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebar}
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 lg:hidden shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          aria-controls="mobile-sidebar"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-6 h-6 rounded-lg bg-brand-orange flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>
          <span className="font-display text-base text-brand-brown-dark">
            Nihanvi
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-brown-mid flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
