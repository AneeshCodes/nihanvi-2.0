import Link from 'next/link'

export default function ForgotPasswordSentPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      {/* Checkmark icon */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Check your email</h2>
      <p className="text-sm text-gray-500 mb-6">
        If an account exists for that address, you'll receive a reset link shortly.
      </p>

      <Link href="/login" className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-flex items-center min-h-[44px]">
        Back to sign in
      </Link>
    </div>
  )
}
