# Core Machine — 服務交付手冊 (Delivery Playbook)

> 定義每個付費方案嘅服務交付流程
> 更新：2026-01-18

---

## 方案定義

### Starter（月費 HK$38 / 年費 HK$388）
- **每月 10 次 AI 文件生成配額（credits）**
- 年費 = 120 次/年
- 自動續費
- 付款成功後即時發放 credits
- 電郵通知客戶

### Pro（一次性 HK$12,800）
- **無限次 AI 生成**
- 公司註冊 / OPC 秘書服務（親自交付）
- 全程代辦補貼申請
- 5個工作天交付 SLA
- 電郵 + Telegram 通知

---

## 自動化交付流程（Starter）

```
用戶付款 → Stripe Webhook → 系統自動執行：
  1. 建立/更新 subscriptions 記錄
  2. 發放 credits（starter: 10次, starter_yearly: 120次）
  3. 發送 welcome email（包含 plan 名稱、credits 數量）
  4. Telegram 通知 Johnny（新付款）
```

### 資料庫操作

**訂閱記錄（subscriptions 表）**
- `openId`: 用 email 作為識別 key（格式：`email:xxx@xxx.com`）
- `plan`: starter | starter_yearly | pro | pro_monthly
- `status`: active | cancelled | expired | past_due
- `currentPeriodStart` / `currentPeriodEnd`: 訂閱週期

**Credits 記錄（userCredits 表）**
- `openId`: email 識別
- `balance`: 剩餘次數
- `totalUsed`: 累計使用次數

### Credits 扣減邏輯

```
用戶提交 AI 生成請求 →
  檢查 email 是否已訂閱 →
  如果係 Pro/Pro Monthly：直接生成（無限）
  如果係 Starter：
    檢查 balance > 0？
      係 → balance - 1，生成文件
      否 → 拒絕，提示升級
  如果冇 email（訪客）：直接生成（free tier，無限）
```

### 每月續費自動加 Credits

```
Stripe 發出 invoice.payment_succeeded →
  讀取 customer_email →
  讀取 plan 類型 →
  如果係 starter → addCredits(openId, 10)
  如果係 starter_yearly → addCredits(openId, 120)
```

---

## 人工交付流程（Pro）

```
新 Pro 付款通知抵達 →
  Johnny 收到 Telegram 通知 →
  48 小時內確認付款 +
  5 個工作天內完成服務交付：
    - 公司註冊 / OPC 設立
    - 補貼申請代辦
    - 全程跟進
  完成后標記 consultations.status = "converted"
```

---

## 取消訂閱流程

```
Stripe 發出 customer.subscription.deleted →
  更新 subscriptions.status = "cancelled" →
  Johnny 收到 Telegram 通知 →
  等待用戶主動聯絡處理
```

---

## Johnny 嘅行動清單（Stripe 申請完成後）

1. [ ] 喺 Stripe Dashboard 建立 4 個產品
   - Starter Monthly（HK$38/月）
   - Starter Yearly（HK$388/年）
   - Pro Monthly（HK$1,800/月）
   - Pro One-time（HK$12,800）

2. [ ] 複製 Price IDs 到 Railway 環境變量
   - `STRIPE_PRICE_ID_STARTER_MONTHLY=price_xxx`
   - `STRIPE_PRICE_ID_STARTER_YEARLY=price_xxx`
   - `STRIPE_PRICE_ID_PRO_MONTHLY=price_xxx`
   - `STRIPE_PRICE_ID_PRO_ONE_TIME=price_xxx`

3. [ ] 喺 Railway 設置 Stripe Webhook
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `invoice.payment_succeeded`, `customer.subscription.deleted`

4. [ ] 執行 SQL migration
   - 運行 `drizzle/0002_starter_subscriptions.sql`

5. [ ] 部署更新到 Railway

---

## 關鍵代碼位置

| 功能 | 檔案 |
|------|------|
| Stripe webhook 處理 | `server/_core/index.ts` |
| Credits/訂閱 DB 函數 | `server/db.ts` |
| Credits API router | `server/routers.ts` (member.getCredits) |
| AI 生成扣減 credits | `server/routers.ts` (ai.generateDocument) |
| Welcome email 發送 | `server/_core/email.ts` (sendWelcomeEmail) |
| DB Schema | `drizzle/schema.ts` (subscriptions, userCredits) |
| Stripe Checkout UI | `client/src/components/StripeCheckoutButton.tsx` |
| Pricing 頁面 | `client/src/components/Pricing.tsx` |
| AI Generator UI | `client/src/components/AIDocumentGenerator.tsx` |

---

## 測試清單

- [ ] 免費用戶可以生成文件（無限）
- [ ] 輸入 email 的 Starter 用戶，credits 正確扣減
- [ ] Credits = 0 的 Starter 用戶收到拒絕提示
- [ ] Pro 用戶生成文件不受 credits 限制
- [ ] 付款成功後收到 welcome email
- [ ] Johnny 收到新付款 Telegram 通知
- [ ] 取消訂閱後訂閱狀態變為 cancelled
