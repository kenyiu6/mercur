import { model } from '@medusajs/framework/utils'

/**
 * FlipListing - AI 推薦的炒賣商品快照
 *
 * 一條記錄 = 一個從 Carousell HK / Yahoo 拍賣抓回來的「熱門炒賣品」建議。
 * 賣家可以從 vendor 後台「一鍵採用」轉成正式 product。
 */
export const FlipListing = model.define('flip_listing', {
  id: model.id().primaryKey(),

  // 來源平台
  source: model.enum(['carousell_hk', 'yahoo_auction_hk', 'ai_generated']),
  source_url: model.text().nullable(),
  source_listing_id: model.text().nullable(),

  // 商品資訊（AI 萃取/生成）
  title: model.text(),
  description: model.text().nullable(),
  category: model.enum([
    'electronics',
    'tickets',
    'property',
    'collectibles',
    'fashion',
    'beauty',
    'other',
  ]),

  // 價格與利潤分析（AI 計算）
  market_price_hkd: model.number().nullable(),       // 市場成交價
  suggested_buy_hkd: model.number().nullable(),      // 建議入貨價
  suggested_sell_hkd: model.number().nullable(),     // 建議放售價
  estimated_margin_pct: model.number().nullable(),   // 估計毛利率 %

  // 熱度
  popularity_score: model.number().default(0),       // 0-100，AI 評分
  demand_signal: model.text().nullable(),            // 為什麼熱（AI 解釋）

  // 媒體
  thumbnail_url: model.text().nullable(),
  images: model.json().nullable(),                   // string[]

  // 狀態
  status: model.enum(['active', 'archived', 'adopted']).default('active'),
  scraped_at: model.dateTime(),
})
