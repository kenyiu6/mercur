export interface Listing {
  platform: string
  id: string
  title: string
  price: number
  currency: string
  url: string
  imageUrl?: string
  condition?: string
  location?: string
  listedAt?: string
}

export interface ObserveOptions {
  query: string
  platforms: Platform[]
  region?: string
  maxResults?: number
}

export type Platform = 'carousell' | 'facebook-marketplace' | 'ebay'

export interface Adapter {
  name: Platform
  fetch(query: string, options: Omit<ObserveOptions, 'platforms'>): Promise<Listing[]>
}
