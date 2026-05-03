/**
 * eBay adapter – skeleton.
 *
 * Uses the eBay Browse API (OAuth 2.0 client-credentials flow).
 * Docs: https://developer.ebay.com/api-docs/buy/browse/overview.html
 *
 * Required env vars:
 *   EBAY_APP_ID   – eBay application (client) ID
 *   EBAY_APP_SECRET – eBay application secret
 *
 * TODO: implement token refresh + search call.
 */
import type { Adapter, Listing, ObserveOptions } from '../types'

export const ebayAdapter: Adapter = {
  name: 'ebay',

  async fetch(
    query: string,
    _options: Omit<ObserveOptions, 'platforms'>,
  ): Promise<Listing[]> {
    // SKELETON – not yet implemented
    console.warn(
      `[ebay] adapter is a skeleton. query="${query}" received but not processed.`,
    )
    return []
  },
}
