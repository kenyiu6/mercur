#!/usr/bin/env node
/**
 * Carousell Price Scraper
 * Fetches listing prices for a given search keyword on Carousell HK.
 */

import * as https from 'https'

export interface CarousellListing {
  id: string
  title: string
  price: number
  currency: string
  url: string
  listedAt: string
}

export interface ScrapeOptions {
  keyword: string
  maxResults?: number
  sortBy?: 'price_asc' | 'price_desc' | 'recent'
}

export async function scrapeCarousell(options: ScrapeOptions): Promise<CarousellListing[]> {
  const { keyword, maxResults = 20, sortBy = 'recent' } = options

  const sortMap: Record<string, string> = {
    price_asc: '2',
    price_desc: '3',
    recent: '0',
  }

  const params = new URLSearchParams({
    query: keyword,
    sort_by: sortMap[sortBy],
    page_size: String(maxResults),
    country_id: 'HK',
  })

  const apiUrl = `https://www.carousell.com.hk/api-service/search/cf/4.0/listings/?${params.toString()}`

  return new Promise((resolve, reject) => {
    const req = https.get(
      apiUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; price-monitor/1.0)',
          Accept: 'application/json',
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            const listings: CarousellListing[] = (json?.data?.results ?? []).map((item: any) => ({
              id: String(item.id ?? ''),
              title: item.title ?? '',
              price: parseFloat(item.price?.amount ?? '0'),
              currency: item.price?.currency_code ?? 'HKD',
              url: `https://www.carousell.com.hk/p/${item.id}`,
              listedAt: item.created_at ?? '',
            }))
            resolve(listings)
          } catch (err) {
            reject(new Error(`Failed to parse Carousell response: ${err}`))
          }
        })
      },
    )
    req.on('error', reject)
    req.setTimeout(10_000, () => {
      req.destroy(new Error('Request timed out'))
    })
  })
}

// CLI usage: npx ts-node tools/carousell-scraper/index.ts <keyword> [maxResults]
if (require.main === module) {
  const [, , keyword, maxResultsArg] = process.argv
  if (!keyword) {
    console.error('Usage: ts-node index.ts <keyword> [maxResults]')
    process.exit(1)
  }
  scrapeCarousell({ keyword, maxResults: Number(maxResultsArg) || 10, sortBy: 'price_asc' })
    .then((listings) => {
      console.log(JSON.stringify(listings, null, 2))
    })
    .catch((err) => {
      console.error(err.message)
      process.exit(1)
    })
}
