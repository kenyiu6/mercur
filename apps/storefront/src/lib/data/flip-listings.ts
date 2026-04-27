/**
 * 從 Mercur backend 讀取 AI 推薦炒賣品。
 * 對應 GET /store/flip-listings (公開 endpoint)。
 */

export interface FlipListing {
  id: string
  source: string
  source_url: string | null
  title: string
  description: string | null
  category: string
  market_price_hkd: number | null
  suggested_buy_hkd: number | null
  suggested_sell_hkd: number | null
  estimated_margin_pct: number | null
  popularity_score: number
  demand_signal: string | null
  thumbnail_url: string | null
}

export async function listFlipListings(opts?: {
  limit?: number
  category?: string
  q?: string
}): Promise<{ flip_listings: FlipListing[]; count: number }> {
  const backend =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    'http://localhost:9000'

  const url = new URL('/store/flip-listings', backend)
  if (opts?.limit) url.searchParams.set('limit', String(opts.limit))
  if (opts?.category) url.searchParams.set('category', opts.category)
  if (opts?.q) url.searchParams.set('q', opts.q)

  try {
    const resp = await fetch(url.toString(), {
      next: { revalidate: 300 }, // 5 分鐘 ISR cache
      headers: {
        'x-publishable-api-key':
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
    })
    if (!resp.ok) {
      console.error('[flip-listings] backend non-ok:', resp.status)
      return { flip_listings: [], count: 0 }
    }
    return await resp.json()
  } catch (e) {
    console.error('[flip-listings] fetch error', e)
    return { flip_listings: [], count: 0 }
  }
}
