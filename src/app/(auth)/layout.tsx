import { Music2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604] via-[#0f0807] to-[#0a0604]" />
        <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] bg-brand-orange/[0.12] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-amber-600/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-brand-brown-mid/[0.08] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-12">
        {/* Brand mark */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-700 flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(232,130,12,0.6)] mb-5">
            <Music2 className="w-7 h-7 text-white" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
          </div>
          <h1 className="font-display italic text-5xl sm:text-6xl text-white leading-[0.95] tracking-tight">
            Nihanvi
          </h1>
          <p className="font-display italic text-base text-white/50 mt-1 tracking-wide">
            School of Dance
          </p>
          <div className="flex items-center gap-1.5 mt-5">
            <div className="w-6 h-px bg-brand-orange/50" />
            <div className="w-1 h-1 bg-brand-orange rounded-full" />
            <div className="w-6 h-px bg-brand-orange/50" />
          </div>
        </div>

        {/* Form slot */}
        <div className="w-full max-w-sm">
          {children}
        </div>

        {/* Footer quote */}
        <p className="mt-12 text-white/25 text-xs italic font-display tracking-wide text-center">
          नृत्यं शरीरस्य भाषा
        </p>
      </div>
    </div>
  )
}
