/**
 * Canonical type definitions for market-observer.
 * Import from here; tools/market-observer/types.ts re-exports for compat.
 */

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

/**
 * Output shape written by the classifier CLI.
 *
 * @example
 * // tools/market-observer/snapshots/2026-05-04T00:00:00Z.json
 * {
 *   "meta": {
 *     "query": "Sony WH-1000XM5",
 *     "generatedAt": "2026-05-04T00:00:00.000Z",
 *     "totalListings": 2
 *   },
 *   "listings": [
 *     {
 *       "platform": "carousell",
 *       "id": "12345",
 *       "title": "Sony WH-1000XM5 Black",
 *       "price": 980,
 *       "currency": "HKD",
 *       "url": "https://www.carousell.com.hk/p/12345",
 *       "condition": "Like New",
 *       "location": "Tung Chung",
 *       "listedAt": "2026-05-03T18:00:00.000Z"
 *     }
 *   ]
 * }
 */
export interface ClassifyOutput {
  meta: {
    query: string
    generatedAt: string
    totalListings: number
  }
  listings: Listing[]
}
