# 香港炒賣 MVP — Mercur Fork

基於 [mercurjs/mercur](https://github.com/mercurjs/mercur) 改造的香港炒賣多賣家市場原型。

## 改動摘要

| 模組 | 路徑 | 用途 |
|------|------|------|
| `flip-listing` 自定義 module | `apps/api/src/modules/flip-listing` | 儲存 AI 抓的炒賣品 |
| AI scraper | `apps/api/src/modules/flip-listing/lib/ai-scraper.ts` | Perplexity API 整合 |
| Workflow | `apps/api/src/workflows/flip-listing/refresh-flip-listings.ts` | 一鍵刷新邏輯 |
| 每日 cron | `apps/api/src/jobs/refresh-flip-listings.ts` | 每日 09:00 HKT 自動跑 |
| Store API | `apps/api/src/api/store/flip-listings/route.ts` | 公開讀取 + 搜尋過濾 |
| Admin API | `apps/api/src/api/admin/flip-listings/...` | 後台管理 + 手動觸發 |
| Storefront 首頁 | `apps/storefront/src/app/[locale]/(main)/page.tsx` | 加入 FlipPicksSection |
| 港式炒賣卡片 | `apps/storefront/src/components/sections/FlipPicksSection/` | 顯示熱度、毛利、買賣價 |
| Docker | `docker-compose.yml`, `docker/*.Dockerfile` | 本地一鍵啟動 |
| Render Blueprint | `render.yaml` | 雲端一鍵部署 |
| Vercel config | `vercel.json` | Storefront 可選 Vercel |

## 保留 / 移除

✅ **保留**：多賣家、購物車、Stripe 支付、Admin、Vendor panel、賣家註冊（feature flag `seller_registration: true`）、產品 / 訂單 / 庫存

❌ **暫不啟用**：B2B quote / company / approval 工作流（仍在 `@mercurjs/core` 內，但 storefront 不顯示，後台保留以備將來使用）

⚠️ **法律警告**：直接爬取 Carousell HK / Yahoo 拍賣違反其 ToS。
本實作預設透過 Perplexity LLM 的網絡搜尋能力做「市場研究」式歸納，而不是自動 HTTP 請求對方網站。商業上線前請：
1. 諮詢法律意見
2. 改用對方官方 API（如有）
3. 或改成「賣家手動上架，AI 只做分類/定價建議」

## 快速啟動

詳見 `DEPLOY-GUIDE.pdf`。

```bash
cp .env.example .env
# 編輯 .env 填入 PERPLEXITY_API_KEY
docker compose up -d --build
docker compose exec backend sh -c "cd apps/api && npx medusa user -e admin@hk-flip.local -p supersecret"
```

訪問：
- Storefront: http://localhost:3000/hk
- Admin: http://localhost:9000/app
- API: http://localhost:9000/store/flip-listings
