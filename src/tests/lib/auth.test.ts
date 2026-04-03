import '../mocks/prisma'
import { describe, it, expect, vi } from 'vitest'
import { prismaM } from '../mocks/prisma'

// Mock bcrypt BEFORE importing auth — use vi.hoisted so the mock is available
// inside the vi.mock() factory (Vitest 4.x requirement)
const bcryptCompareMock = vi.hoisted(() => vi.fn())
vi.mock('bcryptjs', () => ({
  default: {
    compare: bcryptCompareMock,
    hash:    vi.fn(),
  },
}))

import { authorizeUser } from '@/lib/auth'

const TEACHER_USER = {
  id:           'u1',
  name:         'Nihanvi Teacher',
  email:        'teacher@example.com',
  passwordHash: 'hashed_password',   // arbitrary — bcrypt.compare is mocked
  role:         'TEACHER' as const,
  active:       true,
}

describe('authorizeUser', () => {
  it('returns user object on valid credentials', async () => {
    prismaM.user.findUnique.mockResolvedValue(TEACHER_USER)
    bcryptCompareMock.mockResolvedValue(true)

    const result = await authorizeUser(TEACHER_USER.email, 'correctpassword')

    expect(result).toEqual({
      id:    TEACHER_USER.id,
      name:  TEACHER_USER.name,
      email: TEACHER_USER.email,
      role:  TEACHER_USER.role,
    })
  })

  it('returns null when user is not found', async () => {
    prismaM.user.findUnique.mockResolvedValue(null)
    const result = await authorizeUser('unknown@example.com', 'any')
    expect(result).toBeNull()
  })

  it('returns null when user is inactive', async () => {
    prismaM.user.findUnique.mockResolvedValue({ ...TEACHER_USER, active: false })
    bcryptCompareMock.mockResolvedValue(true)
    const result = await authorizeUser(TEACHER_USER.email, 'correctpassword')
    expect(result).toBeNull()
  })

  it('returns null when password is wrong', async () => {
    prismaM.user.findUnique.mockResolvedValue(TEACHER_USER)
    bcryptCompareMock.mockResolvedValue(false)
    const result = await authorizeUser(TEACHER_USER.email, 'wrongpassword')
    expect(result).toBeNull()
  })
})
