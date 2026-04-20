import { notifyOwner } from "./notification";

export type DbErrorCode =
  | "CONNECTION_FAILED"
  | "QUERY_FAILED"
  | "TIMEOUT"
  | "UNKNOWN";

export class DbError extends Error {
  public readonly code: DbErrorCode;
  public readonly isOperational: boolean;

  constructor(message: string, code: DbErrorCode = "UNKNOWN", isOperational = true) {
    super(message);
    this.name = "DbError";
    this.code = code;
    this.isOperational = isOperational;
  }
}

const RETRY_DELAYS = [1000, 3000, 10000]; // 1s, 3s, 10s

function isConnectionRelatedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;
  return (
    /connection|connect|timeout|refused|network|closed/i.test(msg) ||
    /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ECONNRESET/i.test(msg)
  );
}

/**
 * Wrap a database operation with exponential-backoff retry.
 * Notifies Johnny via Telegram on persistent connection failures.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  context: string,
  notifyOnFailure = true
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const isConnectionError = isConnectionRelatedError(error);

      if (!isConnectionError || attempt === RETRY_DELAYS.length) {
        break;
      }

      console.warn(
        `[Database] ${context} failed (attempt ${attempt + 1}), retrying in ${RETRY_DELAYS[attempt]}ms...`
      );
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
    }
  }

  const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
  const isConnectionError = isConnectionRelatedError(lastError);

  if (isConnectionError && notifyOnFailure) {
    await notifyOwner({
      title: "🚨 Database Alert",
      content: `Operation: ${context}\nError: ${errorMessage}\nTime: ${new Date().toISOString()}`,
    }).catch(() => {});
  }

  const code: DbErrorCode = isConnectionError ? "CONNECTION_FAILED" : "QUERY_FAILED";
  throw new DbError(`Database operation failed: ${context}. ${errorMessage}`, code);
}
