import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, consultations, InsertConsultation, templateDownloads, InsertTemplateDownload, subscriptions, InsertSubscription, userCredits, InsertUserCredit } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * 咨詢表單相關查詢
 */
export async function createConsultation(data: InsertConsultation) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create consultation: database not available");
    return;
  }
  
  try {
    const result = await db.insert(consultations).values(data);
    return result;
  } catch (error) {
    console.warn("[Database] Cannot create consultation: database not available", error);
    return;
  }
}

export async function getAllConsultations() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(consultations).orderBy(consultations.createdAt);
}

/**
 * 模板下載相關查詢
 */
export async function trackTemplateDownload(data: InsertTemplateDownload) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track template download: database not available");
    return;
  }
  
  try {
    const result = await db.insert(templateDownloads).values(data);
    return result;
  } catch (error) {
    console.warn("[Database] Cannot track template download: database not available", error);
    return;
  }
}

export async function getDownloadStats() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(templateDownloads).orderBy(templateDownloads.createdAt);
}

// ============================================================
// Subscriptions 管理
// ============================================================

export async function createOrUpdateSubscription(data: InsertSubscription): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create subscription: database not available");
    return;
  }

  try {
    await db.insert(subscriptions).values(data).onDuplicateKeyUpdate({
      set: {
        plan: data.plan,
        status: data.status,
        stripeSubscriptionId: data.stripeSubscriptionId ?? undefined,
        stripeCustomerId: data.stripeCustomerId ?? undefined,
        currentPeriodStart: data.currentPeriodStart ?? undefined,
        currentPeriodEnd: data.currentPeriodEnd ?? undefined,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to create/update subscription:", error);
    throw error;
  }
}

export async function getSubscriptionByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveSubscription(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.openId, openId))
    .limit(1);

  const sub = result.length > 0 ? result[0] : undefined;
  if (!sub) return undefined;

  // 檢查是否已過期
  if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < new Date()) {
    return undefined;
  }

  return sub.status === "active" ? sub : undefined;
}

// ============================================================
// Credits 管理
// ============================================================

const STARTER_CREDITS = 10;

export async function getCredits(openId: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.openId, openId))
    .limit(1);

  return result.length > 0 ? Math.max(0, result[0].balance) : 0;
}

export async function deductCredit(openId: string): Promise<{ success: boolean; remaining: number }> {
  const db = await getDb();
  if (!db) return { success: false, remaining: 0 };

  const current = await getCredits(openId);
  if (current <= 0) {
    return { success: false, remaining: 0 };
  }

  try {
    await db
      .insert(userCredits)
      .values({ openId, balance: current - 1, totalUsed: current })
      .onDuplicateKeyUpdate({
        set: {
          balance: current - 1,
          totalUsed: current,
          updatedAt: new Date(),
        },
      });
    return { success: true, remaining: current - 1 };
  } catch (error) {
    console.error("[Database] Failed to deduct credit:", error);
    return { success: false, remaining: current };
  }
}

export async function addCredits(openId: string, amount: number = STARTER_CREDITS): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add credits: database not available");
    return;
  }

  const current = await getCredits(openId);

  try {
    await db
      .insert(userCredits)
      .values({ openId, balance: current + amount, totalUsed: 0 })
      .onDuplicateKeyUpdate({
        set: {
          balance: current + amount,
          totalUsed: 0,
          updatedAt: new Date(),
        },
      });
    console.log(`[Credits] Added ${amount} credits to ${openId}. New balance: ${current + amount}`);
  } catch (error) {
    console.error("[Database] Failed to add credits:", error);
    throw error;
  }
}

export async function hasActiveSubscription(openId: string): Promise<boolean> {
  const sub = await getActiveSubscription(openId);
  if (!sub) return false;
  return sub.plan === "pro" || sub.plan === "pro_monthly";
}

export async function canUseAI(openId: string): Promise<{ allowed: boolean; reason?: string }> {
  // Pro 用戶無限使用
  if (await hasActiveSubscription(openId)) {
    return { allowed: true };
  }

  // Starter 用戶檢查 credits
  const credits = await getCredits(openId);
  if (credits <= 0) {
    return {
      allowed: false,
      reason: "您的 Starter 配額已用完，請升級至 Pro 或等到下個訂閱週期",
    };
  }

  return { allowed: true };
}
