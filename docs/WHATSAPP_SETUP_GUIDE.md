# WhatsApp Business API 設置指引

> WhatsApp Business API 讓你可以追蹤訊息轉化、回复自動化、同時管理多個客服人員。
> 相比 static link `https://wa.me/xxx`，API 版本可以知道邊個客人從邊個頁面嚟。

---

## 選項比較

| 方案 | 成本 | 難度 | 適合 |
|------|------|------|------|
| **Static Link**（現時用緊） | 免費 | 零 | 測試階段 |
| **WhatsApp Business App** | 免費 | 低 | 1-2人團隊 |
| **WhatsApp Business API** | 按訊息收費 | 高 | 认真做转化追踪 |
| **Third-party SaaS**（如 Intercom） | HK$200-500/月 | 中 | 需要完整客服系統 |

---

## 推薦：WhatsApp Business App（過渡方案）

如果只是想要一個統一的商務帳號，**WhatsApp Business App** 係最簡單嘅升級：

1. **下載** WhatsApp Business（Google Play / App Store）
2. **驗證** 你的商業電話號碼
3. **設置** 自動回覆、店鋪資訊
4. **取代** 現在的 `https://wa.me/xxx` link

---

## 完整 WhatsApp Business API（可選）

### 申請流程

**1. 選擇 BSP（Business Solution Provider）**

常見提供商：
- **Twilio** — 最流行，文檔齊全
- **MessageBird** — 歐洲牌子
- **Infobip** — 全球覆蓋

**2. 申請 Meta Business 帳號**

```
1. 前往 https://business.facebook.com
2. 創建 Business 帳戶
3. 驗證你的公司（如需要）
```

**3. 申請 WhatsApp Business API**

```
1. 聯絡你選擇的 BSP（如 Twilio）
2. 提交 WABA（WhatsApp Business Account）申請
3. 等待 Meta 審批（1-5 工作天）
4. 獲批後獲得 Phone Number ID + API Token
```

**4. 接入成本（Twilio 參考）**

| 類型 | 費用 |
|------|------|
| 每月固定費用 | US$0（Sandbox）/ US$45+（Production）|
| 收到訊息 | US$0.01-0.05/條 |
| 發出訊息 | US$0.05-0.15/條 |

**5. 接入網站**

```javascript
// 安裝 Twilio SDK
// npm install twilio

// 發送 WhatsApp 訊息
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${userPhone}`,
  body: `你好！多謝訂閱 Core Machine。你嘅 Starter 已啟動！`
});
```

---

## 短期建議

而家用緊的 **static wa.me link** 其實已經足夠做基本轉化。

**什麼時候升級：**
- 每月 WhatsApp 查詢 > 50 個
- 需要追蹤每個流量來源
- 想做自動回覆機器人

**暂时不升級的理由：**
- Stripe 收入未穩定
- 人工回覆性價比更高
- API 成本累積

---

## 記錄你的 WhatsApp 電話號碼

現在就可以填寫，方便日後升級：

```
WhatsApp Business 電話：______________（Johnny 的深圳號碼）
WABA ID：______________（申請後填寫）
API Token：______________（申請後填寫）
```
