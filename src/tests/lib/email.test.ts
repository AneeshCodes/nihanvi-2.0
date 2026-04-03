import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMock = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}))

import { sendPasswordResetEmail } from '@/lib/email'

beforeEach(() => { sendMock.mockReset() })

describe('sendPasswordResetEmail', () => {
  it('calls resend with correct to address and reset URL in html', async () => {
    sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null })
    await sendPasswordResetEmail('student@example.com', 'http://localhost:3000/reset-password/abc123')

    expect(sendMock).toHaveBeenCalledOnce()
    const args = sendMock.mock.calls[0][0]
    expect(args.to).toBe('student@example.com')
    expect(args.html).toContain('http://localhost:3000/reset-password/abc123')
  })

  it('does not throw if resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'rate limited' } })
    await expect(sendPasswordResetEmail('x@y.com', 'http://localhost:3000/reset-password/tok')).resolves.not.toThrow()
  })
})
