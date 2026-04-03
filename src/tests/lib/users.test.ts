import '../mocks/prisma'
import { describe, it, expect } from 'vitest'
import { prismaM } from '../mocks/prisma'
import { setPassword } from '@/lib/users'

describe('setPassword', () => {
  it('updates passwordHash and passwordLastChangedAt', async () => {
    prismaM.user.update.mockResolvedValue({})
    await setPassword('user-1', 'newPassword123')

    expect(prismaM.user.update).toHaveBeenCalledOnce()
    const args = prismaM.user.update.mock.calls[0][0]
    expect(args.where).toEqual({ id: 'user-1' })
    expect(typeof args.data.passwordHash).toBe('string')
    expect(args.data.passwordHash).not.toBe('newPassword123') // must be hashed
    expect(args.data.passwordLastChangedAt).toBeInstanceOf(Date)
  })
})
