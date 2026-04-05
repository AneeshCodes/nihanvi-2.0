import Link from 'next/link'

export default function AuthNotFound() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Link not found</h2>
      <p className="text-sm text-gray-500 mb-6">
        This link is invalid, has already been used, or has expired.<br />
        Please contact your teacher for a new one.
      </p>
      <Link
        href="/login"
        className="text-sm text-brand-orange hover:text-brand-brown-mid"
      >
        Back to sign in
      </Link>
    </div>
  )
}
