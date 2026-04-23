import { Resend } from "resend";
import { ENV } from "./env";

const resend = new Resend(ENV.resendApiKey);

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Sends an email via Resend.
 * Returns true if sent successfully, false otherwise.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return false;
  }

  if (!payload.to || !payload.subject || !payload.html) {
    console.warn("[Email] Missing required fields, skipping");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: ENV.notificationEmailFrom || "Core Machine <onboarding@resend.dev>",
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return false;
    }

    console.log(`[Email] Sent to ${payload.to}: ${payload.subject}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}

/**
 * Sends a consultation notification email.
 */
export async function sendConsultationEmail(params: {
  name: string;
  contact: string;
  email: string;
  needs: string;
  language: "zh-HK" | "zh-CN";
}): Promise<boolean> {
  const { name, contact, email, needs, language } = params;
  const isHK = language === "zh-HK";

  const subject = isHK
    ? "📧 新的咨詢表單提交 — Core Machine 官網"
    : "📧 新的咨询表单提交 — Core Machine 官网";

  const html = `
<!DOCTYPE html>
<html lang="${isHK ? "zh-HK" : "zh-CN"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #e2e8f0; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 20px; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .value { font-size: 16px; color: #f3f4f6; }
    .needs-box { background: #1f2937; border-radius: 8px; padding: 16px; margin-top: 8px; }
    .needs-box .value { white-space: pre-wrap; word-break: break-word; }
    .footer { padding: 16px 24px; border-top: 1px solid #1f2937; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isHK ? "📧 新的咨詢表單提交" : "📧 新的咨询表单提交"}</h1>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">${isHK ? "姓名" : "姓名"}</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">${isHK ? "聯絡方式" : "联络方式"}</div>
        <div class="value">${escapeHtml(contact)}</div>
      </div>
      <div class="field">
        <div class="label">${isHK ? "電子郵件" : "电子邮件"}</div>
        <div class="value">${email ? escapeHtml(email) : (isHK ? "未提供" : "未提供")}</div>
      </div>
      <div class="field">
        <div class="label">${isHK ? "需求描述" : "需求描述"}</div>
        <div class="needs-box">
          <div class="value">${escapeHtml(needs)}</div>
        </div>
      </div>
      <div class="field">
        <div class="label">${isHK ? "語言" : "语言"}</div>
        <div class="value">${isHK ? "繁體中文" : "简体中文"}</div>
      </div>
    </div>
    <div class="footer">
      ${isHK ? "此郵件由 Core Machine 官網自動發送" : "此邮件由 Core Machine 官网自动发送"} — ${new Date().toLocaleString(isHK ? "zh-HK" : "zh-CN")}
    </div>
  </div>
</body>
</html>
`;

  return sendEmail({
    to: ENV.notificationEmailTo,
    subject,
    html,
  });
}

/**
 * Sends the AI-generated document directly to the user's email.
 */
export async function sendAIDocumentEmail(params: {
  toEmail: string;
  name: string;
  documentType: "subsidy_application" | "personal_statement";
  language: "zh-HK" | "zh-CN";
  documentContent: string;
}): Promise<boolean> {
  const { toEmail, name, documentType, language, documentContent } = params;
  if (!toEmail) return false;

  const isHK = language === "zh-HK";

  const docLabel = documentType === "subsidy_application"
    ? (isHK ? "前海創業補貼申請文件" : "前海创业补贴申请文件")
    : (isHK ? "個人陳述文件" : "个人陈述文件");

  const subject = isHK
    ? `✅ 你的 ${docLabel} — Core Machine AI`
    : `✅ 你的 ${docLabel} — Core Machine AI`;

  // Convert markdown content to simple HTML for email
  const contentHtml = escapeHtml(documentContent)
    .replace(/\n\n/g, '</p><p style="margin: 16px 0; line-height: 1.8; color: #374151;">')
    .replace(/\n/g, '<br/>');

  const html = `
<!DOCTYPE html>
<html lang="${isHK ? "zh-HK" : "zh-CN"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1f2937; margin: 0; padding: 0; }
    .wrapper { max-width: 680px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px; }
    .doc-label { display: inline-block; background: #f3f4f6; color: #6b7280; font-size: 12px; padding: 4px 12px; border-radius: 20px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
    .doc-content { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; font-size: 15px; line-height: 1.8; color: #374151; white-space: pre-wrap; word-break: break-word; }
    .doc-content p { margin: 16px 0; }
    .cta { text-align: center; margin-top: 32px; }
    .cta a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; }
    .cta a:hover { background: #4f46e5; }
    .footer { padding: 24px 40px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🎉 ${isHK ? "你的文件已生成" : "你的文件已生成"}</h1>
      <p>${isHK ? "由 Core Machine AI 為你量身撰寫" : "由 Core Machine AI 为你量身撰写"}</p>
    </div>
    <div class="body">
      <p class="doc-label">${docLabel}</p>
      <div class="doc-content">
        <p style="margin: 16px 0; line-height: 1.8; color: #374151;">${contentHtml}</p>
      </div>
      <div class="cta">
        <a href="${isHK ? "https://coremachine.io" : "https://coremachine.io"}">${isHK ? "了解更多 Core Machine 服務" : "了解更多 Core Machine 服务"}</a>
      </div>
    </div>
    <div class="footer">
      <p>${isHK ? "此郵件由 Core Machine 官網自動發送" : "此邮件由 Core Machine 官网自动发送"} — ${new Date().toLocaleString(isHK ? "zh-HK" : "zh-CN")}</p>
      <p>${isHK ? "如有任何問題，歡迎回覆此電郵至 iocoremachine@gmail.com" : "如有任何问题，欢迎回复此电邮至 iocoremachine@gmail.com"}</p>
    </div>
  </div>
</body>
</html>
`;

  // Send to user
  const userSent = await sendEmail({
    to: toEmail,
    subject,
    html,
  });

  return userSent;
}

/**
 * Sends an AI document generation notification email.
 */
export async function sendAIGenerationEmail(params: {
  name: string;
  documentType: "subsidy_application" | "personal_statement";
  language: "zh-HK" | "zh-CN";
  businessIdea?: string;
}): Promise<boolean> {
  const { name, documentType, language, businessIdea } = params;
  const isHK = language === "zh-HK";

  const docLabel = documentType === "subsidy_application"
    ? (isHK ? "補貼申請文件" : "补贴申请文件")
    : (isHK ? "個人陳述文件" : "个人陈述文件");

  const subject = isHK
    ? `🤖 AI 文件生成請求 — ${docLabel}`
    : `🤖 AI 文件生成请求 — ${docLabel}`;

  const html = `
<!DOCTYPE html>
<html lang="${isHK ? "zh-HK" : "zh-CN"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #e2e8f0; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 20px; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .value { font-size: 16px; color: #f3f4f6; }
    .footer { padding: 16px 24px; border-top: 1px solid #1f2937; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 ${isHK ? "AI 文件生成請求" : "AI 文件生成请求"}</h1>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">${isHK ? "申請人姓名" : "申请人姓名"}</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">${isHK ? "文件類型" : "文件类型"}</div>
        <div class="value">${docLabel}</div>
      </div>
      <div class="field">
        <div class="label">${isHK ? "語言" : "语言"}</div>
        <div class="value">${isHK ? "繁體中文" : "简体中文"}</div>
      </div>
      ${businessIdea ? `
      <div class="field">
        <div class="label">${isHK ? "創業理念" : "创业理念"}</div>
        <div class="value">${escapeHtml(businessIdea)}</div>
      </div>
      ` : ""}
    </div>
    <div class="footer">
      ${isHK ? "此郵件由 Core Machine 官網自動發送" : "此邮件由 Core Machine 官网自动发送"} — ${new Date().toLocaleString(isHK ? "zh-HK" : "zh-CN")}
    </div>
  </div>
</body>
</html>
`;

  return sendEmail({
    to: ENV.notificationEmailTo,
    subject,
    html,
  });
}

/**
 * Sends a welcome email to a new paid customer.
 */
export async function sendWelcomeEmail({
  email,
  planName,
  credits,
}: {
  email: string;
  planName: string;
  credits: number;
}): Promise<boolean> {
  if (!email) return false;

  const isHK = true; // Default to HK
  const subject = isHK
    ? `✅ 歡迎加入 Core Machine — 你的 ${planName} 已啟動`
    : `✅ 欢迎加入 Core Machine — 你的 ${planName} 已启动`;

  const creditsText = credits > 0
    ? `<p style="color: #10b981; font-size: 18px; font-weight: bold;">${isHK ? "已發放" : "已发放"} ${credits} ${isHK ? "次 AI 生成配額" : "次 AI 生成配额"}</p>
       <p>${isHK ? "登入後即可使用，剩餘次數會自動顯示。" : "登录后即可使用，剩余次数会自动显示。"}</p>`
    : `<p style="color: #6366f1; font-size: 18px; font-weight: bold;">${isHK ? "Pro 會員已啟動 — 無限次 AI 生成" : "Pro 会员已启动 — 无限次 AI 生成"}</p>`;

  const html = `
<!DOCTYPE html>
<html lang="${isHK ? "zh-HK" : "zh-CN"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div class="container" style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div class="header" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
        🎉 ${isHK ? "感謝你的信任！" : "感谢你的信任！"}
      </h1>
    </div>
    <div class="body" style="padding: 40px;">
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        ${isHK ? "你好，感謝你訂閱 Core Machine" : "你好，感谢你订阅 Core Machine"} <strong>${planName}</strong>！
      </p>

      ${creditsText}

      <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; color: #1f2937; font-size: 16px;">
          ${isHK ? "你可以用 AI 做乜？" : "你可以用 AI 做什么？"}
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 2;">
          <li>${isHK ? "生成專業補貼申請文件" : "生成专业补贴申请文件"}</li>
          <li>${isHK ? "撰寫個人陳述（Personal Statement）" : "撰写个人陈述（Personal Statement）"}</li>
          <li>${isHK ? "評估你的補貼資格" : "评估你的补贴资格"}</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #9ca3af;">
        ${isHK ? "如有問題，歡迎回覆此電郵或通過以下方式聯絡我們。" : "如有问题，欢迎回复此邮件或通过以下方式联系我们。"}
      </p>
    </div>
    <div class="footer" style="padding: 20px 40px; background: #f8fafc; text-align: center; font-size: 12px; color: #9ca3af;">
      Core Machine — ${isHK ? "前海創業補貼 AI 助手" : "前海创业补贴 AI 助手"}
    </div>
  </div>
</body>
</html>
`;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
