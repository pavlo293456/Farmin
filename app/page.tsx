'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import FilterBar from '@/components/FilterBar'
import { LOCATIONS } from '@/data/locations'

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-farm-cream">
      <div className="text-center">
        <div className="text-4xl mb-3">🌾</div>
        <p className="font-display text-farm-green text-lg animate-pulse">Loading map…</p>
      </div>
    </div>
  ),
})

export default function HomePage() {
  const [filteredIds, setFilteredIds] = useState<Set<string> | null>(null)

  const count = filteredIds ? filteredIds.size : LOCATIONS.length

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Map filteredIds={filteredIds} />

      <header className="absolute top-0 left-0 right-0 z-[999] px-4 pt-4 pb-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-card px-4 py-2.5">
            <span className="text-xl">🌾</span>
            <div>
              <div className="font-display font-bold text-farm-green text-base leading-tight">FarmSearch</div>
              <div className="text-xs text-gray-400 leading-tight">Edmonton, AB</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card px-4 py-2.5 text-sm font-medium text-gray-700">
            <span className="text-farm-green font-bold">{count}</span> locations
          </div>
        </div>
      </header>

      <div className="absolute top-20 left-0 right-0 z-[999]">
        <FilterBar onFilter={setFilteredIds} />
      </div>
    </main>
  )
}
