# CoreMachine Operational Decisions

## Phase 1: Infrastructure Hardening (2026-04-20)

### DECISION-001: In-Memory Rate Limiting (Single-Instance)
**Context**: CoreMachine landing page runs on a single instance. Redis is overkill for current scale.
**Decision**: Implement fixed-window in-memory rate limiter in `server/_core/rateLimit.ts`.
**Limits**:
| Endpoint | Window | Max Requests |
|----------|--------|-------------|
| consultation | 1 hour | 5 |
| ai | 1 hour | 10 |
| template | 1 hour | 20 |
| evaluate | 1 hour | 5 |
| case | 1 hour | 10 |
| policy | 1 hour | 20 |

**Migration Path**: When moving to multi-instance, replace `Map` store with Redis (same interface).
**Rationale**: Protects against abuse without external dependency. Auto-cleanup of expired entries via `resetTime` comparison.

### DECISION-002: Rate Limit Key Strategy
**Decision**: Combine `req.ip` (or `X-Forwarded-For`) with `user.openId` when authenticated.
**Format**: `ip:<ip>|user:<openId>`
**Rationale**: Prevents unauthenticated abuse while allowing logged-in users their own quota.

### DECISION-003: Structured Database Errors
**Decision**: Create `DbError` class with specific error codes (`CONNECTION_FAILED`, `QUERY_FAILED`, `TIMEOUT`, `UNKNOWN`).
**Usage**: All DB operations in `server/db.ts` wrap errors in `DbError` for consistent handling.
**Rationale**: Enables tRPC to map DB errors to appropriate HTTP status codes and user-facing messages.

### DECISION-004: Exponential Backoff Retry
**Decision**: `withDbRetry()` uses delays `[1000ms, 3000ms, 10000ms]` (max 3 attempts total).
**Scope**: Applied to all DB operations in `server/db.ts`.
**Notification**: Persistent connection failures send Telegram alert to Johnny via `notifyOwner()`.
**Rationale**: MySQL connections can be transiently unavailable (e.g., pool exhaustion, network blip). Retry protects revenue by reducing false failures. Notify on final failure ensures human awareness.

### DECISION-005: Graceful Degradation on DB Failure
**Decision**: `getDb()` returns `null` on connection failure. All callers check `if (!db)` and return safe defaults (empty arrays, undefined, or silent skip).
**Rationale**: Landing page should remain functional even if DB is down. Critical paths (consultation submission, AI generation) log warnings but don't crash.

### DECISION-006: No Rate Limit on Read-Only Auth Queries
**Decision**: `auth.me` and `member.getCredits` remain as `publicProcedure` without rate limiting.
**Rationale**: These are lightweight, idempotent reads. Rate limiting them would harm legitimate user experience.

### DECISION-007: Telegram Bot-to-Bot Communication (Future)
**Context**: Telegram opened Bot-to-Bot Communication (Apr 2026). Article: https://linlog.top/article/402
**Decision**: Monitor for future multi-agent orchestration. Current filesystem + DB + human orchestration is sufficient for Phase 1.
**Prerequisite**: Before any bot-to-bot implementation, must have rate limiting (now done) and message deduplication.
**Rationale**: Telegram as message bus reduces infrastructure complexity, but requires anti-loop safeguards first.
