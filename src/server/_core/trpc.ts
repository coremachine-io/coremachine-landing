import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts: FetchCreateContextFnOptions) {
  return {
    req: opts.req,
    res: opts.resHeaders,
    user: null,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
