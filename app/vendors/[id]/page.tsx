'use client'

import { useEffect, useState } from 'react'
import { supabase, type Vendor } from '@/lib/supabase'
import Link from 'next/link'

export default function VendorProfilePage({ params }: { params: { id: string } }) {
  const [vendor,  setVendor]  = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('vendors')
      .select('*')
      .eq('id', params.id)
      .eq('is_published', true)
      .single()
      .then(({ data }: { data: Vendor | null }) => {
        setVendor(data)
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-farm-cream flex items-center justify-center">
      <p className="text-farm-green font-display animate-pulse">Loading vendor…</p>
    </div>
  )

  if (!vendor) return (
    <div className="min-h-screen bg-farm-cream flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🌾</div>
        <h1 className="font-display font-bold text-xl text-gray-900 mb-2">Vendor not found</h1>
        <Link href="/vendors" className="text-farm-green hover:underline text-sm">← Back to vendors</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-farm-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/vendors" className="flex items-center gap-2 text-sm text-gray-500 hover:text-farm-green transition-colors">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"/>
            </svg>
            All Vendors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400 truncate">{vendor.business_name}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6" style={{ borderTop: '5px solid #2d6a4f' }}>
          {/* Photo */}
          <div
            className="w-full h-52 flex items-center justify-center text-6xl"
            style={{
              background: vendor.photo_url ? undefined : 'linear-gradient(135deg, #f8f4ec, #e8f5ee)',
              backgroundImage: vendor.photo_url ? `url(${vendor.photo_url})` : undefined,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          >
            {!vendor.photo_url && '🌾'}
          </div>

          <div className="p-6">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide bg-green-100 text-green-700">
              Market Vendor
            </span>
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">{vendor.business_name}</h1>
            {vendor.bio && <p className="text-gray-600 leading-relaxed text-sm">{vendor.bio}</p>}

            {/* Links */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {vendor.instagram && (
                <a
                  href={`https://instagram.com/${vendor.instagram}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                >
                  📸 @{vendor.instagram}
                </a>
              )}
              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  🔗 Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* This week */}
        {vendor.this_week && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">📣 This Week I'm Bringing</p>
            <p className="text-amber-900 text-sm leading-relaxed">{vendor.this_week}</p>
          </div>
        )}

        {/* Info grid */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {/* Products */}
          {vendor.products.length > 0 && (
            <div className="bg-white rounded-xl shadow-card p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">🥕 Products</p>
              <div className="flex flex-wrap gap-1.5">
                {vendor.products.map(p => (
                  <span key={p} className="text-xs bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full capitalize">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Markets */}
          {vendor.markets.length > 0 && (
            <div className="bg-white rounded-xl shadow-card p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">📍 Where to Find Me</p>
              <div className="space-y-2">
                {vendor.markets.map(m => (
                  <div key={m.market_id} className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 font-medium leading-tight">{m.market_name}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">{m.dates}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        {vendor.gallery.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">📸 Gallery</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vendor.gallery.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-full h-32 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center py-4">
          <Link href="/vendors" className="text-sm text-gray-400 hover:text-farm-green transition-colors">
            ← Browse all vendors
          </Link>
        </div>
      </main>
    </div>
  )
}
