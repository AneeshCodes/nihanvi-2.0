'use server'

import { redirect } from 'next/navigation'
import { validateAndConsumeToken } from '@/lib/tokens'
import { setPassword } from '@/lib/users'

export async function setupPasswordAction(
  _prevState: { status: string; message: string } | null,
  formData: FormData
) {
  const token           = formData.get('token')           as string
  const password        = formData.get('password')        as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password.length < 8) {
    return { status: 'error', message: 'Password must be at least 8 characters.' }
  }
  if (password !== confirmPassword) {
    return { status: 'error', message: 'Passwords do not match.' }
  }

  const result = await validateAndConsumeToken(token, 'SETUP')
  if (!result.valid) {
    return { status: 'error', message: 'token_invalid' }
  }

  await setPassword(result.userId, password)
  redirect('/portal')
}
