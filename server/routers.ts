import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createConsultation, trackTemplateDownload } from "./db";
import { sendConsultationEmail, sendAIGenerationEmail } from "./_core/email";
import { invokeMiniMaxLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 咨詢表單提交
  consultation: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "請輸入姓名"),
        contact: z.string().min(1, "請輸入聯絡方式"),
        email: z.union([z.string().email("請輸入有效電子郵件"), z.literal(""), z.undefined()]).optional().transform(v => v === "" ? undefined : v),
        needs: z.string().min(10, "請詳細描述您的需求（至少10字）"),
        language: z.enum(["zh-HK", "zh-CN"]).default("zh-HK"),
      }))
      .mutation(async ({ input }) => {
        try {
          // 儲存咨詢記錄
          await createConsultation({
            name: input.name,
            contact: input.contact,
            email: input.email || null,
            needs: input.needs,
            language: input.language,
            status: "pending",
          });

          // 發送電郵通知（可選 — 不影響咨詢提交）
          try {
            await sendConsultationEmail({
              name: input.name,
              contact: input.contact,
              email: input.email || "",
              needs: input.needs,
              language: input.language,
            });
          } catch (emailError) {
            console.warn("[Email] Failed to send consultation notification:", emailError);
          }

          // 發送 Telegram 通知給創辦人
          try {
            const langLabel = input.language === "zh-HK" ? "繁體中文" : "简体中文";
            await notifyOwner({
              title: "📝 新咨詢表單提交",
              content: `姓名：${input.name}\n聯絡方式：${input.contact}\n電子郵件：${input.email || "未提供"}\n需求：${input.needs}\n語言：${langLabel}\n時間：${new Date().toLocaleString("zh-HK")}`,
            });
          } catch (notifyError) {
            console.warn("[Notify] Failed to send Telegram notification:", notifyError);
          }

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

  // AI 文件生成
  ai: router({
    generateDocument: publicProcedure
      .input(z.object({
        documentType: z.enum(["subsidy_application", "personal_statement"]),
        language: z.enum(["zh-HK", "zh-CN"]),
        userInfo: z.object({
          name: z.string().min(1, "請輸入姓名"),
          age: z.number().optional(),
          background: z.string().optional(),
          businessIdea: z.string().optional(),
          experience: z.string().optional(),
          targetMarket: z.string().optional(),
          fundingNeeds: z.string().optional(),
          otherInfo: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          // 根據文件類型準備 LLM prompt
          let systemPrompt = "";
          let userPrompt = "";

          if (input.documentType === "subsidy_application") {
            systemPrompt = input.language === "zh-HK"
              ? "你係一位專業嘅前海創業補貼申請顧問。根據申請人嘅信息，生成一份專業、有說服力嘅補貼申請文件。文件應該突出申請人嘅優勢、創業計劃嘅可行性同對前海經濟發展嘅貢獻。"
              : "你是一位专业的前海创业补贴申请顾问。根据申请人的信息，生成一份专业、有说服力的补贴申请文件。文件应该突出申请人的优势、创业计划的可行性和对前海经济发展的贡献。";
            
            userPrompt = input.language === "zh-HK"
              ? `申請人信息：\n姓名：${input.userInfo.name}\n年齡：${input.userInfo.age || "未提供"}\n背景：${input.userInfo.background || "未提供"}\n創業理念：${input.userInfo.businessIdea || "未提供"}\n相關經驗：${input.userInfo.experience || "未提供"}\n目標市場：${input.userInfo.targetMarket || "未提供"}\n融資需求：${input.userInfo.fundingNeeds || "未提供"}\n其他信息：${input.userInfo.otherInfo || "未提供"}\n\n請生成一份完整嘅前海港澳青年補貼申請文件。`
              : `申请人信息：\n姓名：${input.userInfo.name}\n年龄：${input.userInfo.age || "未提供"}\n背景：${input.userInfo.background || "未提供"}\n创业理念：${input.userInfo.businessIdea || "未提供"}\n相关经验：${input.userInfo.experience || "未提供"}\n目标市场：${input.userInfo.targetMarket || "未提供"}\n融资需求：${input.userInfo.fundingNeeds || "未提供"}\n其他信息：${input.userInfo.otherInfo || "未提供"}\n\n请生成一份完整的前海港澳青年补贴申请文件。`;
          } else {
            systemPrompt = input.language === "zh-HK"
              ? "你係一位專業嘅創業導師。根據申請人嘅信息，撰寫一份有力嘅個人陳述，突出佢嘅創業決心、獨特優勢同對創業嘅理解。陳述應該真摯、有說服力，能夠打動評審委員會。"
              : "你是一位专业的创业导师。根据申请人的信息，撰写一份有力的个人陈述，突出他/她的创业决心、独特优势和对创业的理解。陈述应该真挚、有说服力，能够打动评审委员会。";
            
            userPrompt = input.language === "zh-HK"
              ? `申請人信息：\n姓名：${input.userInfo.name}\n年齡：${input.userInfo.age || "未提供"}\n背景：${input.userInfo.background || "未提供"}\n創業理念：${input.userInfo.businessIdea || "未提供"}\n相關經驗：${input.userInfo.experience || "未提供"}\n目標市場：${input.userInfo.targetMarket || "未提供"}\n融資需求：${input.userInfo.fundingNeeds || "未提供"}\n其他信息：${input.userInfo.otherInfo || "未提供"}\n\n請撰寫一份個人陳述，突出我嘅翻身故事同創業決心。`
              : `申请人信息：\n姓名：${input.userInfo.name}\n年龄：${input.userInfo.age || "未提供"}\n背景：${input.userInfo.background || "未提供"}\n创业理念：${input.userInfo.businessIdea || "未提供"}\n相关经验：${input.userInfo.experience || "未提供"}\n目标市场：${input.userInfo.targetMarket || "未提供"}\n融资需求：${input.userInfo.fundingNeeds || "未提供"}\n其他信息：${input.userInfo.otherInfo || "未提供"}\n\n请撰写一份个人陈述，突出我的翻身故事和创业决心。`;
          }

          // 調用 MiniMax LLM 生成文件
          const response = await invokeMiniMaxLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          });

          const baseResp = (response as any).base_resp;
          if (baseResp?.status_code !== 0 && baseResp?.status_code !== 200) {
            const errorMsg = baseResp?.status_msg || "MiniMax API error";
            console.error("[MiniMax] API error:", baseResp);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: input.language === "zh-HK"
                ? `AI 生成失敗：${errorMsg}`
                : `AI 生成失败：${errorMsg}`,
            });
          }

          const generatedContent = response.choices?.[0]?.message?.content || "";

          // 發送電郵通知（可選 — 不影響文件生成）
          try {
            await sendAIGenerationEmail({
              name: input.userInfo.name,
              documentType: input.documentType,
              language: input.language,
              businessIdea: input.userInfo.businessIdea,
            });
          } catch (emailError) {
            console.warn("[Email] Failed to send AI generation notification:", emailError);
          }

          // 發送 Telegram 通知給創辦人
          try {
            const docLabel = input.documentType === "subsidy_application"
              ? (input.language === "zh-HK" ? "補貼申請文件" : "补贴申请文件")
              : (input.language === "zh-HK" ? "個人陳述文件" : "个人陈述文件");
            const langLabel = input.language === "zh-HK" ? "繁體中文" : "简体中文";
            await notifyOwner({
              title: "🤖 AI 文件生成請求",
              content: `姓名：${input.userInfo.name}\n文件類型：${docLabel}\n語言：${langLabel}\n創業理念：${input.userInfo.businessIdea || "未提供"}\n時間：${new Date().toLocaleString("zh-HK")}`,
            });
          } catch (notifyError) {
            console.warn("[Notify] Failed to send Telegram notification:", notifyError);
          }

          return {
            success: true,
            content: generatedContent,
            filename: `${input.documentType}_${input.language}_${Date.now()}.md`,
          };
        } catch (error) {
          console.error("AI document generation error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: input.language === "zh-HK" 
              ? "生成失敗，請稍後再試" 
              : "生成失败，请稍后再试",
          });
        }
      }),
  }),

  // AI 模板下載
  template: router({
    download: publicProcedure
      .input(z.object({
        templateType: z.enum(["subsidy_application", "personal_statement"]),
        language: z.enum(["zh-HK", "zh-CN"]),
        email: z.string().email().optional().or(z.literal("")),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // 追蹤下載記錄
          await trackTemplateDownload({
            templateType: input.templateType,
            language: input.language,
            email: input.email || null,
            ipAddress: input.ipAddress || null,
            userAgent: input.userAgent || null,
          });

          // 讀取模板文件
          const fs = await import("fs/promises");
          const path = await import("path");
          const templatePath = path.join(
            process.cwd(),
            "server",
            "templates",
            `${input.templateType}_${input.language}.md`
          );
          
          const content = await fs.readFile(templatePath, "utf-8");
          
          return { 
            success: true, 
            content,
            filename: `${input.templateType}_${input.language}.md`
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
});

export type AppRouter = typeof appRouter;
