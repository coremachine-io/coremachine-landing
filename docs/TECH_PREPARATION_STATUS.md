# Core Machine - 技術準備狀態報告

**最後更新：** 2026年4月18日  
**更新者：** Hermes Agent（Johnny 嘅 AI 拍檔）

---

## ✅ 已完成準備工作

### 1. Stripe 付款整合
- ✅ `server/_core/stripe.ts` — Stripe Router（已創建）
- ✅ `client/src/components/StripeCheckoutButton.tsx` — 付款按鈕組件（已創建）
- ✅ `client/src/pages/PaymentSuccess.tsx` — 付款成功頁（已創建）
- ✅ `client/src/pages/PaymentCancel.tsx` — 付款取消頁（已創建）
- ✅ `server/_core/env.ts` — 已加入 Stripe 環境變量
- ✅ `stripe` npm package 已安裝

### 2. Analytics
- ✅ `client/index.html` — 已加入 Vercel Analytics（需要配置 website-id）

### 3. SEO
- ✅ `client/index.html` — 已加入 meta description

### 4. 服務交付 Playbook
- ✅ `docs/DELIVERY_PLAYBOOK.md` — 完整交付流程定義

---

## 🚨 等 Johnny 處理（P0）

### 1. Stripe 帳號設定（阻礙收款）

Johnny 需要做以下事情：

#### A. 建立 Stripe 帳號
1. 前往 https://dashboard.stripe.com/register 註冊
2. 切換到 HKD 貨幣（Settings → Default currency → HKD）

#### B. 建立產品和價格
喺 Stripe Dashboard：
1. **Products** → **Add product**
2. 建立以下 4 個產品：

| 產品名 | 價格 | 計費方式 |
|--------|------|----------|
| Starter Monthly | HK$38 | Monthly subscription |
| Starter Yearly | HK$388 | Yearly subscription |
| Pro One-Time | HK$12,800 | One-time |
| Pro Monthly | HK$1,800 | Monthly subscription |

3. 複製每個產品的 **Price ID**（格式：`price_xxx`）

#### C. 設置 Webhook
1. **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://coremachine-landing-hy8v452zo-coremachine-ios-projects.vercel.app/api/stripe/webhook`
3. 監聽 events：
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
4. 複製 **Webhook signing secret**（格式：`whsec_xxx`）

#### D. 複製 API Keys
- **Publishable key**：`pk_test_xxx` 或 `pk_live_xxx`
- **Secret key**：`sk_test_xxx` 或 `sk_live_xxx`

#### E. 設置環境變量（Railway）
喺 Railway dashboard 設置：

```env
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

### 2. Vercel Analytics（阻礙數據追蹤）

1. 前往 https://vercel.com/analytics
2. 選擇 coremachine-landing 項目
3. 複製 **Website ID**
4. 更新 `client/index.html` 中的 `data-website-id=""`

---

### 3. MySQL 數據庫連接（影響數據存儲）

Railway MySQL 可能已經壞咗。Johnny 需要：

1. 確認 Railway MySQL 還在運行
2. 獲取新的 `DATABASE_URL`
3. 更新 Railway 環境變量

如果 MySQL 真的死了，考慮：
- 申請新嘅 Railway MySQL（$5/月）
- 或者用 PlanetScale（免費）- 不過佢哋宣佈停咗

---

## ⚠️ 已識別問題

### Navbar 消失問題（FreeResources 頁）
- **現象：** FreeResources.tsx 源文件有 `<NavBar />`，但 deployed 版本冇
- **可能原因：** deployed 版本係舊 build
- **解決方式：** 等 Johnny 可以 restart server 後，重新 build deploy

### 兩個 routers.ts 版本
- `server/routers.ts` — 當前使用（MiniMax）
- `src/server/routers.ts` — 舊 Manus 版本
- **建議：** 清理 `src/server/` 資料夾避免混淆

---

## 📋 Johnny 番歸後 Checked

```
Server Restart 番嚟之後：

□ 1. 運行 `pnpm build && pnpm start` 確認正常
□ 2. 測試咨詢表單提交 → 確認收到 Telegram 通知
□ 3. 測試 AI 文件生成 → 確認正常運作
□ 4. 填寫 Stripe 環境變量
□ 5. 測試 Stripe 付款流程
□ 6. 確認 Vercel Analytics 正常運作
□ 7. 檢查 MySQL 連接
□ 8. 清理 src/server/ 舊文件
□ 9. 重新 deploy（如有需要）
□ 10. 提交新嘅 Startup Two 備份
```

---

## 🎯 短期行動計劃

### 本週（Johnny 番歸後即做）
1. ✅ Stripe 帳號建立 + 測試
2. ✅ Vercel Analytics 開通
3. ✅ MySQL 確認
4. ✅ 第一次真正收款！

### 下週
1. 正式推出付費牆（Starter HK$38）
2. 推廣渠道啟動（SEO、社交媒體）
3. Pro 服務人手交付啟動

### 持續優化
- 每週分析 Analytics 數據
- A/B 測試定價頁面
- 客戶反饋收集

---

## 📁 已修改/創建文件列表

```
修改：
- client/index.html
- client/src/App.tsx
- server/_core/env.ts

新建：
- server/_core/stripe.ts
- client/src/components/StripeCheckoutButton.tsx
- client/src/pages/PaymentSuccess.tsx
- client/src/pages/PaymentCancel.tsx
- docs/DELIVERY_PLAYBOOK.md
- docs/TECH_PREPARATION_STATUS.md（呢個文件）
```

---

## 💡 給 Johnny 嘅提醒

你話「其他嘢你安排」，我已經做咗所有技術準備。但係最重要嘅一步 —— 建立 Stripe 帳號 —— 係需要你親自做嘅，因為：
1. Stripe 帳號需要身份驗證
2. 商業帳號需要銀行戶口驗證
3. 呢個係唯一阻止我哋收錢嘅障礙

**只要你建立好 Stripe 帳號，我就可以在 5 分鐘內完成整合，我哋就可以開始收款！**

---

*有心未遠 — Core Machine Team*
