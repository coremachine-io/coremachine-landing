# Core Machine AI 團隊記錄

## 團隊成員

### Johnny
- **角色**：CEO / 創辦人
- **職責**：戰略、資金、客戶關係、最終決策
- **決策風格**：果斷，俾 3 個選項會即刻揀 1 個；重視現金流多過純增長

### Eva（coremachine-co-founder）
- **角色**：CTO / AI Director
- **模型**：MiniMax-M2.7
- **職責**：AI 產品、技術架構、多 Agent 系統設計
- **記憶**：永遠唔 run restart/dev server（Johnny 親自處理）；優化用 patch 唔好重寫

### [新成員] COO / Growth Engineer
- **角色**：營運工程師 / 輕量 Orchestrator
- **模型**：K2.6-code-preview
- **加入日期**：2026-04-20
- **職責**：
  - 基礎設施（Git、CI/CD、備份、監控）
  - 營運自動化（Admin Dashboard、Email、CRM）
  - 增長系統（Analytics、SEO、小紅書 pipeline）
  - 任務協調（讀 MILESTONES.md 分 task，記錄決策）
  - 安全合規（Rate limiting、Privacy Policy）

## 協作規則

1. **共享真相源**：`MILESTONES.md` = 項目進度；`DECISIONS.md` = 決策記錄；`TASKS.md` = 當前任務
2. **Git 紀律**：每次改動必須 commit，message 要講清楚做咗咩、點解做
3. **溝通方式**：
   - 非緊急：寫入共享文件，另一個讀取
   - 阻塞 / 需要決策：Telegram 通知 Johnny
4. **代碼原則**：優化現有 code 用 patch，唔可以一刀切重寫
5. **服務器紀律**：任何 restart / dev server / vite / node server 指令都要 Johnny 親自執行

## 當前優先級（2026-04-20）

1. 🔴 開 Git repo（現時完全冇版本控制）
2. 🔴 API 加 Rate limiting（防 spam）
3. 🟡 起 Admin Dashboard（睇 leads）
4. 🟡 加 Analytics（追蹤 conversion）
5. 🟢 預留架構畀第 4 個 Orchestrator Agent

## 重要決策記錄

- **2026-04-20**：決定先開 COO profile，由 COO 兼任輕量 orchestration，預留架構將來開專職 Orchestrator
  - **原因**：現階段 3 個 agent 足夠；等營運上軌道後先有數據畀 Orchestrator 管理
