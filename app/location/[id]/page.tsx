import { LOCATIONS, TYPE_LABELS, TYPE_COLORS } from '@/data/locations'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ id: loc.id }))
}

export async function generateMetadata({ params }: Props) {
  const loc = LOCATIONS.find((l) => l.id === params.id)
  if (!loc) return { title: 'Not Found' }
  return {
    title: `${loc.name} — FarmSearch Edmonton`,
    description: loc.description,
  }
}

const TAG_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  organic:     { label: 'Certified Organic',    emoji: '🌿', color: 'bg-green-100 text-green-800' },
  csa:         { label: 'CSA / Farm Box',        emoji: '📦', color: 'bg-blue-100 text-blue-800' },
  delivery:    { label: 'Delivery Available',    emoji: '🚚', color: 'bg-purple-100 text-purple-800' },
  upick:       { label: 'U-Pick',                emoji: '🍓', color: 'bg-red-100 text-red-800' },
  'year-round':{ label: 'Open Year-Round',       emoji: '📅', color: 'bg-yellow-100 text-yellow-800' },
  seasonal:    { label: 'Seasonal',              emoji: '🌻', color: 'bg-orange-100 text-orange-800' },
  greenhouse:  { label: 'Greenhouse',            emoji: '🏡', color: 'bg-teal-100 text-teal-800' },
  hutterite:   { label: 'Hutterite Colony',      emoji: '🐄', color: 'bg-stone-100 text-stone-800' },
  outdoor:     { label: 'Outdoor Market',        emoji: '☀️', color: 'bg-amber-100 text-amber-800' },
  indoor:      { label: 'Indoor Market',         emoji: '🏛️', color: 'bg-slate-100 text-slate-800' },
}

const PRODUCT_EMOJI: Record<string, string> = {
  vegetables: '🥦',
  fruit:      '🍎',
  eggs:       '🥚',
  dairy:      '🥛',
  meat:       '🥩',
  honey:      '🍯',
  organic:    '🌿',
}

export default function LocationPage({ params }: Props) {
  const loc = LOCATIONS.find((l) => l.id === params.id)
  if (!loc) notFound()

  const color = TYPE_COLORS[loc.type]
  const typeLabel = TYPE_LABELS[loc.type]

  // Related locations — same type, exclude self, max 3
  const related = LOCATIONS
    .filter((l) => l.type === loc.type && l.id !== loc.id)
    .slice(0, 3)

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`

  return (
    <div className="min-h-screen bg-farm-cream">

      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-farm-green transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"/>
            </svg>
            Back to Map
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400 truncate">{loc.name}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Hero card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6"
          style={{ borderTop: `5px solid ${color}` }}>

          {/* Photo placeholder */}
          <div
            className="w-full h-48 flex items-center justify-center text-6xl"
            style={{ background: `${color}15` }}
          >
            {loc.type === 'market' ? '🏪' : loc.type === 'farm' ? '🌾' : loc.type === 'upick' ? '🍓' : '🌿'}
          </div>

          <div className="p-6">
            {/* Type badge */}
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide"
              style={{ background: `${color}18`, color }}
            >
              {typeLabel}
            </span>

            <h1 className="font-display font-bold text-2xl text-gray-900 mb-2 leading-tight">
              {loc.name}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-4">
              {loc.description}
            </p>

            {/* Tags */}
            {loc.tags && loc.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {loc.tags.map((tag) => {
                  const t = TAG_LABELS[tag]
                  if (!t) return null
                  return (
                    <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.color}`}>
                      {t.emoji} {t.label}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Products */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Products Available
              </p>
              <div className="flex flex-wrap gap-2">
                {loc.products.map((p) => (
                  <span
                    key={p}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium"
                    style={{ background: `${color}15`, color }}
                  >
                    <span>{PRODUCT_EMOJI[p] || '•'}</span>
                    <span className="capitalize">{p}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">

          {/* Hours */}
          {loc.hours && (
            <div className="bg-white rounded-xl shadow-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🕐</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hours</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{loc.hours}</p>
            </div>
          )}

          {/* Address */}
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📍</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">{loc.address}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-farm-green hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>

          {/* Notes / CSA info */}
          {loc.notes && (
            <div className="bg-white rounded-xl shadow-card p-5 sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📋</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Details & Notes</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{loc.notes}</p>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {loc.website && (
            <a
              href={loc.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm shadow-card hover:shadow-hover transition-shadow"
              style={{ background: color }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
              Visit Website
            </a>
          )}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-card hover:shadow-hover transition-shadow border border-gray-200 bg-white text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            Get Directions
          </a>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-card hover:shadow-hover transition-shadow border border-gray-200 bg-white text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"/>
            </svg>
            Back to Map
          </Link>
        </div>

        {/* Related locations */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-lg text-gray-800 mb-4">
              More {typeLabel}s Nearby
            </h2>
            <div className="grid gap-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/location/${r.id}`}
                  className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4 hover:shadow-hover transition-shadow group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${TYPE_COLORS[r.type]}20` }}
                  >
                    {r.type === 'market' ? '🏪' : r.type === 'farm' ? '🌾' : r.type === 'upick' ? '🍓' : '🌿'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-farm-green transition-colors truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{r.address}</p>
                  </div>
                  <svg className="text-gray-300 flex-shrink-0 group-hover:text-farm-green transition-colors" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            🌾 <span className="font-semibold text-farm-green">FarmSearch Edmonton</span> — Discover local farm food near you
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Information may change — always confirm directly with the farm or market.
          </p>
        </div>
      </footer>

    </div>
  )
}
