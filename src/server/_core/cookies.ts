import { parse, serialize } from "cookie";

export const COOKIE_NAME = "session";

export function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return {};
  const cookies = parse(cookieHeader);
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(cookies)) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}

export function serializeCookie(name: string, value: string, options: Record<string, unknown> = {}): string {
  return serialize(name, value, options as Parameters<typeof serialize>[2]);
}
