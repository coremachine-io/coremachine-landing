import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contact: varchar("contact", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  needs: text("needs").notNull(),
  language: mysqlEnum("language", ["zh-HK", "zh-CN"]).default("zh-HK").notNull(),
  status: mysqlEnum("status", ["pending", "contacted", "converted"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * AI 模板下載記錄表
 */
export const templateDownloads = mysqlTable("templateDownloads", {
  id: int("id").autoincrement().primaryKey(),
  templateType: mysqlEnum("templateType", ["subsidy_application", "personal_statement"]).notNull(),
  language: mysqlEnum("language", ["zh-HK", "zh-CN"]).notNull(),
  email: varchar("email", { length: 320 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TemplateDownload = typeof templateDownloads.$inferSelect;
export type InsertTemplateDownload = typeof templateDownloads.$inferInsert;

/**
 * AI 文件生成記錄表
 */
export const aiGenerations = mysqlTable("aiGenerations", {
  id: int("id").autoincrement().primaryKey(),
  templateType: mysqlEnum("templateType", ["subsidy_application", "personal_statement"]).notNull(),
  language: mysqlEnum("language", ["zh-HK", "zh-CN"]).notNull(),
  userName: varchar("userName", { length: 100 }),
  userAge: int("userAge"),
  userEducation: varchar("userEducation", { length: 50 }),
  userIndustry: varchar("userIndustry", { length: 100 }),
  userExperience: text("userExperience"),
  userMotivation: text("userMotivation"),
  isFounder: mysqlEnum("isFounder", ["yes", "no"]).default("no"),
  companyName: varchar("companyName", { length: 200 }),
  goals: mysqlEnum("goals", ["subsidy", "opc", "both"]).default("subsidy"),
  email: varchar("email", { length: 320 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIGeneration = typeof aiGenerations.$inferSelect;
export type InsertAIGeneration = typeof aiGenerations.$inferInsert;
