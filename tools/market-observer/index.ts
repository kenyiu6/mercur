import type { Adapter, Listing, ObserveOptions } from './types'
import { carousellAdapter } from './adapters/carousell'
import { facebookMarketplaceAdapter } from './adapters/facebook-marketplace'
import { ebayAdapter } from './adapters/ebay'

const ADAPTERS: Record<string, Adapter> = {
  carousell: carousellAdapter,
  'facebook-marketplace': facebookMarketplaceAdapter,
  ebay: ebayAdapter,
}

export async function observe(options: ObserveOptions): Promise<Listing[]> {
  const { query, platforms, ...rest } = options
  const selected = platforms.map((p) => {
    const adapter = ADAPTERS[p]
    if (!adapter) throw new Error(`Unknown platform: ${p}`)
    return adapter
  })

  const results = await Promise.allSettled(
    selected.map((adapter) => adapter.fetch(query, rest)),
  )

  const listings: Listing[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      listings.push(...result.value)
    } else {
      console.error('[market-observer] adapter error:', result.reason)
    }
  }

  return listings
}
