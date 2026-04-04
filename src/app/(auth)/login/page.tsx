// src/app/(auth)/login/page.tsx
import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { reset?: string }
}) {
  return (
    <>
      {/* Success banner — rendered server-side from searchParams */}
      {searchParams.reset === 'success' && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm"
        >
          Password updated. You can now sign in.
        </div>
      )}
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  )
}
