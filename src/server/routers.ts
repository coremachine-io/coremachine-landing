import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createConsultation, trackTemplateDownload, trackAIGeneration } from "./db";
import { notifyOwner } from "./_core/notification";
import { router, publicProcedure } from "./_core/trpc";

// ========== Prompt Builders ==========
function buildSubsidyPrompt(input: AIUserInput): string {
  const educationLabel = {
    associate: "副學士/高級文憑",
    bachelor: "學士學位",
    master: "碩士學位",
    doctorate: "博士學位",
  }[input.education];

  const isFounderText = input.isFounder ? "創業者" : "受薪僱員";
  const companyText = input.companyName || input.targetCompany || "前海合作區企業";

  return `你是 Johnny，CoreMachine.io AI 共同創辦人。

根據以下用戶真實資料，生成一份個人化嘅前海港澳青年補貼申請文件（填空版）：

【用戶資料】
姓名：${input.name}
年齡：${input.age}歲
學歷：${educationLabel}
香港工作經驗：${input.experience}
北上原因：${input.motivation}
身份：${isFounderText}
公司：${companyText}
申請目標：${input.goals === "both" ? "補貼 + OPC 8個0" : input.goals === "opc" ? "OPC 8個0資助" : "前海補貼申請"}

【要求】
- 語言：${input.language === "zh-HK" ? "繁體中文（香港口語風格）" : "簡體中文（內地書面風格）"}
- 保留所有 [填空] 標記，但根據用戶資料填入確定內容
- 文件結構：申請資格摘要 → 所需文件清單 → 線上申請步驟 → 重要提醒 → 核芯機器聯絡
- 突出用戶個人背景與前海嘅契合度
- 以 Core Machine Limited 專業服務作結尾

立即輸出完整 Markdown，唔好加任何解釋或前言。`;
}

function buildPersonalStatementPrompt(input: AIUserInput): string {
  const educationLabel = {
    associate: "副學士/高級文憑",
    bachelor: "學士學位",
    master: "碩士學位",
    doctorate: "博士學位",
  }[input.education];

  const isFounderText = input.isFounder ? "創業者" : "受薪僱員";
  const companyText = input.companyName || input.targetCompany || "前海合作區企業";
  const businessText = input.isFounder
    ? `我創辦咗 ${companyText}，希望利用 AI 技術幫助更多港澳青年落地前海`
    : `我加入咗 ${companyText}，希望喺前海發揮我所長`;

  return `你是 Johnny，CoreMachine.io AI 共同創辦人。

根據以下用戶真實資料，生成一份個人化、有感情嘅前海補貼申請個人陳述：

【用戶資料】
姓名：${input.name}
年齡：${input.age}歲
學歷：${educationLabel}
香港工作經驗：${input.experience}
北上原因：${input.motivation}
身份：${isFounderText}
公司：${companyText}
申請目標：${input.goals === "both" ? "補貼 + OPC 8個0" : input.goals === "opc" ? "OPC 8個0資助" : "前海補貼申請"}

【要求】
- 語言：${input.language === "zh-HK" ? "繁體中文（香港創業者口吻，真摯動人）" : "簡體中文（內地創業者口吻，真誠感人）"}
- 長度：800-1000字
- 結構：
  1. 開場：簡單自我介紹 + 北上決心
  2. 背景：香港工作經驗 + 遇到嘅瓶頸點解選擇前海
  3. 計劃：${businessText}
  4. 為何選前海：具體政策/地理/產業原因
  5. 決心與承諾：長期扎根 + 回饋社會
  6. 結語：感性呼籲審批
- 語氣：真誠、謙遜、有畫面感，唔好空泛
- 將 ${input.name} 嘅個人故事同前海發展結合

立即輸出完整 Markdown 個人陳述，唔好加任何解釋或前言。`;
}

// ========== Hermes API Call ==========
async function callJohnnyAgent(prompt: string): Promise<string> {
  const apiUrl = process.env.HERMES_API_URL || "http://localhost:3001";
  const apiKey = process.env.HERMES_API_KEY || "dev-key";
  const model = process.env.HERMES_MODEL || "gemma-4-e2b-it-4bit";

  try {
    const response = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "你是 Johnny，CoreMachine.io AI 共同創辦人。根據用戶資料生成個人化文件，直接輸出 Markdown，唔好解釋。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hermes API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Hermes API call failed:", error);
    // Fallback: return a placeholder message
    return `【系統提示】Johnny Agent 目前忙碌，請稍後再試，或直接聯絡我哋：\n- WhatsApp: +852 9144 4340\n- Email: hello@coremachine.io`;
  }
}

// ========== Schema ==========
const aiUserInputSchema = z.object({
  templateType: z.enum(["subsidy_application", "personal_statement"]),
  language: z.enum(["zh-HK", "zh-CN"]),
  name: z.string().min(1),
  age: z.number().min(18).max(60),
  education: z.enum(["associate", "bachelor", "master", "doctorate"]),
  industry: z.string().min(1),
  experience: z.string().min(10, "請詳細描述工作經驗（至少10字）"),
  motivation: z.string().min(10, "請描述北上原因（至少10字）"),
  isFounder: z.boolean(),
  companyName: z.string().optional(),
  targetCompany: z.string().optional(),
  goals: z.enum(["subsidy", "opc", "both"]),
  email: z.string().email().optional().or(z.literal("")),
});

type AIUserInput = z.infer<typeof aiUserInputSchema>;

// ========== Router ==========
export const appRouter = router({
  // --- Consultation ---
  consultation: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "請輸入姓名"),
          contact: z.string().min(1, "請輸入聯絡方式"),
          email: z.string().email("請輸入有效電子郵件").optional().or(z.literal("")),
          needs: z.string().min(10, "請詳細描述您的需求（至少10字）"),
          language: z.enum(["zh-HK", "zh-CN"]).default("zh-HK"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createConsultation({
            name: input.name,
            contact: input.contact,
            email: input.email || null,
            needs: input.needs,
            language: input.language,
            status: "pending",
          });

          await notifyOwner({
            title: "📧 新的咨詢表單提交",
            content: `**姓名**: ${input.name}\n**聯絡方式**: ${input.contact}\n**電子郵件**: ${input.email || "未提供"}\n**需求**: ${input.needs}\n**語言**: ${input.language === "zh-HK" ? "繁體中文" : "簡體中文"}`,
          });

          return { success: true, message: "提交成功，我哋會儘快聯絡您！" };
        } catch (error) {
          console.error("Consultation submission error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "提交失敗，請稍後再試",
          });
        }
      }),
  }),

  // --- Template Download ---
  template: router({
    download: publicProcedure
      .input(
        z.object({
          templateType: z.enum(["subsidy_application", "personal_statement"]),
          language: z.enum(["zh-HK", "zh-CN"]),
          email: z.string().email().optional().or(z.literal("")),
          ipAddress: z.string().optional(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await trackTemplateDownload({
            templateType: input.templateType,
            language: input.language,
            email: input.email || null,
            ipAddress: input.ipAddress || null,
            userAgent: input.userAgent || null,
          });

          // Try to read template file, fallback to built-in content
          let content = "";
          const fs = await import("fs/promises").catch(() => null);
          const path = await import("path").catch(() => null);

          if (fs && path) {
            try {
              const templatePath = path.join(
                process.cwd(),
                "server",
                "templates",
                `${input.templateType}_${input.language}.md`
              );
              content = await fs.readFile(templatePath, "utf-8");
            } catch {
              // Template file not found, use built-in fallback
              content = getBuiltInTemplate(input.templateType, input.language);
            }
          } else {
            content = getBuiltInTemplate(input.templateType, input.language);
          }

          return {
            success: true,
            content,
            filename: `${input.templateType}_${input.language}.md`,
          };
        } catch (error) {
          console.error("Template download error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "下載失敗，請稍後再試",
          });
        }
      }),
  }),

  // --- AI Document Generation ---
  ai: router({
    generateDocument: publicProcedure
      .input(aiUserInputSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // 1. Track the generation
          const ipAddress =
            ctx.req?.headers.get("x-forwarded-for")?.toString().split(",")[0] ||
            undefined;
          const userAgent = ctx.req?.headers.get("user-agent");

          await trackAIGeneration({
            templateType: input.templateType,
            language: input.language,
            userName: input.name,
            userAge: input.age,
            userEducation: input.education,
            userIndustry: input.industry,
            userExperience: input.experience,
            userMotivation: input.motivation,
            isFounder: input.isFounder ? "yes" : "no",
            companyName: input.companyName || input.targetCompany || null,
            goals: input.goals,
            email: input.email || null,
            ipAddress: ipAddress || null,
            createdAt: new Date(),
          });

          // 2. Build prompt
          const prompt =
            input.templateType === "subsidy_application"
              ? buildSubsidyPrompt(input)
              : buildPersonalStatementPrompt(input);

          // 3. Call Johnny Agent
          const markdownContent = await callJohnnyAgent(prompt);

          // 4. Build full document
          const templateName =
            input.templateType === "subsidy_application"
              ? "前海補貼申請文件"
              : "個人陳述";
          const langLabel = input.language === "zh-HK" ? "繁體" : "簡體";
          const filename = `${input.name}_${templateName}_${langLabel}_${Date.now()}.md`;

          const fullContent = `---
生成時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Hong_Kong" })}
由 Core Machine Limited AI（Johnny）自動生成
聯絡我們：hello@coremachine.io | WhatsApp: +852 9144 4340
---

${markdownContent}

---
*本文件由 Core Machine Limited AI 助手根據您提供的資料自動生成，僅供參考。*
*具體申請詳情請以深圳市前海管理局官方發布為準。*
*如需專業代辦服務，歡迎聯絡我哋：一站式申請代辦，確保一次通過。*
`;

          // 5. Notify owner
          await notifyOwner({
            title: "🤖 新 AI 文件生成",
            content: `**用戶**: ${input.name}\n**類型**: ${templateName}\n**身份**: ${input.isFounder ? "創業者" : "受薪者"}\n**目標**: ${input.goals}\n**Email**: ${input.email || "未提供"}`,
          });

          return {
            success: true,
            content: fullContent,
            filename,
            message:
              input.language === "zh-HK"
                ? "個人化文件已生成！"
                : "个人化文件已生成！",
          };
        } catch (error) {
          console.error("AI generation error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              input.language === "zh-HK"
                ? "生成失敗，請稍後再試或聯絡我哋直接代辦"
                : "生成失败，请稍后再试或联系我们直接代办",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

// ========== Built-in Template Fallbacks ==========
function getBuiltInTemplate(
  type: "subsidy_application" | "personal_statement",
  language: "zh-HK" | "zh-CN"
): string {
  if (type === "subsidy_application") {
    return language === "zh-HK"
      ? `# 前海港澳青年補貼申請文件模板（繁體中文）

## 申請資格摘要

### 基本條件
1. **身份要求**：45歲以下、有中國國籍嘅香港永久性居民
2. **學歷要求**：至少有副學士或高級文憑學歷
3. **就業/創業要求**：
   - **就業人士**：同前海合作區內嘅公司簽訂一年以上勞動合同，並連續交社保至少6個月
   - **創業者**：在公司中持有至少25%嘅股份，並連續交社保至少6個月

### 補貼類型與金額
- **就業補貼**：根據學歷發放（學士每月¥3,000），最多3年
- **居住補貼**：每月¥1,000，最多3年
- **生活補貼**：每月¥2,000，最多3年

**總計：每月最高可獲¥6,000補貼，持續3年**

---
*本模板由 Core Machine Limited 提供*
`
      : `# 前海港澳青年补贴申请文件模板（简体中文）

## 申请资格摘要

### 基本条件
1. **身份要求**：45周岁以下、具有中国国籍的香港永久性居民
2. **学历要求**：至少具备副学士或高级文凭学历
3. **就业/创业要求**：
   - **就业人士**：与前海合作区内的公司签订一年以上劳动合同，并连续缴纳社保至少6个月
   - **创业者**：在公司中持有不低于25%的股份，并连续缴纳社保至少6个月

### 补贴类型与金额
- **就业补贴**：根据学历发放（学士每月¥3,000），最多3年
- **居住补贴**：每月¥1,000，最多3年
- **生活补贴**：每月¥2,000，最多3年

**总计：每月最高可获¥6,000补贴，持续3年**

---
*本模板由 Core Machine Limited 提供*
`;
  } else {
    return language === "zh-HK"
      ? `# 前海港澳青年補貼申請 - 個人陳述模板（繁體中文）

## 關於支持港澳青年在前海發展的個人陳述

尊敬的深圳市前海管理局審核團隊：

您好！我叫 [你的名字]，是一名 [你的年齡] 歲的香港永久性居民。今天，我懷著對未來的憧憬和破釜沉舟的決心，申請前海為港澳青年提供的補貼。

---
*本模板由 Core Machine Limited 提供*
`
      : `# 前海港澳青年补贴申请 - 个人陈述模板（简体中文）

## 关于支持港澳青年在前海发展的个人陈述

尊敬的深圳市前海管理局审核团队：

您好！我叫 [你的名字]，是一名 [你的年龄] 岁的香港永久性居民。今天，我怀着对未来的憧憬和破釜沉舟的决心，申请前海为港澳青年提供的补贴。

---
*本模板由 Core Machine Limited 提供*
`;
  }
}
