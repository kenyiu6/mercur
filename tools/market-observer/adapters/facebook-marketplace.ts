/**
 * Facebook Marketplace adapter – skeleton.
 *
 * Facebook Marketplace does not have a public API.
 * Options:
 *  a) Use the unofficial Graph API endpoint (requires user access token).
 *  b) Headless browser / Playwright scrape.
 *
 * TODO: implement one of the options above.
 */
import type { Adapter, Listing, ObserveOptions } from '../types'

export const facebookMarketplaceAdapter: Adapter = {
  name: 'facebook-marketplace',

  async fetch(
    query: string,
    _options: Omit<ObserveOptions, 'platforms'>,
  ): Promise<Listing[]> {
    // SKELETON – not yet implemented
    console.warn(
      `[facebook-marketplace] adapter is a skeleton. query="${query}" received but not processed.`,
    )
    return []
  },
}
