# carousell-scraper

A lightweight Node.js/TypeScript utility that fetches live listing prices from Carousell HK for a given keyword.

## Usage

### Programmatic

```ts
import { scrapeCarousell } from './index'

const listings = await scrapeCarousell({
  keyword: 'SK-II 神仙水',
  maxResults: 10,
  sortBy: 'price_asc',
})
console.log(listings)
```

### CLI

```bash
npx ts-node tools/carousell-scraper/index.ts "SK-II 神仙水" 10
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `keyword` | string | — | Search term |
| `maxResults` | number | 20 | Max listings to return |
| `sortBy` | `price_asc` \| `price_desc` \| `recent` | `recent` | Sort order |

## Output

Returns an array of `CarousellListing` objects:

```json
[
  {
    "id": "1234567890",
    "title": "SK-II 神仙水 230ml",
    "price": 580,
    "currency": "HKD",
    "url": "https://www.carousell.com.hk/p/1234567890",
    "listedAt": "2026-05-03T12:00:00Z"
  }
]
```
