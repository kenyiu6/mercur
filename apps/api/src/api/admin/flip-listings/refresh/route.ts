import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { refreshFlipListingsWorkflow } from '../../../../workflows/flip-listing/refresh-flip-listings'

/**
 * POST /admin/flip-listings/refresh
 *
 * 手動觸發 AI 抓取（不用等 cron）。
 * Body: { count?: number }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const count = (req.body as any)?.count ?? 12
  const { result } = await refreshFlipListingsWorkflow(req.scope).run({
    input: { count },
  })
  res.json({ ok: true, ...result })
}
