export type LocationType = 'market' | 'farm' | 'store'

export interface Location {
  id: string
  name: string
  type: LocationType
  lat: number
  lng: number
  address: string
  description: string
  products: string[]
  website?: string
  hours?: string
}

export const TYPE_LABELS: Record<LocationType, string> = {
  market: 'Market',
  farm: 'Farm',
  store: 'Store',
}

export const TYPE_COLORS: Record<LocationType, string> = {
  market: '#2d6a4f',
  farm: '#f4a261',
  store: '#6b4226',
}

export const PRODUCT_CATEGORIES = [
  { id: 'vegetables', label: 'Vegetables', emoji: '🥕' },
  { id: 'fruit', label: 'Fruit', emoji: '🍎' },
  { id: 'eggs', label: 'Eggs', emoji: '🥚' },
]

export const LOCATIONS: Location[] = [
  {
    id: 'bountiful',
    name: 'Bountiful Farmers Market',
    type: 'market',
    lat: 53.489,
    lng: -113.492,
    address: '3696 97 St NW, Edmonton',
    description: 'Indoor market with local vendors.',
    products: ['vegetables', 'fruit', 'eggs'],
  },
  {
    id: 'prairie',
    name: 'Prairie Urban Farm',
    type: 'farm',
    lat: 53.57,
    lng: -113.6,
    address: 'West Edmonton',
    description: 'Small regenerative farm.',
    products: ['vegetables', 'eggs'],
  },
]
