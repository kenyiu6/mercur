import Link from 'next/link'
import { listFlipListings, type FlipListing } from '@/lib/data/flip-listings'

const CATEGORY_LABELS: Record<string, string> = {
  electronics: '電子產品',
  tickets: '門票',
  property: '樓盤',
  collectibles: '收藏品',
  fashion: '時裝',
  beauty: '美妝',
  other: '其他',
}

const CATEGORIES = ['electronics', 'tickets', 'property', 'collectibles']

interface Props {
  locale: string
  category?: string
  query?: string
}

export async function FlipPicksSection({ locale, category, query }: Props) {
  const { flip_listings } = await listFlipListings({
    limit: 12,
    category,
    q: query,
  })

  return (
    <section className="px-4 lg:px-8 w-full">
      <div className="flex flex-col gap-2 mb-6">
        <span className="uppercase text-xs tracking-widest text-secondary">
          AI 每日精選 · 香港炒賣熱榜
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold">今日熱門炒賣品</h2>
        <p className="text-secondary max-w-2xl">
          由 AI 每日分析 Carousell HK、Yahoo 拍賣等公開市場數據，挑出最高熱度與毛利率的炒賣品。
        </p>
      </div>

      {/* 類別過濾 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={`/${locale}`}
          className={`px-4 py-1.5 rounded-full border text-sm transition ${
            !category
              ? 'bg-primary text-white border-primary'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          全部
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/${locale}?cat=${c}`}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              category === c
                ? 'bg-primary text-white border-primary'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {CATEGORY_LABELS[c]}
          </Link>
        ))}
      </div>

      {flip_listings.length === 0 ? (
        <div className="border rounded-lg p-12 text-center text-secondary bg-gray-50">
          暫未有資料。請在 admin 後台執行
          <code className="mx-2 px-2 py-0.5 bg-white rounded">
            POST /admin/flip-listings/refresh
          </code>
          觸發 AI 抓取。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {flip_listings.map((it) => (
            <FlipCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </section>
  )
}

function FlipCard({ item }: { item: FlipListing }) {
  const margin = item.estimated_margin_pct ?? 0
  const marginColor =
    margin >= 100 ? 'bg-red-600' : margin >= 30 ? 'bg-orange-500' : 'bg-green-600'

  return (
    <article className="border rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col bg-white">
      <div className="aspect-[4/3] bg-gray-100 relative">
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
            🛍️
          </div>
        )}
        <span
          className={`absolute top-2 right-2 ${marginColor} text-white text-xs px-2 py-0.5 rounded-full`}
        >
          毛利 {Math.round(margin)}%
        </span>
        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
          熱度 {item.popularity_score}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <span className="text-xs text-secondary uppercase tracking-wide">
          {CATEGORY_LABELS[item.category] ?? item.category}
        </span>
        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">{item.title}</h3>

        {item.demand_signal && (
          <p className="text-xs text-secondary line-clamp-2">
            🔥 {item.demand_signal}
          </p>
        )}

        <div className="mt-auto pt-3 border-t flex items-center justify-between text-sm">
          <div>
            <div className="text-xs text-secondary">入貨</div>
            <div className="font-bold">
              HK${item.suggested_buy_hkd?.toLocaleString() ?? '—'}
            </div>
          </div>
          <div className="text-secondary">→</div>
          <div className="text-right">
            <div className="text-xs text-secondary">放售</div>
            <div className="font-bold text-red-600">
              HK${item.suggested_sell_hkd?.toLocaleString() ?? '—'}
            </div>
          </div>
        </div>

        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            查看來源 ↗
          </a>
        )}
      </div>
    </article>
  )
}
