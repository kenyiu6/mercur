import { MedusaService } from '@medusajs/framework/utils'
import { FlipListing } from './models'

class FlipListingService extends MedusaService({
  FlipListing,
}) {
  /**
   * 取得首頁推薦炒賣品 — 按熱度與毛利率排序
   */
  async getTopFlips(limit = 12, category?: string) {
    const filters: Record<string, unknown> = { status: 'active' }
    if (category) filters.category = category
    const [items] = await this.listAndCountFlipListings(filters, {
      take: limit,
      order: { popularity_score: 'DESC', estimated_margin_pct: 'DESC' },
    })
    return items
  }
}

export default FlipListingService
