'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import FilterBar from '@/components/FilterBar'
import { LOCATIONS } from '@/data/locations'

// Dynamically import Map to avoid SSR issues with Leaflet
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
      {/* Map fills screen */}
      <Map filteredIds={filteredIds} />

      {/* Top nav bar */}
      <header className="absolute top-0 left-0 right-0 z-[999] px-4 pt-4 pb-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-card px-4 py-2.5">
            <span className="text-xl">🌾</span>
            <div>
              <div className="font-display font-bold text-farm-green text-base leading-tight">FarmSearch</div>
              <div className="text-xs text-gray-400 leading-tight">Edmonton, AB</div>
            </div>
          </div>

          {/* Location count badge */}
          <div className="bg-white rounded-2xl shadow-card px-4 py-2.5 text-sm font-medium text-gray-700">
            <span className="text-farm-green font-bold">{count}</span> locations
          </div>
        </div>
      </header>

      {/* Filter bar — sits below header */}
      <div className="absolute top-20 left-0 right-0 z-[999]">
        <FilterBar onFilter={setFilteredIds} />
      </div>

      {/* Bottom legend */}
      <div className="absolute bottom-4 left-4 z-[999] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-card px-3 py-2 flex flex-col gap-1">
          {[
            { color: '#2d6a4f', emoji: '🏪', label: 'Market' },
            { color: '#f4a261', emoji: '🌾', label: 'Farm' },
            { color: '#6b4226', emoji: '🌿', label: 'Store' },
          ].map(({ color, emoji, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span>{emoji} {label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
