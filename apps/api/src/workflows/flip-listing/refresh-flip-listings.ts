import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk'
import { FLIP_LISTING_MODULE } from '../../modules/flip-listing'
import {
  fetchTopFlipsViaAI,
  mockTopFlips,
  ScrapedFlip,
} from '../../modules/flip-listing/lib/ai-scraper'

const REFRESH_STEP = 'refresh-flip-listings-step'

const refreshStep = createStep(
  REFRESH_STEP,
  async (input: { count?: number }, { container }) => {
    const flipService: any = container.resolve(FLIP_LISTING_MODULE)
    const apiKey = process.env.PERPLEXITY_API_KEY

    let scraped: ScrapedFlip[] = []
    let mode = 'mock'

    if (apiKey) {
      try {
        scraped = await fetchTopFlipsViaAI({ count: input.count ?? 12, apiKey })
        mode = 'live'
      } catch (e) {
        console.error('[flip-listing] AI fetch failed, falling back to mock:', e)
        scraped = mockTopFlips()
      }
    } else {
      console.warn('[flip-listing] PERPLEXITY_API_KEY not set — using mock data')
      scraped = mockTopFlips()
    }

    // 標記舊紀錄為 archived，再插入新一批
    const [oldActive] = await flipService.listAndCountFlipListings(
      { status: 'active' },
      { take: 1000 }
    )
    if (oldActive.length) {
      await flipService.updateFlipListings(
        oldActive.map((it: any) => ({ id: it.id, status: 'archived' }))
      )
    }

    const created = await flipService.createFlipListings(
      scraped.map((s) => ({
        ...s,
        status: 'active',
        scraped_at: new Date(),
      }))
    )

    return new StepResponse({ mode, count: created.length, oldArchived: oldActive.length })
  }
)

export const refreshFlipListingsWorkflow = createWorkflow(
  'refresh-flip-listings',
  function (input: { count?: number }) {
    const result = refreshStep(input)
    return new WorkflowResponse(result)
  }
)
