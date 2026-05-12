import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCard from './StatCard'
import { Activity } from 'lucide-react'
import React from 'react'

describe('StatCard', () => {
  it('renders label and value correctly', () => {
    render(
      <StatCard
        icon={Activity}
        label="Total Records"
        value="1,234"
        sub="Updated today"
        color="blue"
      />
    )

    expect(screen.getByText('Total Records')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('Updated today')).toBeInTheDocument()
  })

  it('handles missing sub-text', () => {
    render(
      <StatCard
        icon={Activity}
        label="Total Records"
        value="1,234"
        color="green"
      />
    )

    expect(screen.getByText('Total Records')).toBeInTheDocument()
    expect(screen.queryByText('Updated today')).not.toBeInTheDocument()
  })
})
