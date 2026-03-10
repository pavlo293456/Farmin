'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import FilterBar from '@/components/FilterBar'
import ModeAnimation, { type AppMode } from '@/components/ModeAnimation'
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

const MODES: { id: AppMode; label: string; emoji: string; color: string; bg: string; types: string[] }[] = [
  {
    id: 'farms',    label: 'Farms',    emoji: '🥕',
    color: '#2d6a4f', bg: 'rgba(45,106,79,0.08)',
    types: ['farm', 'market', 'upick', 'store', 'restaurant'],
  },
  {
    id: 'kombucha', label: 'Kombucha', emoji: '🧃',
    color: '#0891b2', bg: 'rgba(8,145,178,0.08)',
    types: ['kombucha'],
  },
  {
    id: 'beer',     label: 'Craft Beer', emoji: '🍺',
    color: '#d97706', bg: 'rgba(217,119,6,0.08)',
    types: ['brewery'],
  },
]

const MAP_FILTERS: Record<string, string> = {
  farms:    'none',
  kombucha: 'hue-rotate(160deg) saturate(1.1) brightness(1.02)',
  beer:     'sepia(0.3) saturate(1.3) brightness(0.97)',
}

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<AppMode>('farms')
  const [pendingMode, setPendingMode] = useState<AppMode | null>(null)
  const [filteredIds, setFilteredIds] = useState<Set<string> | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  const count = filteredIds ? filteredIds.size : LOCATIONS.length

  const handleModeClick = (mode: AppMode) => {
    if (mode === activeMode) return
    setPendingMode(mode)
    setShowAnimation(true)
  }

  const handleAnimationComplete = useCallback(() => {
    if (!pendingMode) return
    setActiveMode(pendingMode)
    // Auto-filter by mode type
    const modeConfig = MODES.find(m => m.id === pendingMode)
    if (modeConfig && pendingMode !== 'farms') {
      const ids = new Set(
        LOCATIONS.filter(l => modeConfig.types.includes(l.type)).map(l => l.id)
      )
      setFilteredIds(ids)
    } else {
      setFilteredIds(null)
    }
    setPendingMode(null)
    setShowAnimation(false)
  }, [pendingMode])

  const currentMode = MODES.find(m => m.id === activeMode)!

  return (
    <main className="relative w-screen h-screen overflow-hidden">

      {/* Map with CSS filter for theme */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ filter: MAP_FILTERS[activeMode] }}
      >
        <Map filteredIds={filteredIds} />
      </div>

      {/* Mode animation overlay */}
      {showAnimation && pendingMode && (
        <ModeAnimation mode={pendingMode} onComplete={handleAnimationComplete} />
      )}

      {/* Top nav */}
      <header className="absolute top-0 left-0 right-0 z-[999] px-4 pt-4 pb-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between max-w-7xl mx-auto gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-card px-4 py-2.5 flex-shrink-0">
            <span className="text-xl">🌾</span>
            <div>
              <div className="font-display font-bold text-farm-green text-base leading-tight">FarmSearch</div>
              <div className="text-xs text-gray-400 leading-tight">Edmonton, AB</div>
            </div>
          </div>

          {/* Mode buttons — centre */}
          <div className="flex items-center gap-2">
            {MODES.map((m) => {
              const isActive = activeMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeClick(m.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-card border"
                  style={{
                    background: isActive ? m.color : 'white',
                    color: isActive ? 'white' : m.color,
                    borderColor: isActive ? m.color : 'rgba(0,0,0,0.08)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isActive ? `0 4px 20px ${m.color}50` : undefined,
                  }}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              )
            })}
          </div>

          {/* Count badge */}
          <div className="bg-white rounded-2xl shadow-card px-4 py-2.5 text-sm font-medium text-gray-700 flex-shrink-0">
            <span className="font-bold" style={{ color: currentMode.color }}>{count}</span>
            <span className="text-gray-500"> spots</span>
          </div>
        </div>
      </header>

      {/* Filter bar — only show in farms mode */}
      {activeMode === 'farms' && (
        <div className="absolute top-20 left-0 right-0 z-[999]">
          <FilterBar onFilter={setFilteredIds} />
        </div>
      )}

      {/* Mode indicator pill */}
      {activeMode !== 'farms' && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-[999] px-4 py-1.5 rounded-full text-white text-xs font-semibold shadow-card"
          style={{ background: currentMode.color }}
        >
          {currentMode.emoji} {currentMode.label} Mode — {count} locations
          <button
            className="ml-2 opacity-70 hover:opacity-100"
            onClick={() => handleModeClick('farms')}
          >✕</button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[999] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-card px-3 py-2 flex flex-col gap-1">
          {activeMode === 'farms' && [
            { color: '#2d6a4f', emoji: '🏪', label: 'Market' },
            { color: '#f4a261', emoji: '🌾', label: 'Farm' },
            { color: '#e63946', emoji: '🍓', label: 'U-Pick' },
            { color: '#7c3aed', emoji: '🍽️', label: 'Restaurant' },
            { color: '#6b4226', emoji: '🌿', label: 'Store' },
          ].map(({ color, emoji, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
              <span>{emoji} {label}</span>
            </div>
          ))}
          {activeMode === 'kombucha' && (
            <div className="flex items-center gap-2 text-xs text-cyan-700">
              <span className="w-3 h-3 rounded-full flex-shrink-0 bg-cyan-500" />
              <span>🧃 Kombucha</span>
            </div>
          )}
          {activeMode === 'beer' && (
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <span className="w-3 h-3 rounded-full flex-shrink-0 bg-amber-500" />
              <span>🍺 Craft Brewery</span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
