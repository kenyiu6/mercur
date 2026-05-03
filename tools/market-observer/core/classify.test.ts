/**
 * Minimal tests for classify().
 * Run with: bun test tools/market-observer/core/classify.test.ts
 */
import { describe, expect, it } from 'bun:test'
import { classify } from './classify'
import type { Listing } from './types'

const make = (overrides: Partial<Listing> = {}): Listing => ({
  platform: 'carousell',
  id: '1',
  title: 'Test item',
  price: 100,
  currency: 'HKD',
  url: 'https://example.com/1',
  ...overrides,
})

describe('classify', () => {
  it('returns meta with correct query and count', () => {
    const result = classify('headphones', [make()])
    expect(result.meta.query).toBe('headphones')
    expect(result.meta.totalListings).toBe(1)
    expect(result.meta.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('deduplicates by platform+id', () => {
    const listings = [
      make({ id: '1', price: 200 }),
      make({ id: '1', price: 200 }), // duplicate
      make({ id: '2', price: 100 }),
    ]
    const result = classify('test', listings)
    expect(result.meta.totalListings).toBe(2)
  })

  it('sorts listings by price ascending', () => {
    const listings = [
      make({ id: '3', price: 300 }),
      make({ id: '1', price: 100 }),
      make({ id: '2', price: 200 }),
    ]
    const result = classify('test', listings)
    expect(result.listings.map((l) => l.price)).toEqual([100, 200, 300])
  })

  it('handles empty input', () => {
    const result = classify('empty', [])
    expect(result.meta.totalListings).toBe(0)
    expect(result.listings).toHaveLength(0)
  })

  it('deduplicates across different platforms independently', () => {
    const listings = [
      make({ platform: 'carousell', id: '1', price: 100 }),
      make({ platform: 'ebay', id: '1', price: 150 }), // same id, different platform — keep both
    ]
    const result = classify('test', listings)
    expect(result.meta.totalListings).toBe(2)
  })
})
