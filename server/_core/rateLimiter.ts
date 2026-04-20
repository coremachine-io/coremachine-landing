import rateLimit from "express-rate-limit";
import type { Request } from "express";

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function getRequestPath(req: Request): string {
  return req.originalUrl || req.path || req.url || "";
}

const RATE_LIMIT_MESSAGES = {
  general: "請求過於頻繁，請稍後再試",
  contact: "咨詢提交次數過多，請1小時後再試",
  evaluate: "評估次數過多，請1小時後再試",
};

/**
 * General rate limiter for /api/trpc/*
 * 100 requests per 15 minutes per IP
 * Skips specific endpoints that have their own stricter limits
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  skip: (req) => {
    const path = getRequestPath(req);
    return path.includes("consultation.submit") || path.includes("evaluateSubsidyEligibility");
  },
  handler: (_req, res) => {
    res.status(429).json({
      message: RATE_LIMIT_MESSAGES.general,
      code: "TOO_MANY_REQUESTS",
    });
  },
});

/**
 * Contact form rate limiter
 * 5 requests per hour per IP
 * Applies to: /api/trpc/consultation.submit
 */
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  skip: (req) => !getRequestPath(req).includes("consultation.submit"),
  handler: (_req, res) => {
    res.status(429).json({
      message: RATE_LIMIT_MESSAGES.contact,
      code: "TOO_MANY_REQUESTS",
    });
  },
});

/**
 * Evaluate rate limiter
 * 3 requests per hour per IP
 * Applies to: /api/trpc/member.evaluateSubsidyEligibility
 */
export const evaluateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  skip: (req) => !getRequestPath(req).includes("evaluateSubsidyEligibility"),
  handler: (_req, res) => {
    res.status(429).json({
      message: RATE_LIMIT_MESSAGES.evaluate,
      code: "TOO_MANY_REQUESTS",
    });
  },
});
