'use client'

import { useState } from 'react'
import { PRODUCT_CATEGORIES, LOCATIONS } from '@/data/locations'
import clsx from 'clsx'

interface FilterBarProps {
  onFilter: (ids: Set<string> | null) => void
}

const TYPE_FILTERS = [
  { id: 'all', label: 'All', emoji: '📍' },
  { id: 'market', label: 'Markets', emoji: '🏪' },
  { id: 'farm', label: 'Farms', emoji: '🌾' },
  { id: 'store', label: 'Stores', emoji: '🌿' },
]

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [activeType, setActiveType] = useState('all')
  const [activeProducts, setActiveProducts] = useState<Set<string>>(new Set())

  const applyFilters = (type: string, products: Set<string>) => {
    const filtered = LOCATIONS.filter((loc) => {
      const typeMatch = type === 'all' || loc.type === type
      const productMatch = products.size === 0 || [...products].every((p) => loc.products.includes(p))
      return typeMatch && productMatch
    })
    onFilter(filtered.length === LOCATIONS.length ? null : new Set(filtered.map((l) => l.id)))
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto flex gap-2 justify-center mb-2">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveType(t.id)
              applyFilters(t.id, activeProducts)
            }}
            className={clsx('px-3 py-1.5 rounded-full text-sm border', activeType === t.id ? 'bg-farm-green text-white' : 'bg-white')}
          >
            {t.emoji} {t.label}
          </button>
        ))}
        {PRODUCT_CATEGORIES.slice(0, 2).map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              const next = new Set(activeProducts)
              next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id)
              setActiveProducts(next)
              applyFilters(activeType, next)
            }}
            className="px-2 py-1 rounded-full text-xs border bg-white"
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
