'use client'

import Link from 'next/link'
import { type Location, TYPE_LABELS, TYPE_COLORS } from '@/data/locations'

interface PopupCardProps {
  location: Location
  onClose: () => void
}

const PRODUCT_EMOJI: Record<string, string> = {
  vegetables: '🥦', fruit: '🍎', eggs: '🥚',
  dairy: '🥛', meat: '🥩', honey: '🍯', organic: '🌿',
}

export default function PopupCard({ location, onClose }: PopupCardProps) {
  const color = TYPE_COLORS[location.type]

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4 pointer-events-none">
      <div
        className="pointer-events-auto bg-white rounded-2xl shadow-hover overflow-hidden"
        style={{ borderTop: `4px solid ${color}` }}
      >
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span
                className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide"
                style={{ background: `${color}18`, color }}
              >
                {TYPE_LABELS[location.type]}
              </span>
              <h2 className="font-display font-semibold text-gray-900 text-base leading-tight">
                {location.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>

          <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
            {location.description}
          </p>
        </div>

        {/* Products */}
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {location.products.slice(0, 5).map((p) => (
              <span
                key={p}
                className="text-xs px-2 py-0.5 rounded-full capitalize flex items-center gap-1"
                style={{ background: `${color}12`, color }}
              >
                <span>{PRODUCT_EMOJI[p] || '•'}</span>
                <span>{p}</span>
              </span>
            ))}
            {location.products.length > 5 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                +{location.products.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Hours if available */}
        {location.hours && (
          <div className="px-4 pb-2 flex items-start gap-1.5 text-xs text-gray-400">
            <svg className="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
            </svg>
            <span className="line-clamp-1">{location.hours}</span>
          </div>
        )}

        {/* Footer — address + CTA */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
            <svg className="flex-shrink-0" width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span className="truncate">{location.address}</span>
          </div>

          <Link
            href={`/location/${location.id}`}
            className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-90 text-white whitespace-nowrap"
            style={{ background: color }}
          >
            See Profile →
          </Link>
        </div>
      </div>
    </div>
  )
}
