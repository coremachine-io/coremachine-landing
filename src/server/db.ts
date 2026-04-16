import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertConsultation, consultations, InsertTemplateDownload, templateDownloads, InsertAIGeneration, aiGenerations } from "./drizzle/schema";

let _pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

async function getPool() {
  if (!_pool && process.env.DATABASE_URL) {
    try {
      _pool = mysql.createPool(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to create pool:", error);
      _pool = null;
    }
  }
  return _pool;
}

export async function getDb() {
  if (!_db) {
    const pool = await getPool();
    if (pool) {
      _db = drizzle(pool);
    }
  }
  return _db;
}

export async function createConsultation(data: InsertConsultation) {
  const db = await getDb();
  if (!db) { console.warn("[DB] Not available, skipping..."); return; }
  await db.insert(consultations).values(data);
}

export async function trackTemplateDownload(data: InsertTemplateDownload) {
  const db = await getDb();
  if (!db) { console.warn("[DB] Not available, skipping..."); return; }
  await db.insert(templateDownloads).values(data);
}

export async function trackAIGeneration(data: InsertAIGeneration) {
  const db = await getDb();
  if (!db) { console.warn("[DB] Not available, skipping..."); return; }
  try {
    await db.insert(aiGenerations).values(data);
  } catch (error) {
    console.error("[DB] Failed to track AI generation:", error);
  }
}
