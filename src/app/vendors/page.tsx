'use client'

import { useEffect, useState } from 'react'
import { supabase, type Vendor } from '@/lib/supabase'
import Link from 'next/link'

export default function VendorsPage() {
  const [vendors,  setVendors]  = useState<Vendor[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [product,  setProduct]  = useState('')

  useEffect(() => {
    supabase
      .from('vendors')
      .select('*')
      .eq('is_published', true)
      .order('business_name')
      .then(({ data }) => {
        setVendors(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = vendors.filter(v => {
    const matchSearch  = !search  || v.business_name.toLowerCase().includes(search.toLowerCase())
    const matchProduct = !product || v.products.some(p => p.toLowerCase().includes(product.toLowerCase()))
    return matchSearch && matchProduct
  })

  const allProducts = [...new Set(vendors.flatMap(v => v.products))].sort()

  return (
    <div className="min-h-screen bg-farm-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🌾</span>
            <span className="font-display font-bold text-farm-green">FarmSearch</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm font-semibold text-farm-green hover:underline">
              List your products →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Market Vendors</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Browse local vendors selling at Edmonton farmers markets. See what they're bringing this week.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search vendors…"
            className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-farm-green"
          />
          <select
            value={product}
            onChange={e => setProduct(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-farm-green"
          >
            <option value="">All products</option>
            {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">Loading vendors…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌾</div>
            <p className="text-gray-500 font-medium">No vendors found</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to list your products!</p>
            <Link href="/auth" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-farm-green text-white text-sm font-semibold">
              Create vendor profile
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(vendor => (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.id}`}
                className="bg-white rounded-2xl shadow-card hover:shadow-hover transition-shadow overflow-hidden group"
              >
                {/* Photo */}
                <div
                  className="h-32 flex items-center justify-center text-4xl"
                  style={{
                    background: vendor.photo_url ? undefined : 'linear-gradient(135deg, #f8f4ec, #e8f5ee)',
                    backgroundImage: vendor.photo_url ? `url(${vendor.photo_url})` : undefined,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }}
                >
                  {!vendor.photo_url && '🌾'}
                </div>

                <div className="p-5">
                  <h2 className="font-display font-bold text-gray-900 group-hover:text-farm-green transition-colors">
                    {vendor.business_name}
                  </h2>

                  {vendor.this_week && (
                    <div className="mt-2 bg-amber-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-bold text-amber-700 mb-0.5">📣 This week</p>
                      <p className="text-xs text-amber-800 line-clamp-2">{vendor.this_week}</p>
                    </div>
                  )}

                  {vendor.products.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {vendor.products.slice(0, 4).map(p => (
                        <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{p}</span>
                      ))}
                      {vendor.products.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">+{vendor.products.length - 4}</span>
                      )}
                    </div>
                  )}

                  {vendor.markets.length > 0 && (
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                      <span>📍</span>
                      <span className="line-clamp-1">{vendor.markets.map(m => m.market_name).join(', ')}</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-white rounded-2xl shadow-card p-8 text-center" style={{ borderTop: '4px solid #2d6a4f' }}>
          <div className="text-3xl mb-3">🌱</div>
          <h2 className="font-display font-bold text-xl text-gray-900 mb-2">Are you a vendor?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
            Create a free profile and let customers know what you're bringing to market each week.
          </p>
          <Link
            href="/auth"
            className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-card hover:shadow-hover transition-shadow"
            style={{ background: '#2d6a4f' }}
          >
            List your products — it's free
          </Link>
        </div>
      </main>
    </div>
  )
}
