export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] shrink-0 bg-brand-brown-dark items-center justify-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-orange/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-brown-mid/10 rounded-full" />

        <div className="relative z-10 text-center px-12">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange mb-6 shadow-lg">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>

          <h1 className="font-display text-5xl text-white leading-tight mb-3">
            Nihanvi<br />School of Dance
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xs mx-auto">
            Nurturing the art of Kuchipudi — a private portal for students and teachers.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-8 h-0.5 bg-brand-orange rounded-full" />
            <div className="w-2 h-2 bg-brand-orange rounded-full" />
            <div className="w-8 h-0.5 bg-brand-orange rounded-full" />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center bg-brand-cream px-6 py-12 min-h-screen">
        <div className="w-full max-w-sm">
          {/* Logo — mobile only */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-orange mb-4 shadow">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
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
