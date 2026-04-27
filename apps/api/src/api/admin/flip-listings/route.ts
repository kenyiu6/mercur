import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { FLIP_LISTING_MODULE } from '../../../modules/flip-listing'

/** GET /admin/flip-listings — 列出所有（含 archived） */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const flipService: any = req.scope.resolve(FLIP_LISTING_MODULE)
  const status = (req.query.status as string) ?? 'active'
  const [items, count] = await flipService.listAndCountFlipListings(
    { status },
    { take: 100, order: { scraped_at: 'DESC' } }
  )
  res.json({ flip_listings: items, count })
}
