import Link from 'next/link'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function AuthNotFound() {
  return (
    <div className="glass-raised overflow-hidden">
      <div className="px-7 py-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-red-300" />
          </div>
        </div>
        <span className="eyebrow">Not found</span>
        <h2 className="font-display italic text-3xl text-white mt-2 tracking-tight">
          Link not found
        </h2>
        <p className="text-sm text-white/50 leading-relaxed mt-3 mb-6">
          This link is invalid, has already been used, or has expired.
          <br />
          Please contact your teacher for a new one.
        </p>
        <Link href="/login" className="text-xs text-white/50 hover:text-brand-orange transition-colors font-medium inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3 h-3" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
