/**
 * Tests for app/lib/validations.ts
 *
 * These tests verify the Zod schema rules for registration, login,
 * and profile update — all pure data-validation logic with no
 * network, database, or Next.js server dependencies.
 */
import { registerSchema, loginSchema, profileUpdateSchema } from '../app/lib/validations'

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------
describe('registerSchema', () => {
  const validPayload = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secret123',
    age: 25,
  }

  it('accepts a valid registration payload', () => {
    const result = registerSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, name: 'A' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 2 characters/i)
    }
  })

  it('rejects an invalid email address', () => {
    const result = registerSchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/invalid email/i)
    }
  })

  it('rejects a password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, password: 'abc' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 6 characters/i)
    }
  })

  it('rejects age below 13', () => {
    const result = registerSchema.safeParse({ ...validPayload, age: 10 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 13/i)
    }
  })

  it('rejects age above 120', () => {
    const result = registerSchema.safeParse({ ...validPayload, age: 200 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at most 120/i)
    }
  })

  it('rejects a fractional age', () => {
    const result = registerSchema.safeParse({ ...validPayload, age: 25.5 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/whole number/i)
    }
  })

  it('coerces a numeric string age to a number', () => {
    const result = registerSchema.safeParse({ ...validPayload, age: '30' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.age).toBe(30)
    }
  })
})

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
describe('loginSchema', () => {
  it('accepts valid login credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'pass' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'pass' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/required/i)
    }
  })
})

// ---------------------------------------------------------------------------
// profileUpdateSchema
// ---------------------------------------------------------------------------
describe('profileUpdateSchema', () => {
  it('accepts a valid profile update', () => {
    const result = profileUpdateSchema.safeParse({ name: 'Bob', gender: 'male', age: 30 })
    expect(result.success).toBe(true)
  })

  it('accepts a profile update with only name (all other fields optional)', () => {
    const result = profileUpdateSchema.safeParse({ name: 'Carol' })
    expect(result.success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = profileUpdateSchema.safeParse({ name: 'X' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 2 characters/i)
    }
  })
})
