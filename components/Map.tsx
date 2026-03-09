'use client'

import { useEffect, useRef, useState } from 'react'
import { LOCATIONS, TYPE_COLORS, type Location } from '@/data/locations'
import PopupCard from '@/components/PopupCard'

interface MapProps {
  filteredIds: Set<string> | null
}

export default function Map({ filteredIds }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selected, setSelected] = useState<Location | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!, {
        center: [53.5461, -113.4938],
        zoom: 11,
        zoomControl: false,
      })

      mapInstanceRef.current = map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)
      L.control.zoom({ position: 'topright' }).addTo(map)

      LOCATIONS.forEach((loc) => {
        const color = TYPE_COLORS[loc.type]
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:36px;height:36px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid white;display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);">📍</span></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })

        const marker = L.marker([loc.lat, loc.lng], { icon })
        marker.on('click', () => setSelected(loc))
        marker.addTo(map)
        markersRef.current.push({ marker, id: loc.id })
      })
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }
  }, [mounted])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    markersRef.current.forEach(({ marker, id }) => {
      if (!filteredIds || filteredIds.has(id)) marker.addTo(mapInstanceRef.current)
      else marker.remove()
    })
  }, [filteredIds])

  if (!mounted) return <div className="w-full h-full bg-farm-cream" />

  return (
    <div className="relative w-full h-full">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
      {selected && <PopupCard location={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
