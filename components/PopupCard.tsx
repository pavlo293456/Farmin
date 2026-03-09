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
      <div className="pointer-events-auto bg-white rounded-2xl shadow-hover overflow-hidden" style={{ borderTop: `4px solid ${color}` }}>
        <div className="p-4 pb-2">
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1" style={{ background: `${color}18`, color }}>
            {TYPE_LABELS[location.type]}
          </span>
          <h2 className="font-display font-semibold text-gray-900 text-lg leading-tight">{location.name}</h2>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{location.description}</p>
          <button onClick={onClose} className="text-xs text-farm-green mt-2">Close</button>
        </div>
      </div>
    </div>
  )
}
