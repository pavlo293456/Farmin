'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase, type Vendor } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LOCATIONS } from '@/data/locations'

const PRODUCT_OPTIONS = [
  '🥦 Vegetables','🍎 Fruit','🥚 Eggs','🥛 Dairy','🥩 Meat',
  '🍯 Honey','🌿 Herbs','🌸 Flowers','🍞 Baked Goods',
  '🥒 Pickles & Preserves','🧃 Kombucha','🍄 Mushrooms',
  '🌱 Microgreens','🫙 Jams','🧀 Cheese','🍖 Charcuterie',
]

const MARKETS = LOCATIONS
  .filter(l => l.type === 'market')
  .map(l => ({ id: l.id, name: l.name }))

const DAYS = ['Every week','1st Saturday','2nd Saturday','3rd Saturday','4th Saturday','Seasonal','By request']

export default function DashboardPage() {
  const router = useRouter()
  const [user,    setUser]    = useState<any>(null)
  const [vendor,  setVendor]  = useState<Partial<Vendor>>({
    business_name: '', bio: '', photo_url: '', products: [],
    this_week: '', markets: [], instagram: '', website: '',
    gallery: [], is_published: false,
  })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [isNew,    setIsNew]    = useState(true)
  const [galleryInput, setGalleryInput] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const { data } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) { setVendor(data); setIsNew(false) }
      setLoading(false)
    }
    load()
  }, [router])

  const save = async () => {
    setSaving(true); setError(null)
    const payload = { ...vendor, user_id: user.id }

    const { error } = isNew
      ? await supabase.from('vendors').insert(payload)
      : await supabase.from('vendors').update(payload).eq('user_id', user.id)

    if (error) setError(error.message)
    else { setSaved(true); setIsNew(false); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  const toggleProduct = (p: string) => {
    const clean = p.replace(/^.{2}/, '').trim() // strip emoji prefix for storage
    const cur = vendor.products || []
    setVendor(v => ({
      ...v,
      products: cur.includes(clean) ? cur.filter(x => x !== clean) : [...cur, clean]
    }))
  }

  const toggleMarket = (market: { id: string; name: string }) => {
    const cur = vendor.markets || []
    const exists = cur.find(m => m.market_id === market.id)
    setVendor(v => ({
      ...v,
      markets: exists
        ? cur.filter(m => m.market_id !== market.id)
        : [...cur, { market_id: market.id, market_name: market.name, dates: 'Every week' }]
    }))
  }

  const updateMarketDates = (marketId: string, dates: string) => {
    setVendor(v => ({
      ...v,
      markets: (v.markets || []).map(m => m.market_id === marketId ? { ...m, dates } : m)
    }))
  }

  const addGalleryUrl = () => {
    if (!galleryInput.trim()) return
    setVendor(v => ({ ...v, gallery: [...(v.gallery || []), galleryInput.trim()] }))
    setGalleryInput('')
  }

  const removeGalleryUrl = (url: string) => {
    setVendor(v => ({ ...v, gallery: (v.gallery || []).filter(g => g !== url) }))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-farm-cream flex items-center justify-center">
      <p className="text-farm-green font-display animate-pulse">Loading your profile…</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-farm-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl">🌾</Link>
            <div>
              <div className="font-display font-bold text-farm-green text-sm">Vendor Dashboard</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {vendor.id && (
              <Link
                href={`/vendors/${vendor.id}`}
                className="text-xs font-semibold text-farm-green hover:underline"
                target="_blank"
              >
                View public profile →
              </Link>
            )}
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Publish banner */}
        <div className={`rounded-2xl p-4 flex items-center justify-between ${vendor.is_published ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div>
            <p className={`text-sm font-semibold ${vendor.is_published ? 'text-green-700' : 'text-amber-700'}`}>
              {vendor.is_published ? '✅ Your profile is live' : '⚠️ Profile not published yet'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {vendor.is_published ? 'Customers can find you on FarmSearch' : 'Save and publish when ready'}
            </p>
          </div>
          <button
            onClick={() => setVendor(v => ({ ...v, is_published: !v.is_published }))}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-colors ${vendor.is_published ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}
          >
            {vendor.is_published ? 'Unpublish' : 'Publish'}
          </button>
        </div>

        {/* Business Info */}
        <Section title="🏪 Business Info">
          <Field label="Business Name *">
            <input
              value={vendor.business_name || ''}
              onChange={e => setVendor(v => ({ ...v, business_name: e.target.value }))}
              placeholder="e.g. Happy Hen Farm"
              className="input"
            />
          </Field>
          <Field label="Bio — tell customers your story">
            <textarea
              value={vendor.bio || ''}
              onChange={e => setVendor(v => ({ ...v, bio: e.target.value }))}
              placeholder="We're a family-run farm in Sturgeon County growing certified organic vegetables since 2015..."
              rows={3}
              className="input resize-none"
            />
          </Field>
          <Field label="Profile Photo URL">
            <input
              value={vendor.photo_url || ''}
              onChange={e => setVendor(v => ({ ...v, photo_url: e.target.value }))}
              placeholder="https://your-image-url.jpg"
              className="input"
            />
            {vendor.photo_url && (
              <img src={vendor.photo_url} alt="" className="mt-2 w-20 h-20 rounded-xl object-cover" />
            )}
          </Field>
        </Section>

        {/* This Week */}
        <Section title="📣 This Week I'm Bringing">
          <Field label="Update this every week — customers will see this first">
            <textarea
              value={vendor.this_week || ''}
              onChange={e => setVendor(v => ({ ...v, this_week: e.target.value }))}
              placeholder="Fresh garlic scapes, rainbow chard, cherry tomatoes, and a limited batch of strawberry jam..."
              rows={3}
              className="input resize-none"
            />
          </Field>
        </Section>

        {/* Products */}
        <Section title="🥕 Products You Sell">
          <div className="flex flex-wrap gap-2">
            {PRODUCT_OPTIONS.map(p => {
              const clean = p.replace(/^.{2}/, '').trim()
              const active = (vendor.products || []).includes(clean)
              return (
                <button
                  key={p}
                  onClick={() => toggleProduct(p)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    active ? 'bg-farm-green text-white border-farm-green' : 'bg-white text-gray-600 border-gray-200 hover:border-farm-green'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Markets */}
        <Section title="📍 Markets You Attend">
          <div className="space-y-3">
            {MARKETS.map(market => {
              const selected = (vendor.markets || []).find(m => m.market_id === market.id)
              return (
                <div key={market.id} className={`rounded-xl border p-3 transition-all ${selected ? 'border-farm-green bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleMarket(market)}
                      className="flex items-center gap-2 text-sm font-medium text-left"
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-farm-green bg-farm-green' : 'border-gray-300'}`}>
                        {selected && <span className="text-white text-xs">✓</span>}
                      </span>
                      {market.name}
                    </button>
                    {selected && (
                      <select
                        value={selected.dates}
                        onChange={e => updateMarketDates(market.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 ml-2"
                      >
                        {DAYS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Links */}
        <Section title="🔗 Links">
          <Field label="Instagram">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">instagram.com/</span>
              <input
                value={vendor.instagram || ''}
                onChange={e => setVendor(v => ({ ...v, instagram: e.target.value }))}
                placeholder="yourbusiness"
                className="input flex-1"
              />
            </div>
          </Field>
          <Field label="Website">
            <input
              value={vendor.website || ''}
              onChange={e => setVendor(v => ({ ...v, website: e.target.value }))}
              placeholder="https://yourfarm.ca"
              className="input"
            />
          </Field>
        </Section>

        {/* Gallery */}
        <Section title="📸 Photo Gallery">
          <p className="text-xs text-gray-400 mb-3">Add image URLs to show your products. Use Instagram, Google Drive, or any image host.</p>
          <div className="flex gap-2 mb-3">
            <input
              value={galleryInput}
              onChange={e => setGalleryInput(e.target.value)}
              placeholder="https://your-photo-url.jpg"
              className="input flex-1"
              onKeyDown={e => e.key === 'Enter' && addGalleryUrl()}
            />
            <button
              onClick={addGalleryUrl}
              className="px-4 py-2 rounded-xl bg-farm-green text-white text-sm font-semibold"
            >Add</button>
          </div>
          {(vendor.gallery || []).length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {(vendor.gallery || []).map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-full h-24 object-cover rounded-xl" />
                  <button
                    onClick={() => removeGalleryUrl(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs items-center justify-center hidden group-hover:flex"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Save */}
        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

        <button
          onClick={save}
          disabled={saving || !vendor.business_name}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 shadow-hover"
          style={{ background: 'linear-gradient(135deg, #2d6a4f, #52b788)' }}
        >
          {saving ? 'Saving…' : saved ? '✅ Saved!' : isNew ? 'Create Profile' : 'Save Changes'}
        </button>

        <div className="h-8" />
      </main>

      <style>{`
        .input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          background: white;
        }
        .input:focus { border-color: #2d6a4f; }
      `}</style>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="font-display font-bold text-gray-900 text-base mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}
