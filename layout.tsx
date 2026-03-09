'use client'

import { useEffect, useRef, useState } from 'react'
import { LOCATIONS, TYPE_COLORS, TYPE_LABELS, type Location } from '@/data/locations'
import PopupCard from './PopupCard'

interface MapProps {
  filteredIds: Set<string> | null
}

export default function Map({ filteredIds }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selected, setSelected] = useState<Location | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return

    // Dynamically import Leaflet (SSR safe)
    import('leaflet').then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [53.5461, -113.4938],
        zoom: 11,
        zoomControl: false,
      })

      mapInstanceRef.current = map

      // Clean tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      // Custom zoom control (top right)
      L.control.zoom({ position: 'topright' }).addTo(map)

      // Add markers
      LOCATIONS.forEach((loc) => {
        const color = TYPE_COLORS[loc.type]

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width:36px; height:36px;
              background:${color};
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:2.5px solid white;
              box-shadow:0 3px 12px rgba(0,0,0,0.28);
              display:flex; align-items:center; justify-content:center;
              cursor:pointer;
              transition:transform 0.15s ease;
            ">
              <span style="transform:rotate(45deg); font-size:15px; line-height:1;">
                ${loc.type === 'market' ? '🏪' : loc.type === 'farm' ? '🌾' : loc.type === 'store' ? '🌿' : '📦'}
              </span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        })

        const marker = L.marker([loc.lat, loc.lng], { icon })
        marker.on('click', () => setSelected(loc))
        marker.addTo(map)
        markersRef.current.push({ marker, id: loc.id })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
      }
    }
  }, [mounted])

  // Show/hide markers based on filter
  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then((L) => {
      markersRef.current.forEach(({ marker, id }) => {
        const loc = LOCATIONS.find(l => l.id === id)
        if (!loc) return
        if (!filteredIds || filteredIds.has(id)) {
          marker.addTo(mapInstanceRef.current)
        } else {
          marker.remove()
        }
      })
    })
  }, [filteredIds])

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center bg-farm-cream">
      <div className="text-farm-green font-display text-lg animate-pulse">Loading map…</div>
    </div>
  )

  return (
    <div className="relative w-full h-full">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full" />

      {/* Popup card overlay */}
      {selected && (
        <PopupCard
          location={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
