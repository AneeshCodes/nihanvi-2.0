import Link from 'next/link'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function AuthNotFound() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
      <div className="px-7 py-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-brand-red" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Link not found</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          This link is invalid, has already been used, or has expired.<br />
          Please contact your teacher for a new one.
        </p>
        <Link
          href="/login"
          className="text-sm text-brand-orange hover:text-brand-brown-mid font-medium inline-flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
