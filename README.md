# Farmin
farmin, eatin, sellin
[README.md](https://github.com/user-attachments/files/25848412/README.md)
# 🌾 FarmSearch Edmonton

An MVP web app to discover local farm food, farmers markets, and organic stores near Edmonton, Alberta.

## Features
- 🗺️ Interactive map with 31 real Edmonton-area locations
- 📍 Colour-coded pins: Markets (green), Farms (orange), Stores (brown)
- 🔍 Filter by location type and product category
- 🃏 Tap any pin for a popup card with details, hours, and website link
- 📱 Mobile-friendly, responsive layout

## Tech Stack
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **TailwindCSS**
- **Leaflet.js** (no API key required)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open in browser
http://localhost:3000
```

No API keys. No accounts. Just clone and run.

## Project Structure

```
src/
  app/
    page.tsx          # Homepage (full-screen map)
    layout.tsx        # Root layout
    globals.css       # Global styles + Tailwind
  components/
    Map.tsx           # Leaflet map with dynamic import
    FilterBar.tsx     # Type + product category filters
    PopupCard.tsx     # Location detail popup
  data/
    locations.ts      # All 31 Edmonton locations (seed data)
```

## Adding New Locations

Edit `src/data/locations.ts` and add an entry to the `LOCATIONS` array:

```ts
{
  id: 'unique-id',
  name: 'Farm Name',
  type: 'farm',           // 'market' | 'farm' | 'store' | 'csa'
  address: '123 Main St, Edmonton, AB',
  lat: 53.5461,           // Get from Google Maps
  lng: -113.4938,
  description: 'Short description.',
  products: ['vegetables', 'eggs'],
  hours: 'Sat 9AM–2PM',
  website: 'https://example.com',
}
```

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — no env vars needed
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for auto-deployments.

## Data Sources
All market and farm data is sourced from publicly available Edmonton-area listings.
Coordinates are approximate and should be verified before production use.

---
Built as an MVP concept for local food discovery in Edmonton.
