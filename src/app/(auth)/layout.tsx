import { Music2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-brand-brown-dark via-[#2a0e00] to-[#1a0500]">
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-white/5" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-orange mb-8 shadow-2xl shadow-brand-orange/40">
            <Music2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-5xl text-white leading-tight mb-4">
            Nihanvi<br />School of Dance
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
            A private portal for Kuchipudi dance students and their teacher.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <div className="w-8 h-px bg-brand-orange/60" />
            <div className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
            <div className="w-8 h-px bg-brand-orange/60" />
          </div>
        </div>

        {/* Bottom quote */}
        <div className="absolute bottom-8 left-0 right-0 px-8 text-center">
          <p className="text-white/20 text-xs italic">&ldquo;नृत्यं शरीरस्य भाषा&rdquo; — Dance is the language of the body</p>
        </div>
      </div>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12 min-h-screen">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange mb-4 shadow-lg shadow-brand-orange/30">
              <Music2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-3xl text-brand-brown-dark leading-tight">
              Nihanvi<br />School of Dance
            </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
