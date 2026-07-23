/**
 * Tests for app/components/ui/Badge.tsx
 *
 * Verifies that the Badge component renders its content and
 * applies the correct CSS classes for each variant.
 * Uses React Testing Library — no Next.js server dependencies.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import Badge from '../app/components/ui/Badge'

describe('Badge component', () => {
  it('renders its children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders as a <span> element', () => {
    const { container } = render(<Badge>Tag</Badge>)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('applies the "primary" variant class by default', () => {
    const { container } = render(<Badge>Default</Badge>)
    const span = container.firstChild as HTMLElement
    // Primary variant uses the #72BF6A color token
    expect(span.className).toContain('text-[#72BF6A]')
  })

  it('applies the "danger" variant class when variant="danger"', () => {
    const { container } = render(<Badge variant="danger">Error</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('text-red-800')
  })

  it('applies the "success" variant class when variant="success"', () => {
    const { container } = render(<Badge variant="success">Done</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('text-green-800')
  })

  it('applies the "warning" variant class when variant="warning"', () => {
    const { container } = render(<Badge variant="warning">Pending</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('text-yellow-800')
  })

  it('merges an additional className prop', () => {
    const { container } = render(<Badge className="custom-class">Label</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('custom-class')
  })
})

// ---------------------------------------------------------------------------
// SectionHeading component — tested here because it has no CSS/image imports
// ---------------------------------------------------------------------------
import SectionHeading from '../app/components/ui/SectionHeading'

describe('SectionHeading component', () => {
  it('renders the title text', () => {
    render(<SectionHeading title="My Section" />)
    expect(screen.getByText('My Section')).toBeInTheDocument()
  })

  it('renders the title inside an h2', () => {
    render(<SectionHeading title="Dashboard" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<SectionHeading title="Classes" subtitle="Browse all available classes" />)
    expect(screen.getByText('Browse all available classes')).toBeInTheDocument()
  })

  it('does not render a subtitle paragraph when subtitle is omitted', () => {
    const { container } = render(<SectionHeading title="No Sub" />)
    expect(container.querySelector('p')).toBeNull()
  })
})
