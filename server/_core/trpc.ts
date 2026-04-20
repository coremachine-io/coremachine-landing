import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  createRateLimitError,
  type RateLimitConfig,
} from "./rateLimit";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

// Rate-limit middleware factory
function rateLimit(endpoint: string, config?: RateLimitConfig) {
  return t.middleware(async opts => {
    const { ctx, next } = opts;
    const identifier = getRateLimitIdentifier(
      ctx.req as unknown as import("express").Request,
      ctx.user?.openId
    );
    const result = checkRateLimit(endpoint, identifier, config);

    if (!result.allowed) {
      throw createRateLimitError(result.retryAfterMs);
    }

    return next();
  });
}

/**
 * Create a rate-limited procedure builder.
 * Usage: rateLimitedProcedure("consultation").mutation(...)
 */
export function rateLimitedProcedure(endpoint: string, config?: RateLimitConfig) {
  return t.procedure.use(rateLimit(endpoint, config));
}
