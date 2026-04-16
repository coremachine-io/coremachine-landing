import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 咨詢表單提交記錄表
 * 用於存儲潛在客戶的咨詢信息
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contact: varchar("contact", { length: 255 }).notNull(), // 電話或微信
  email: varchar("email", { length: 320 }),
  needs: text("needs").notNull(), // 客戶需求描述
  language: mysqlEnum("language", ["zh-HK", "zh-CN"]).default("zh-HK").notNull(),
  status: mysqlEnum("status", ["pending", "contacted", "converted"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * AI 模板下載記錄表
 * 用於追蹤用戶下載行為，分析引流效果
 */
export const templateDownloads = mysqlTable("templateDownloads", {
  id: int("id").autoincrement().primaryKey(),
  templateType: mysqlEnum("templateType", ["subsidy_application", "personal_statement"]).notNull(),
  language: mysqlEnum("language", ["zh-HK", "zh-CN"]).notNull(),
  email: varchar("email", { length: 320 }), // 可選，用於後續營銷
  ipAddress: varchar("ipAddress", { length: 45 }), // 用於去重分析
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TemplateDownload = typeof templateDownloads.$inferSelect;
export type InsertTemplateDownload = typeof templateDownloads.$inferInsert;