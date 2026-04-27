/**
 * Flip Listing Module
 *
 * 儲存 AI 從香港炒賣平台（Carousell HK / Yahoo 拍賣）發掘出的熱門炒賣產品建議。
 * 每日由 cron job 觸發 AI API（Perplexity/OpenAI），結果寫入此模組的 model。
 * Storefront 從 /store/flip-listings 讀取，顯示在首頁推薦區塊。
 */
import { Module } from '@medusajs/framework/utils'
import FlipListingService from './service'

export const FLIP_LISTING_MODULE = 'flipListing'

export default Module(FLIP_LISTING_MODULE, {
  service: FlipListingService,
})
