'use client'

import { useEffect, useRef, useState } from 'react'
import { LOCATIONS, TYPE_COLORS, type Location } from '@/data/locations'
import PopupCard from './PopupCard'

interface MapProps {
  filteredIds: Set<string> | null
}

const TYPE_EMOJI: Record<string, string> = {
  market:     '🏪',
  farm:       '🌾',
  store:      '🌿',
  upick:      '🍓',
  restaurant: '🍽️',
  brewery:    '🍺',
  kombucha:   '🧃',
}

export default function Map({ filteredIds }: MapProps) {
  const mapRef       = useRef<HTMLDivElement>(null)
  const mapInstance  = useRef<any>(null)
  const markersRef   = useRef<{ marker: any; id: string }[]>([])
  const [selected, setSelected] = useState<Location | null>(null)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstance.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [53.5461, -113.4938],
        zoom: 11,
        zoomControl: false,
      })
      mapInstance.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'topright' }).addTo(map)

      LOCATIONS.forEach((loc) => {
        const color = TYPE_COLORS[loc.type]
        const emoji = TYPE_EMOJI[loc.type] || '📍'

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:38px;height:38px;
            background:${color};
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2.5px solid white;
            box-shadow:0 3px 14px rgba(0,0,0,0.30);
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;
            transition:transform 0.15s ease, box-shadow 0.15s ease;
          ">
            <span style="transform:rotate(45deg);font-size:16px;line-height:1;">${emoji}</span>
          </div>`,
          iconSize:    [38, 38],
          iconAnchor:  [19, 38],
          popupAnchor: [0, -40],
        })

        const marker = L.marker([loc.lat, loc.lng], { icon })
        marker.on('click', () => setSelected(loc))
        marker.addTo(map)
        markersRef.current.push({ marker, id: loc.id })
      })
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markersRef.current  = []
      }
    }
  }, [mounted])

  useEffect(() => {
    if (!mapInstance.current) return
    markersRef.current.forEach(({ marker, id }) => {
      if (!filteredIds || filteredIds.has(id)) {
        marker.addTo(mapInstance.current)
      } else {
        marker.remove()
      }
    })
    // Close popup if selected pin was filtered out
    if (selected && filteredIds && !filteredIds.has(selected.id)) {
      setSelected(null)
    }
  }, [filteredIds, selected])

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center bg-farm-cream">
      <div className="text-center">
        <div className="text-4xl mb-3">🌾</div>
        <p className="font-display text-farm-green text-lg animate-pulse">Loading map…</p>
      </div>
    </div>
  )

  return (
    <div className="relative w-full h-full">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
      {selected && <PopupCard location={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
