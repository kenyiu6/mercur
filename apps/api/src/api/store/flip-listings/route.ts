import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { FLIP_LISTING_MODULE } from '../../../modules/flip-listing'

/**
 * GET /store/flip-listings
 *
 * Public endpoint — storefront 首頁讀取 AI 推薦炒賣品。
 * Query params:
 *   - limit (預設 12)
 *   - category (electronics | tickets | property | collectibles | fashion | beauty | other)
 *   - q (關鍵字，從 title/description 模糊搜)
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const flipService: any = req.scope.resolve(FLIP_LISTING_MODULE)

  const limit = Math.min(parseInt(String(req.query.limit ?? '12'), 10) || 12, 50)
  const category = req.query.category ? String(req.query.category) : undefined
  const q = req.query.q ? String(req.query.q).toLowerCase() : undefined

  const filters: Record<string, unknown> = { status: 'active' }
  if (category) filters.category = category

  const [items, count] = await flipService.listAndCountFlipListings(filters, {
    take: q ? 200 : limit, // 有關鍵字先抓多點再 filter
    order: { popularity_score: 'DESC' },
  })

  const filtered = q
    ? items.filter(
        (it: any) =>
          (it.title?.toLowerCase().includes(q) ?? false) ||
          (it.description?.toLowerCase().includes(q) ?? false)
      )
    : items

  res.json({
    flip_listings: filtered.slice(0, limit),
    count: q ? filtered.length : count,
  })
}
