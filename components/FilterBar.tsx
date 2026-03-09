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
      const productMatch =
        products.size === 0 || [...products].some((product) => loc.products.includes(product))
      return typeMatch && productMatch
    })

    onFilter(filtered.length === LOCATIONS.length ? null : new Set(filtered.map((loc) => loc.id)))
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-3xl px-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-wrap gap-2 justify-center mb-2">
        {TYPE_FILTERS.map((typeFilter) => (
          <button
            key={typeFilter.id}
            onClick={() => {
              setActiveType(typeFilter.id)
              applyFilters(typeFilter.id, activeProducts)
            }}
            className={clsx(
              'px-3 py-1.5 rounded-full text-sm border bg-white/95 backdrop-blur',
              activeType === typeFilter.id && 'bg-farm-green text-white border-farm-green',
            )}
          >
            {typeFilter.emoji} {typeFilter.label}
          </button>
        ))}
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              const nextProducts = new Set(activeProducts)
              nextProducts.has(category.id)
                ? nextProducts.delete(category.id)
                : nextProducts.add(category.id)
              setActiveProducts(nextProducts)
              applyFilters(activeType, nextProducts)
            }}
            className={clsx(
              'px-2 py-1 rounded-full text-xs border bg-white/95 backdrop-blur',
              activeProducts.has(category.id) &&
                'bg-farm-light/30 border-farm-green text-farm-green',
            )}
          >
            {category.emoji} {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
