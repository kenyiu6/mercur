# market-observer

A unified market-price observer tool for Mercur. Fetches and normalises listings from multiple second-hand / resale platforms into a single `Listing[]` shape.

## Supported adapters

| Adapter | Status |
|---|---|
| `carousell` | ✅ Active |
| `facebook-marketplace` | 🚧 Skeleton |
| `ebay` | 🚧 Skeleton |

## Usage

```ts
import { observe } from './index'

const listings = await observe({
  query: 'Sony WH-1000XM5',
  platforms: ['carousell', 'facebook-marketplace', 'ebay'],
  region: 'HK',
})
console.log(listings)
```

## Adding a new adapter

1. Create `adapters/<name>.ts` implementing the `Adapter` interface.
2. Register it in `index.ts`.
