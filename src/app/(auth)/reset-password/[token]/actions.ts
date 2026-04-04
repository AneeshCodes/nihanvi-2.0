'use server'

import { redirect } from 'next/navigation'
import { validateAndConsumeToken } from '@/lib/tokens'
import { setPassword } from '@/lib/users'

export async function resetPasswordAction(
  _prevState: { status: string; message: string; field?: string } | null,
  formData: FormData
) {
  const token           = formData.get('token')           as string
  const password        = formData.get('password')        as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password.length < 8) {
    return { status: 'error', message: 'Password must be at least 8 characters.', field: 'password' }
  }
  if (password !== confirmPassword) {
    return { status: 'error', message: 'Passwords do not match.', field: 'confirmPassword' }
  }

  const result = await validateAndConsumeToken(token, 'RESET')
  if (!result.valid) {
    return { status: 'error', message: 'token_invalid', field: 'token' }
  }

  await setPassword(result.userId, password)
  redirect('/login?reset=success')
}
