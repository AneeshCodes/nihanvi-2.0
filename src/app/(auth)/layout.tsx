// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-brand-brown-dark leading-tight">
            Nihanvi<br />School of Dance
          </h1>
        </div>
        {children}
      </div>
    </main>
  )
}
