import '../mocks/prisma'
import { describe, it, expect, vi } from 'vitest'
import { prismaM } from '../mocks/prisma'
import { createToken, validateAndConsumeToken } from '@/lib/tokens'

const FUTURE = new Date(Date.now() + 60 * 60 * 1000)
const PAST   = new Date(Date.now() - 60 * 60 * 1000)

describe('createToken', () => {
  it('inserts a token row and returns the raw token string', async () => {
    prismaM.token.create.mockResolvedValue({ token: 'abc123' })
    const result = await createToken('user-1', 'SETUP', 72)
    expect(prismaM.token.create).toHaveBeenCalledOnce()
    const callArgs = prismaM.token.create.mock.calls[0][0].data
    expect(callArgs.userId).toBe('user-1')
    expect(callArgs.type).toBe('SETUP')
    expect(typeof callArgs.token).toBe('string')
    expect(callArgs.token.length).toBe(64) // 32 bytes → 64 hex chars
    expect(typeof result).toBe('string')
  })
})

describe('validateAndConsumeToken', () => {
  it('returns not_found when token does not exist', async () => {
    prismaM.$transaction.mockImplementation(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fn: any) => fn({ token: { findUnique: vi.fn().mockResolvedValue(null), update: vi.fn() } }))
    const result = await validateAndConsumeToken('bad-token', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'not_found' })
  })

  it('returns wrong_type when type does not match', async () => {
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'SETUP', expiresAt: FUTURE, usedAt: null, userId: 'u1' }),
        update: vi.fn(),
      },
    }
    prismaM.$transaction.mockImplementation(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'wrong_type' })
  })

  it('returns expired when expiresAt is in the past', async () => {
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'RESET', expiresAt: PAST, usedAt: null, userId: 'u1' }),
        update: vi.fn(),
      },
    }
    prismaM.$transaction.mockImplementation(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'expired' })
  })

  it('returns already_used when usedAt is set', async () => {
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'RESET', expiresAt: FUTURE, usedAt: PAST, userId: 'u1' }),
        update: vi.fn(),
      },
    }
    prismaM.$transaction.mockImplementation(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: false, reason: 'already_used' })
  })

  it('sets usedAt and returns valid + userId on success', async () => {
    const updateMock = vi.fn().mockResolvedValue({})
    const mockTx = {
      token: {
        findUnique: vi.fn().mockResolvedValue({ id: '1', type: 'RESET', expiresAt: FUTURE, usedAt: null, userId: 'u1' }),
        update: updateMock,
      },
    }
    prismaM.$transaction.mockImplementation(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fn: any) => fn(mockTx))
    const result = await validateAndConsumeToken('tok', 'RESET')
    expect(result).toEqual({ valid: true, userId: 'u1' })
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { usedAt: expect.any(Date) },
    })
  })
})
