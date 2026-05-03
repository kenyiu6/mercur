/**
 * Carousell adapter – re-uses logic from tools/carousell-scraper.
 * Normalises results into the shared Listing shape.
 */
import type { Adapter, Listing, ObserveOptions } from '../types'

export const carousellAdapter: Adapter = {
  name: 'carousell',

  async fetch(
    query: string,
    options: Omit<ObserveOptions, 'platforms'>,
  ): Promise<Listing[]> {
    const region = options.region ?? 'HK'
    const baseUrl = `https://www.carousell.com.hk/search/${encodeURIComponent(query)}`

    // TODO: replace with actual HTTP fetch + HTML/JSON parse
    // Stub returns empty array until implementation is wired in.
    console.log(`[carousell] would fetch: ${baseUrl} (region=${region})`)
    return []
  },
}
