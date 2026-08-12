/**
 * AI Scraper — 用 LLM 抓取/分析香港炒賣熱門品
 *
 * ⚠️ 重要：直接爬取 Carousell HK / Yahoo Auction HK 違反其 ToS，
 *     可能引發法律與 IP 封鎖風險。本實作預設用 LLM 的「網絡搜尋能力」
 *     去歸納公開市場資訊（類似分析師的二次研究），而非自動提交 HTTP
 *     請求到對方網站。商業使用前請：
 *     1) 諮詢法律意見
 *     2) 改用對方官方 API（如有）
 *     3) 或改成「賣家手動上架，AI 只提供分類/定價建議」
 */

export type FlipCategory =
  | 'electronics'
  | 'tickets'
  | 'property'
  | 'collectibles'
  | 'fashion'
  | 'beauty'
  | 'other'

export interface ScrapedFlip {
  source: 'carousell_hk' | 'yahoo_auction_hk' | 'ai_generated'
  source_url?: string | null
  source_listing_id?: string | null
  title: string
  description?: string | null
  category: FlipCategory
  market_price_hkd?: number | null
  suggested_buy_hkd?: number | null
  suggested_sell_hkd?: number | null
  estimated_margin_pct?: number | null
  popularity_score: number
  demand_signal?: string | null
  thumbnail_url?: string | null
  images?: string[] | null
}

const SYSTEM_PROMPT = `你是香港炒賣市場分析師。任務：根據當前公開市場資訊，列出最近最熱門、利潤率最高的炒賣商品（電子產品、演唱會/球賽門票、樓盤認購籌、限量收藏品等）。
只輸出 JSON 陣列，每個元素必須符合下列 schema：
{
  "source": "carousell_hk" | "yahoo_auction_hk" | "ai_generated",
  "source_url": string | null,
  "title": string,                // 商品名稱（中文，繁體）
  "description": string,           // 1-2 句話描述
  "category": "electronics" | "tickets" | "property" | "collectibles" | "fashion" | "beauty" | "other",
  "market_price_hkd": number,      // 估計成交價
  "suggested_buy_hkd": number,     // 入貨價
  "suggested_sell_hkd": number,    // 放售價
  "estimated_margin_pct": number,  // (sell - buy) / buy * 100
  "popularity_score": number,      // 0-100
  "demand_signal": string,         // 為何熱門（一句話）
  "thumbnail_url": string | null
}
不要輸出任何 markdown code fence，只輸出純 JSON 陣列。`

export async function fetchTopFlipsViaAI(opts: {
  count?: number
  apiKey: string
  model?: string
}): Promise<ScrapedFlip[]> {
  const { count = 12, apiKey, model = 'sonar-pro' } = opts

  // Perplexity API（內建 web search，最適合此用例）
  const resp = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `請根據今日（${new Date().toISOString().slice(0, 10)}）香港炒賣市場狀況，列出 ${count} 個最熱門的炒賣商品。覆蓋電子產品、門票、樓盤、收藏品。只輸出 JSON 陣列。`,
        },
      ],
      temperature: 0.3,
    }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Perplexity API ${resp.status}: ${text.slice(0, 300)}`)
  }

  const data = await resp.json()
  const content: string = data?.choices?.[0]?.message?.content ?? '[]'

  // 容錯：剝掉可能的 code fence
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // LLM 偶爾包了一層敘述，嘗試抽出第一個 [...]
    const match = cleaned.match(/\[[\s\S]*\]/)
    parsed = match ? JSON.parse(match[0]) : []
  }

  if (!Array.isArray(parsed)) return []
  return parsed as ScrapedFlip[]
}

/**
 * Mock fallback — 沒設定 API key 或 dev 環境用
 */
export function mockTopFlips(): ScrapedFlip[] {
  const now = Date.now()
  return [
    {
      source: 'ai_generated',
      title: 'iPhone 17 Pro Max 256GB（深藍）',
      description: '新機到貨期長，黃牛價持續高企',
      category: 'electronics',
      market_price_hkd: 13800,
      suggested_buy_hkd: 11500,
      suggested_sell_hkd: 13500,
      estimated_margin_pct: 17.4,
      popularity_score: 95,
      demand_signal: '官網缺貨 + 大陸客需求強',
      thumbnail_url: null,
      source_url: null,
    },
    {
      source: 'ai_generated',
      title: 'Mirror 演唱會門票（紅館 VIP 區）',
      description: '紅館復演熱炒中',
      category: 'tickets',
      market_price_hkd: 4500,
      suggested_buy_hkd: 1280,
      suggested_sell_hkd: 4200,
      estimated_margin_pct: 228,
      popularity_score: 92,
      demand_signal: '城市售罄，二手市場價飆升',
      thumbnail_url: null,
      source_url: null,
    },
    {
      source: 'ai_generated',
      title: '啟德新盤 Cluster A 認購籌',
      description: '一手樓花籌位炒賣',
      category: 'property',
      market_price_hkd: 15000,
      suggested_buy_hkd: 5000,
      suggested_sell_hkd: 14000,
      estimated_margin_pct: 180,
      popularity_score: 78,
      demand_signal: '新盤超購 12 倍',
      thumbnail_url: null,
      source_url: null,
    },
    {
      source: 'ai_generated',
      title: 'Labubu 隱藏款 公仔',
      description: '泡泡瑪特熱門收藏',
      category: 'collectibles',
      market_price_hkd: 1200,
      suggested_buy_hkd: 99,
      suggested_sell_hkd: 1100,
      estimated_margin_pct: 1010,
      popularity_score: 88,
      demand_signal: '隱藏款抽中率 1/144',
      thumbnail_url: null,
      source_url: null,
    },
    {
      source: 'ai_generated',
      title: 'PS5 Pro 30 週年限定版',
      description: '全球限量，香港行貨難求',
      category: 'electronics',
      market_price_hkd: 9800,
      suggested_buy_hkd: 5980,
      suggested_sell_hkd: 9500,
      estimated_margin_pct: 58.9,
      popularity_score: 86,
      demand_signal: '全球限量 12300 台',
      thumbnail_url: null,
      source_url: null,
    },
    {
      source: 'ai_generated',
      title: 'Pokemon TCG 151 集換式卡牌（未開封 Booster Box）',
      description: '日版未開封盒裝',
      category: 'collectibles',
      market_price_hkd: 1980,
      suggested_buy_hkd: 980,
      suggested_sell_hkd: 1880,
      estimated_margin_pct: 91.8,
      popularity_score: 81,
      demand_signal: '日本指定發售，香港供應緊張',
      thumbnail_url: null,
      source_url: null,
    },
  ]
}
