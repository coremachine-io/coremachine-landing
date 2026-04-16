# Core Machine Landing Page - DNS 設定教學

## 概述

本文檔將指導你如何將自定義域名 `coremachine.io` 綁定到 Core Machine Landing Page。

---

## 方案一：使用 Manus 內置域名管理（推薦）

Manus 提供完整的域名管理功能，你可以直接在平台內購買、註冊和綁定域名。

### 步驟

1. **登錄 Manus Management UI**
   - 在聊天界面右上角點擊「管理」圖標
   - 或點擊項目卡片中的「View」按鈕

2. **進入域名設定**
   - 在左側導航欄選擇「Settings」
   - 點擊「Domains」子選項

3. **購買或綁定域名**
   
   **選項 A：購買新域名**
   - 點擊「Purchase New Domain」
   - 搜索 `coremachine.io`（如果可用）
   - 完成購買流程
   - 系統會自動配置 DNS 記錄
   
   **選項 B：綁定現有域名**
   - 點擊「Add Custom Domain」
   - 輸入 `coremachine.io`
   - 按照系統提示在你的域名註冊商處添加 DNS 記錄

4. **等待 DNS 生效**
   - 通常需要 5-30 分鐘
   - 最長可能需要 48 小時

---

## 方案二：手動配置 DNS（適用於已有域名）

如果你已經在其他註冊商（如 GoDaddy、Namecheap、Cloudflare）購買了 `coremachine.io`，可以手動配置 DNS。

### 前提條件

1. 你已經擁有域名 `coremachine.io`
2. 你有權限訪問域名的 DNS 管理面板
3. 你已經部署了 Core Machine Landing Page 並獲得了 Manus 提供的部署 URL

### 獲取部署 URL

在 Manus 中創建 checkpoint 並發布後，你會獲得一個部署 URL，格式類似：
```
https://your-project-id.manus.space
```

### DNS 配置步驟

#### 1. 登錄你的域名註冊商

登錄你購買 `coremachine.io` 的域名註冊商（如 GoDaddy、Namecheap、Cloudflare 等）。

#### 2. 進入 DNS 管理

找到「DNS Management」、「DNS Settings」或「Manage DNS」選項。

#### 3. 添加 CNAME 記錄

根據你的需求，選擇以下其中一種配置：

**配置 A：將根域名指向 Manus（推薦）**

如果你的註冊商支持 CNAME flattening（如 Cloudflare），可以直接配置根域名：

| 類型  | 名稱 | 值/目標                          | TTL  |
|-------|------|----------------------------------|------|
| CNAME | @    | your-project-id.manus.space      | 自動 |

**配置 B：使用 www 子域名**

如果你的註冊商不支持根域名 CNAME，可以配置 www 子域名：

| 類型  | 名稱 | 值/目標                          | TTL  |
|-------|------|----------------------------------|------|
| CNAME | www  | your-project-id.manus.space      | 自動 |

同時添加一個 URL 重定向，將 `coremachine.io` 重定向到 `www.coremachine.io`。

**配置 C：使用 A 記錄（如果 Manus 提供了 IP 地址）**

如果 Manus 提供了靜態 IP 地址，可以使用 A 記錄：

| 類型 | 名稱 | 值/目標           | TTL  |
|------|------|-------------------|------|
| A    | @    | XXX.XXX.XXX.XXX   | 自動 |
| A    | www  | XXX.XXX.XXX.XXX   | 自動 |

> **注意**：請向 Manus 支持團隊確認是否提供靜態 IP 地址。

#### 4. 保存設定

保存 DNS 記錄後，等待 DNS 傳播。

#### 5. 驗證配置

使用以下命令驗證 DNS 是否正確配置：

```bash
# 檢查 CNAME 記錄
dig coremachine.io CNAME

# 或使用 nslookup
nslookup coremachine.io
```

---

## 常見域名註冊商配置指引

### Cloudflare

1. 登錄 Cloudflare Dashboard
2. 選擇 `coremachine.io` 域名
3. 點擊「DNS」選項卡
4. 點擊「Add record」
5. 選擇類型：CNAME
6. 名稱：@ 或 www
7. 目標：your-project-id.manus.space
8. 代理狀態：關閉（點擊橙色雲圖標使其變灰）
9. 點擊「Save」

### GoDaddy

1. 登錄 GoDaddy 帳戶
2. 進入「My Products」
3. 找到 `coremachine.io`，點擊「DNS」
4. 點擊「Add」
5. 類型：CNAME
6. 名稱：www
7. 值：your-project-id.manus.space
8. TTL：1 小時
9. 點擊「Save」

### Namecheap

1. 登錄 Namecheap 帳戶
2. 進入「Domain List」
3. 點擊 `coremachine.io` 旁邊的「Manage」
4. 選擇「Advanced DNS」選項卡
5. 點擊「Add New Record」
6. 類型：CNAME Record
7. Host：www
8. 值：your-project-id.manus.space
9. TTL：Automatic
10. 點擊「Save All Changes」

---

## SSL/TLS 證書

Manus 會自動為你的自定義域名配置 SSL/TLS 證書（Let's Encrypt），確保網站使用 HTTPS 加密連接。

### 驗證 SSL 證書

在瀏覽器中訪問 `https://coremachine.io`，檢查地址欄是否顯示鎖形圖標。

---

## 故障排除

### DNS 未生效

**問題**：配置 DNS 後，域名仍無法訪問。

**解決方案**：
1. 等待更長時間（最多 48 小時）
2. 清除本地 DNS 緩存：
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```
3. 使用在線工具檢查 DNS 傳播狀態：https://dnschecker.org/

### CNAME 衝突

**問題**：無法為根域名（@）添加 CNAME 記錄。

**解決方案**：
1. 使用 www 子域名代替
2. 或使用支持 CNAME flattening 的 DNS 服務（如 Cloudflare）
3. 或使用 A 記錄（需要 Manus 提供靜態 IP）

### SSL 證書錯誤

**問題**：訪問網站時顯示 SSL 證書錯誤。

**解決方案**：
1. 等待 SSL 證書自動配置完成（通常需要幾分鐘）
2. 確保 DNS 已正確指向 Manus 服務器
3. 聯絡 Manus 支持團隊

---

## 聯絡支持

如果你在配置過程中遇到問題，可以：

1. **Manus 支持**：https://help.manus.im
2. **域名註冊商支持**：聯絡你的域名註冊商客服

---

## 附錄：DNS 記錄類型說明

| 類型  | 用途                                   | 示例                              |
|-------|----------------------------------------|-----------------------------------|
| A     | 將域名指向 IPv4 地址                   | coremachine.io → 192.0.2.1        |
| AAAA  | 將域名指向 IPv6 地址                   | coremachine.io → 2001:db8::1      |
| CNAME | 將域名指向另一個域名（別名）           | www → your-project.manus.space    |
| MX    | 指定郵件服務器                         | mail.coremachine.io               |
| TXT   | 存儲文本信息（如 SPF、DKIM）           | v=spf1 include:_spf.google.com ~all |

---

*本文檔由 Core Machine Limited 提供，最後更新：2026-02-16*
