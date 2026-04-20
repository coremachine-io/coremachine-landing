/**
 * In-memory rate limiter with fixed-window + automatic cleanup.
 * Designed for single-instance deployments. For multi-instance,
 * migrate to Redis-backed limiter.
 */

import { TRPCError } from "@trpc/server";
import type { Request } from "express";

export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store: key -> record
const store = new Map<string, RateLimitRecord>();

// Default configurations per endpoint category
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  consultation: { windowMs: 60 * 60 * 1000, maxRequests: 5 },      // 5/hour
  ai:           { windowMs: 60 * 60 * 1000, maxRequests: 10 },     // 10/hour
  template:     { windowMs: 60 * 60 * 1000, maxRequests: 20 },     // 20/hour
  evaluate:     { windowMs: 60 * 60 * 1000, maxRequests: 5 },      // 5/hour
  case:         { windowMs: 60 * 60 * 1000, maxRequests: 10 },     // 10/hour
  policy:       { windowMs: 60 * 60 * 1000, maxRequests: 30 },     // 30/hour
  auth:         { windowMs: 60 * 60 * 1000, maxRequests: 20 },     // 20/hour (login/logout)
  default:      { windowMs: 60 * 60 * 1000, maxRequests: 60 },     // 60/hour
};

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function buildKey(endpoint: string, identifier: string): string {
  return `rl:${endpoint}:${identifier}`;
}

export function checkRateLimit(
  endpoint: string,
  identifier: string,
  config?: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; retryAfterMs: number } {
  const now = Date.now();
  const key = buildKey(endpoint, identifier);
  const limit = config || RATE_LIMITS[endpoint] || RATE_LIMITS.default;

  const record = store.get(key);

  // Window expired or first request — start fresh
  if (!record || now >= record.resetTime) {
    const resetTime = now + limit.windowMs;
    store.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: limit.maxRequests - 1,
      resetTime,
      retryAfterMs: 0,
    };
  }

  // Within window — check limit
  if (record.count >= limit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfterMs: record.resetTime - now,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: limit.maxRequests - record.count,
    resetTime: record.resetTime,
    retryAfterMs: 0,
  };
}

/**
 * Extract rate-limit identifier from tRPC context.
 * Priority: authenticated user openId > IP address.
 */
export function getRateLimitIdentifier(req: Request, userOpenId?: string | null): string {
  if (userOpenId) return `user:${userOpenId}`;
  return `ip:${getClientIp(req)}`;
}

/**
 * Create a tRPC-compatible rate limit error.
 */
export function createRateLimitError(retryAfterMs: number, language?: string): TRPCError {
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);
  const isHK = language !== "zh-CN";
  const message = isHK
    ? `請求過於頻繁，請 ${retryAfterSec} 秒後再試`
    : `请求过于频繁，请 ${retryAfterSec} 秒后再试`;

  return new TRPCError({
    code: "TOO_MANY_REQUESTS",
    message,
  });
}

// Periodic cleanup of expired entries to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function cleanupExpiredEntries() {
  const now = Date.now();
  let cleaned = 0;
  const entries = Array.from(store.entries());
  for (const [key, record] of entries) {
    if (now >= record.resetTime) {
      store.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[RateLimit] Cleaned up ${cleaned} expired entries. Active: ${store.size}`);
  }
}

setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);

// Export store size for monitoring/debugging
export function getRateLimitStoreSize(): number {
  return store.size;
}
