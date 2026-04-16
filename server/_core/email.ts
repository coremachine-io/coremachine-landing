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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
