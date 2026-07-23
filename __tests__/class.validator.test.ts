/**
 * Tests for app/validators/class.validator.ts
 *
 * Verifies that validateCreate() and validateUpdate() enforce
 * schema rules and throw descriptive errors on invalid data.
 * No network, database, or Next.js server dependencies.
 */
import { classValidator } from '../app/validators/class.validator'

// A complete valid class payload
const validClass = {
  title: 'Morning Yoga',
  description: 'A relaxing yoga session to start your day.',
  instructor: 'Jane Doe',
  category: 'Yoga',
  imageUrl: 'https://images.unsplash.com/photo-example',
  location: 'Studio A',
  startTime: '2025-01-01T09:00:00.000Z',
  endTime: '2025-01-01T10:00:00.000Z',
  capacity: 20,
  price: 15,
}

// ---------------------------------------------------------------------------
// classValidator.validateCreate
// ---------------------------------------------------------------------------
describe('classValidator.validateCreate', () => {
  it('accepts a valid fitness class payload', () => {
    expect(() => classValidator.validateCreate(validClass)).not.toThrow()
  })

  it('returns the parsed data on success', () => {
    const result = classValidator.validateCreate(validClass)
    expect(result.title).toBe('Morning Yoga')
    expect(result.capacity).toBe(20)
  })

  it('throws when title is too short (< 3 chars)', () => {
    expect(() =>
      classValidator.validateCreate({ ...validClass, title: 'Hi' })
    ).toThrow(/at least 3 characters/i)
  })

  it('throws when description is too short (< 10 chars)', () => {
    expect(() =>
      classValidator.validateCreate({ ...validClass, description: 'Short' })
    ).toThrow(/at least 10 characters/i)
  })

  it('throws when imageUrl is not a valid URL', () => {
    expect(() =>
      classValidator.validateCreate({ ...validClass, imageUrl: 'not-a-url' })
    ).toThrow(/invalid image url/i)
  })

  it('throws when capacity is not a positive integer', () => {
    expect(() =>
      classValidator.validateCreate({ ...validClass, capacity: -5 })
    ).toThrow()
  })

  it('throws when price is not positive', () => {
    expect(() =>
      classValidator.validateCreate({ ...validClass, price: 0 })
    ).toThrow()
  })

  it('throws when startTime is after endTime', () => {
    expect(() =>
      classValidator.validateCreate({
        ...validClass,
        startTime: '2025-01-01T11:00:00.000Z',
        endTime: '2025-01-01T09:00:00.000Z',
      })
    ).toThrow(/start time must be before end time/i)
  })
})

// ---------------------------------------------------------------------------
// classValidator.validateUpdate
// ---------------------------------------------------------------------------
describe('classValidator.validateUpdate', () => {
  it('accepts a partial update (all fields optional)', () => {
    expect(() =>
      classValidator.validateUpdate({ title: 'Evening Pilates' })
    ).not.toThrow()
  })

  it('throws when the optional title is too short', () => {
    expect(() =>
      classValidator.validateUpdate({ title: 'No' })
    ).toThrow(/at least 3 characters/i)
  })

  it('throws when both times are present and start is after end', () => {
    expect(() =>
      classValidator.validateUpdate({
        startTime: '2025-01-01T11:00:00.000Z',
        endTime: '2025-01-01T09:00:00.000Z',
      })
    ).toThrow(/start time must be before end time/i)
  })

  it('accepts when only startTime is provided (no cross-field check)', () => {
    // Only one time provided — the refine guard short-circuits, so no error
    expect(() =>
      classValidator.validateUpdate({ startTime: '2025-01-01T09:00:00.000Z' })
    ).not.toThrow()
  })
})
