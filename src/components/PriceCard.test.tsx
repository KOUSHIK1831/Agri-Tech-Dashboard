import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PriceCard from './PriceCard'
import React from 'react'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}))

describe('PriceCard', () => {
  const mockRecord = {
    commodity: 'Paddy',
    variety: 'Common',
    modal_price: '1800',
    min_price: '1700',
    max_price: '1900',
    state: 'Telangana',
    district: 'Warangal',
    market: 'Warangal',
    arrival_date: '12/05/2026',
  }

  it('renders record details correctly', () => {
    render(<PriceCard record={mockRecord} />)

    expect(screen.getByText('Paddy')).toBeInTheDocument()
    expect(screen.getByText('Common')).toBeInTheDocument()
    expect(screen.getByText('₹1,800')).toBeInTheDocument()
    expect(screen.getByText('Telangana')).toBeInTheDocument()
    // Use getAllByText because Warangal appears twice (district and market)
    expect(screen.getAllByText('Warangal')).toHaveLength(2)
  })

  it('shows trend icons based on price', () => {
    const highPriceRecord = { ...mockRecord, modal_price: '6000' }
    const { rerender } = render(<PriceCard record={highPriceRecord} />)

    expect(document.querySelector('.text-red-500')).toBeInTheDocument()

    const lowPriceRecord = { ...mockRecord, modal_price: '1000' }
    rerender(<PriceCard record={lowPriceRecord} />)
    expect(document.querySelector('.text-blue-500')).toBeInTheDocument()
  })
})
