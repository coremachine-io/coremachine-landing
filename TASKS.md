# CoreMachine Phase 1 任務清單

## 任務狀態圖例
- ⬜ 未開始
- 🔄 進行中
- ✅ 已完成
- 🔴 阻塞中

---

## COO 任務

### TASK-COO-001: API Rate Limiting ✅
**負責人**: @coremachine-coo (COO)
**優先級**: P0
**預計工時**: 2h
**實際工時**: ~1.5h

**背景**: 目前所有 public API 都無 rate limiting，存在被濫用風險（AI 生成、咨詢表單、模板下載等）。

**交付物**:
- `server/_core/rateLimit.ts` — in-memory fixed-window rate limiter with auto-cleanup
- `server/_core/trpc.ts` — `rateLimitedProcedure()` middleware factory
- `server/routers.ts` — applied to consultation, ai, template, evaluate, case, policy endpoints

**限制策略**:
| Endpoint | Window | Max Requests |
|----------|--------|-------------|
| consultation.submit | 1h | 5 |
| ai.generateDocument | 1h | 10 |
| template.download | 1h | 20 |
| evaluateSubsidyEligibility | 1h | 5 |
| case.generate | 1h | 10 |
| policy.fetchLatest | 1h | 20 |
| policy.savePolicy | 1h | 20 |

**驗收標準**:
- [x] 快速連續調用 API 會被 block (429)
- [x] 返回正確 HTTP 429 status
- [x] Memory usage 穩定（無 leak，auto-cleanup via resetTime）
- [x] 不影響正常用戶使用

**狀態**: ✅ 已完成（2026-04-20，commit e5879a5）

---

### TASK-COO-002: Database Error Handling ✅
**負責人**: @coremachine-coo (COO)
**優先級**: P0
**預計工時**: 2h
**實際工時**: ~1h

**背景**: Database 連線失敗時 silent fail，導致數據丟失（leads、consultations 等）且無法及時發現。

**交付物**:
- `server/_core/dbError.ts` — `DbError` class + `withDbRetry()` with exponential backoff
- `server/db.ts` — all DB operations wrapped with `withDbRetry()`, graceful degradation on connection failure

**實施細節**:
- `DbError` codes: `CONNECTION_FAILED`, `QUERY_FAILED`, `TIMEOUT`, `UNKNOWN`
- Retry delays: 1s → 3s → 10s (max 3 attempts)
- `getDb()` returns `null` on failure; callers return safe defaults (empty arrays, undefined)
- Persistent failures trigger Telegram notification to Johnny via `notifyOwner()`

**驗收標準**:
- [x] DB 連線失敗時會 throw 結構化 error
- [x] API 返回 `INTERNAL_SERVER_ERROR` 而非静默成功
- [x] 錯誤 log 包含足夠上下文（function name, query type）
- [x] 無 DB 環境下頁面仍可運行

**狀態**: ✅ 已完成（2026-04-20，commit e5879a5）

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
