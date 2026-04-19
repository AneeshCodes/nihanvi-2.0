import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function EnrollSuccessPage() {
  return (
    <div className="glass-raised overflow-hidden">
      <div className="px-7 py-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-300" />
          </div>
        </div>
        <span className="eyebrow">Enrolled</span>
        <h2 className="font-display italic text-3xl text-white mt-2 tracking-tight">
          You&apos;re in
        </h2>
        <p className="text-sm text-white/50 leading-relaxed mt-3 mb-6">
          Check your email for a link to set up your password and access the student portal.
        </p>
        <Link href="/login" className="text-xs text-white/50 hover:text-brand-orange transition-colors font-medium inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3 h-3" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
