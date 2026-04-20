# CoreMachine Phase 1 任務清單

## 任務狀態圖例
- ⬜ 未開始
- 🔄 進行中
- ✅ 已完成
- 🔴 阻塞中

---

## COO 任務

### TASK-COO-001: API Rate Limiting ⬜
**負責人**: @coremachine-coo (COO)
**優先級**: P0
**預計工時**: 2h

**背景**: 目前所有 public API 都無 rate limiting，存在被濫用風險（AI 生成、咨詢表單、模板下載等）。

**要求**:
1. 為所有 public mutation endpoints 加上 in-memory rate limiting（sliding window）
2. Key 來源優先序：user openId > IP address > fingerprint
3. 限制策略：
   - `consultation.submit`: 每 IP 每小時 5 次
   - `ai.generateDocument`: 每 user/IP 每小時 10 次（耗資源）
   - `template.download`: 每 IP 每小時 20 次
   - `member.evaluateSubsidyEligibility`: 每 IP 每小時 5 次
   - `case.generate`: 每 IP 每小時 10 次
   - `policy.fetchLatest`: 每 IP 每小時 30 次
4. 超過限制時返回 `429 Too Many Requests`，message 用戶語言
5. 用 Express req.ip 或 x-forwarded-for 提取 IP
6. 定期清理過期 record（避免 memory leak）

**驗收標準**:
- [ ] 快速連續調用 API 會被 block
- [ ] 返回正確 HTTP 429 status
- [ ] Memory usage 穩定（無 leak）
- [ ] 不影響正常用戶使用

---

### TASK-COO-002: Database Error Handling ⬜
**負責人**: @coremachine-coo (COO)
**優先級**: P0
**預計工時**: 2h

**背景**: Database 連線失敗時 silent fail，導致數據丟失（leads、consultations 等）且無法及時發現。

**要求**:
1. `getDb()` 增加 connection retry（指數退避，最多 3 次）
2. 建立 `DbError` class，區分：
   - `CONNECTION_FAILED` — 連線問題
   - `QUERY_FAILED` — SQL 執行失敗
   - `VALIDATION_FAILED` — 數據格式問題
3. 所有 db.ts 函數統一行為：DB 不可用時 **throw error**（不再 silent return undefined/[]）
4. API layer (routers.ts) 適當 catch 並返回用戶友好錯誤
5. 增加 `dbHealthCheck()` 函數供 monitoring 使用
6. 確保 local tooling（無 DB）仍可運行

**驗收標準**:
- [ ] DB 連線失敗時會 throw 結構化 error
- [ ] API 返回 `INTERNAL_SERVER_ERROR` 而非靜默成功
- [ ] 有 health check endpoint 或函數
- [ ] 錯誤 log 包含足夠上下文（function name, query type）

---

## EVA 任務

### TASK-EVA-001: AI Agent 錯誤處理 ✅
**負責人**: @coremachine-co-founder (EVA)
**優先級**: P0
**預計工時**: 3h

**要求**:
1. `invokeMiniMaxLLM()` 增加 retry + fallback ✅
2. MiniMax 失敗時 fallback 到 OpenAI（如有配置）✅ (retry + timeout applied to both)
3. 所有 AI router 的錯誤處理統一 ✅
4. 超時處理（30s timeout）✅

**交付物**:
- `server/_core/llm.ts` — fetchWithTimeout() + withRetry()
- `server/routers.ts` — case.generate + policy.fetchLatest fallback
- Commit: d28d7cb

**驗收標準**:
- [x] MiniMax 短暫失敗時自動重試 (1s → 3s → 10s exponential backoff)
- [x] 完全失敗時返回友好 demo data（唔係 error）
- [x] 30s timeout 保護
- [x] AI failure logs 有 [AI] prefix 方便 COO 監控

**狀態**: ✅ 已完成（2026-04-20）

---

*最後更新: 2026-04-20*
*Phase 1 目標: 消除 silent failures，建立基礎防禦層*
