import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordSentPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
      <div className="px-7 py-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          If an account exists for that address, you&apos;ll receive a reset link shortly.
        </p>

        <Link
          href="/login"
          className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors font-medium inline-flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
