/**
 * classify.ts — aggregates raw Listing[] into a ClassifyOutput snapshot.
 *
 * Responsibilities:
 *   1. Deduplicate listings by (platform + id).
 *   2. Sort by price ascending.
 *   3. Attach metadata (query, timestamp, count).
 *
 * This module is intentionally side-effect-free — no I/O, no fetch.
 * The CLI (cli.ts) handles reading input and writing output.
 */
import type { ClassifyOutput, Listing } from './types'

export function classify(query: string, listings: Listing[]): ClassifyOutput {
  const seen = new Set<string>()
  const deduped: Listing[] = []

  for (const listing of listings) {
    const key = `${listing.platform}:${listing.id}`
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(listing)
    }
  }

  deduped.sort((a, b) => a.price - b.price)

  return {
    meta: {
      query,
      generatedAt: new Date().toISOString(),
      totalListings: deduped.length,
    },
    listings: deduped,
  }
}
