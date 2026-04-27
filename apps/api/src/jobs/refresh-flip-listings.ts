/**
 * Scheduled Job — 每日刷新 AI 推薦炒賣品
 *
 * Medusa v2 的 scheduled job：每日香港時間 09:00（UTC 01:00）執行。
 * 透過 Perplexity API 抓取當日熱門炒賣品，寫入 flip_listing 表。
 */
import { MedusaContainer } from '@medusajs/framework/types'
import { refreshFlipListingsWorkflow } from '../workflows/flip-listing/refresh-flip-listings'

export default async function refreshFlipListingsJob(container: MedusaContainer) {
  const logger = container.resolve('logger')
  logger.info('[flip-listing] daily refresh starting…')

  const { result } = await refreshFlipListingsWorkflow(container).run({
    input: { count: 12 },
  })

  logger.info(
    `[flip-listing] daily refresh done — mode=${result.mode}, created=${result.count}, archived=${result.oldArchived}`
  )
}

export const config = {
  name: 'refresh-flip-listings',
  // 每日 UTC 01:00 = HKT 09:00
  schedule: '0 1 * * *',
}
