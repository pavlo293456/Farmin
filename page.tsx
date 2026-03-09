'use client'

import { type Location, TYPE_LABELS, TYPE_COLORS } from '@/data/locations'

interface PopupCardProps {
  location: Location
  onClose: () => void
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
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1"
                style={{ background: `${color}18`, color }}
              >
                {TYPE_LABELS[location.type]}
              </span>
              <h2 className="font-display font-semibold text-gray-900 text-lg leading-tight">
                {location.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">
            {location.description}
          </p>
        </div>

        {/* Products */}
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {location.products.map((p) => (
              <span
                key={p}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <svg className="flex-shrink-0" width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span className="truncate">{location.address}</span>
          </div>

          {location.website && (
            <a
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors text-white"
              style={{ background: color }}
            >
              Visit →
            </a>
          )}
        </div>

        {/* Hours if available */}
        {location.hours && (
          <div className="px-4 pb-3 flex items-start gap-1.5 text-xs text-gray-500">
            <svg className="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
            </svg>
            <span>{location.hours}</span>
          </div>
        )}
      </div>
    </div>
  )
}
