import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "zh-HK" | "zh-CN";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ========== Translations ==========
const translations: Record<Language, Record<string, string>> = {
  "zh-HK": {
    // Navigation
    "nav.services": "服務方案",
    "nav.story": "創辦人故事",
    "nav.templates": "免費模板",
    "nav.contact": "免費咨詢",
    
    // Hero
    "hero.title": "核芯機器",
    "hero.subtitle": "港澳青年北上前海創業加速器",
    "hero.tagline": "1站式註冊 + 補貼 + AI工具",
    "hero.description": "我哋係專業嘅中港創業落地服務平台，幫助香港創業者輕鬆完成前海公司註冊、補貼申請同 AI 工具落地。我行過嘅路，教你避坑。",
    "hero.cta.primary": "免費咨詢",
    "hero.cta.secondary": "下載免費模板",
    
    // Services
    "services.title": "服務方案",
    "services.subtitle": "為你度身訂造嘅創業落地方案",
    "services.basic.title": "基礎包",
    "services.basic.price": "HK$10,000",
    "services.basic.description": "適合初創企業，快速完成註冊同補貼申請",
    "services.basic.feature1": "前海公司註冊全流程",
    "services.basic.feature2": "補貼申請文件準備",
    "services.basic.feature3": "政策咨詢與指導",
    "services.basic.feature4": "銀行開戶協助",
    "services.basic.feature5": "社保繳納指引",
    "services.vip.title": "VIP包",
    "services.vip.price": "HK$20,000+",
    "services.vip.description": "全方位支援，包含 AI 內容營銷方案",
    "services.vip.feature1": "基礎包所有服務",
    "services.vip.feature2": "AI 工具落地與培訓",
    "services.vip.feature3": "內容營銷策略制定",
    "services.vip.feature4": "社交媒體運營指導",
    "services.vip.feature5": "持續技術支援（3個月）",
    "services.cta": "立即咨詢",
    
    // Story
    "story.title": "創辦人故事",
    "story.subtitle": "我行過嘅路，教你避坑",
    "story.age": "38歲",
    "story.intro": "我係一個38歲嘅香港人，曾經喺職場遇到瓶頸，決定北上前海重新開始。呢條路唔易行，但我相信每個人都有翻身嘅機會。",
    "story.challenge.title": "挑戰與困境",
    "story.challenge.content": "喺香港，我面對住激烈嘅競爭同有限嘅上升空間。38歲，好多人會選擇安穩，但我選擇咗歸零再出發。北上創業嘅過程充滿挑戰：語言障礙、政策複雜、資金有限。但正正係呢啲挑戰，令我更加堅定。",
    "story.solution.title": "解決方案",
    "story.solution.content": "我花咗大量時間研究前海政策，親身經歷咗公司註冊、補貼申請嘅全過程。我發現，好多香港創業者都面對住同樣嘅困難。於是，我決定創辦 Core Machine，用我嘅經驗幫助更多人避開我行過嘅坑。",
    "story.vision.title": "願景與使命",
    "story.vision.content": "我哋嘅目標唔單止係幫你完成註冊，更係成為你創業路上嘅夥伴。我哋提供嘅唔單止係服務，仲有真實嘅經驗同避坑指南。因為我明白，創業路上最寶貴嘅，係有人行過呢條路，願意分享佢嘅故事。",
    
    // Templates
    "templates.title": "免費 AI 模板下載",
    "templates.subtitle": "專業文件模板，助你快速完成申請",
    "templates.subsidy.title": "前海補貼申請文件模板",
    "templates.subsidy.description": "包含完整嘅申請資格說明、所需文件清單同線上申請步驟，繁簡雙語版本。",
    "templates.statement.title": "個人陳述專業模板",
    "templates.statement.description": "專業撰寫指引，幫你突出個人優勢，提高申請成功率。",
    "templates.download": "下載模板",
    "templates.email.hint": "留低郵箱，獲取更多創業資訊",
    "templates.email.placeholder": "電子郵件（可選）",
    
    // AI Generator
    "ai.title": "🤖 AI 智能生成個人化文件",
    "ai.subtitle": "填寫基本資料，Johnny 即時為你生成專業申請文件",
    "ai.section.title": "AI 智能生成（新版）",
    "ai.section.description": "輸入你的基本資料，AI 即時生成個人化補貼申請文件或個人陳述",
    "ai.section.cta": "立即 AI 生成",
    "ai.form.name": "姓名",
    "ai.form.name.placeholder": "請輸入你的姓名",
    "ai.form.age": "年齡",
    "ai.form.education": "最高學歷",
    "ai.education.associate": "副學士 / 高級文憑",
    "ai.education.bachelor": "學士學位",
    "ai.education.master": "碩士學位",
    "ai.education.doctorate": "博士學位",
    "ai.form.industry": "香港從事行業",
    "ai.form.industry.placeholder": "例如：金融、科技、零售、媒體",
    "ai.form.experience": "工作經驗摘要",
    "ai.form.experience.placeholder": "例如：過去8年喺香港從事FinTech行業，曾任職產品經理...",
    "ai.form.identity": "你係創業者定受薪者？",
    "ai.identity.founder": "創業者",
    "ai.identity.employee": "受薪者",
    "ai.form.companyName": "公司名稱（創辦中/已成立）",
    "ai.form.companyName.placeholder": "例如：Core Machine Limited",
    "ai.form.targetCompany": "目標入職公司",
    "ai.form.targetCompany.placeholder": "例如：前海某科技公司",
    "ai.form.motivation": "決心北上發展的原因",
    "ai.form.motivation.placeholder": "例如：香港樓價高、事業遇到瓶頸、大灣區機遇前所未有...",
    "ai.form.goals": "申請目標",
    "ai.goals.subsidy": "前海港澳青年補貼",
    "ai.goals.opc": "OPC 8個0資助",
    "ai.goals.both": "兩樣都要",
    "ai.form.email": "電郵（可選）",
    "ai.form.email.placeholder": "我們會發送文件副本到你的郵箱",
    "ai.form.optional": "可選",
    "ai.next": "下一步",
    "ai.back": "返回",
    "ai.generate.subsidy": "生成補貼申請",
    "ai.generate.statement": "生成個人陳述",
    "ai.generating": "Johnny 正在為你生成中...",
    "ai.footer.note": "文件由 Core Machine AI 即時生成，可直接用於申請",
    "ai.footer.whatsapp": "需要人工幫助？WhatsApp 聯絡我哋",
    
    // Contact
    "contact.title": "免費咨詢",
    "contact.subtitle": "填寫表單，我哋會儘快聯絡你",
    "contact.form.name": "姓名",
    "contact.form.name.placeholder": "請輸入你嘅姓名",
    "contact.form.contact": "聯絡方式",
    "contact.form.contact.placeholder": "電話或微信號",
    "contact.form.email": "電子郵件（可選）",
    "contact.form.email.placeholder": "example@email.com",
    "contact.form.needs": "你嘅需求",
    "contact.form.needs.placeholder": "請詳細描述你嘅需求，例如：想註冊前海公司、申請補貼、了解 AI 工具等",
    "contact.form.submit": "提交咨詢",
    "contact.form.submitting": "提交中...",
    "contact.success": "提交成功！我哋會儘快聯絡你。",
    "contact.error": "提交失敗，請稍後再試。",
    
    // Footer
    "footer.company": "Core Machine Limited",
    "footer.tagline": "核芯機器有限公司",
    "footer.description": "專業嘅中港創業落地服務平台",
    "footer.contact.title": "聯絡我哋",
    "footer.contact.email": "hello@coremachine.io",
    "footer.contact.website": "coremachine.io",
    "footer.services.title": "服務",
    "footer.services.registration": "公司註冊",
    "footer.services.subsidy": "補貼申請",
    "footer.services.ai": "AI 工具",
    "footer.services.marketing": "內容營銷",
    "footer.resources.title": "資源",
    "footer.resources.templates": "免費模板",
    "footer.resources.blog": "創業指南",
    "footer.resources.faq": "常見問題",
    "footer.copyright": "© 2026 Core Machine Limited. 版權所有。",
  },
  "zh-CN": {
    // Navigation
    "nav.services": "服务方案",
    "nav.story": "创办人故事",
    "nav.templates": "免费模板",
    "nav.contact": "免费咨询",
    
    // Hero
    "hero.title": "核芯机器",
    "hero.subtitle": "港澳青年北上前海创业加速器",
    "hero.tagline": "1站式注册 + 补贴 + AI工具",
    "hero.description": "我们是专业的中港创业落地服务平台，帮助香港创业者轻松完成前海公司注册、补贴申请和 AI 工具落地。我走过的路，教你避坑。",
    "hero.cta.primary": "免费咨询",
    "hero.cta.secondary": "下载免费模板",
    
    // Services
    "services.title": "服务方案",
    "services.subtitle": "为您量身定制的创业落地方案",
    "services.basic.title": "基础包",
    "services.basic.price": "HK$10,000",
    "services.basic.description": "适合初创企业，快速完成注册和补贴申请",
    "services.basic.feature1": "前海公司注册全流程",
    "services.basic.feature2": "补贴申请文件准备",
    "services.basic.feature3": "政策咨询与指导",
    "services.basic.feature4": "银行开户协助",
    "services.basic.feature5": "社保缴纳指引",
    "services.vip.title": "VIP包",
    "services.vip.price": "HK$20,000+",
    "services.vip.description": "全方位支持，包含 AI 内容营销方案",
    "services.vip.feature1": "基础包所有服务",
    "services.vip.feature2": "AI 工具落地与培训",
    "services.vip.feature3": "内容营销策略制定",
    "services.vip.feature4": "社交媒体运营指导",
    "services.vip.feature5": "持续技术支持（3个月）",
    "services.cta": "立即咨询",
    
    // Story
    "story.title": "创办人故事",
    "story.subtitle": "我走过的路，教你避坑",
    "story.age": "38岁",
    "story.intro": "我是一个38岁的香港人，曾经在职场遇到瓶颈，决定北上前海重新开始。这条路不容易，但我相信每个人都有翻身的机会。",
    "story.challenge.title": "挑战与困境",
    "story.challenge.content": "在香港，我面对着激烈的竞争和有限的上升空间。38岁，很多人会选择安稳，但我选择了归零再出发。北上创业的过程充满挑战：语言障碍、政策复杂、资金有限。但正是这些挑战，让我更加坚定。",
    "story.solution.title": "解决方案",
    "story.solution.content": "我花了大量时间研究前海政策，亲身经历了公司注册、补贴申请的全过程。我发现，很多香港创业者都面对着同样的困难。于是，我决定创办 Core Machine，用我的经验帮助更多人避开我走过的坑。",
    "story.vision.title": "愿景与使命",
    "story.vision.content": "我们的目标不仅是帮您完成注册，更是成为您创业路上的伙伴。我们提供的不仅是服务，还有真实的经验和避坑指南。因为我明白，创业路上最宝贵的，是有人走过这条路，愿意分享他的故事。",
    
    // Templates
    "templates.title": "免费 AI 模板下载",
    "templates.subtitle": "专业文件模板，助您快速完成申请",
    "templates.subsidy.title": "前海补贴申请文件模板",
    "templates.subsidy.description": "包含完整的申请资格说明、所需文件清单和线上申请步骤，繁简双语版本。",
    "templates.statement.title": "个人陈述专业模板",
    "templates.statement.description": "专业撰写指引，帮您突出个人优势，提高申请成功率。",
    "templates.download": "下载模板",
    "templates.email.hint": "留下邮箱，获取更多创业资讯",
    "templates.email.placeholder": "电子邮件（可选）",
    
    // AI Generator
    "ai.title": "🤖 AI 智能生成个人化文件",
    "ai.subtitle": "填写基本资料，Johnny 即时为您生成专业申请文件",
    "ai.section.title": "AI 智能生成（新版）",
    "ai.section.description": "输入您的基本资料，AI 即时生成个人化补贴申请文件或个人陈述",
    "ai.section.cta": "立即 AI 生成",
    "ai.form.name": "姓名",
    "ai.form.name.placeholder": "请输入您的姓名",
    "ai.form.age": "年龄",
    "ai.form.education": "最高学历",
    "ai.education.associate": "副学士 / 高级文凭",
    "ai.education.bachelor": "学士学位",
    "ai.education.master": "硕士学位",
    "ai.education.doctorate": "博士学位",
    "ai.form.industry": "香港从事行业",
    "ai.form.industry.placeholder": "例如：金融、科技、零售、媒体",
    "ai.form.experience": "工作经验摘要",
    "ai.form.experience.placeholder": "例如：过去8年在香港从事FinTech行业，曾任职产品经理...",
    "ai.form.identity": "您是创业者还是受薪者？",
    "ai.identity.founder": "创业者",
    "ai.identity.employee": "受薪者",
    "ai.form.companyName": "公司名称（创办中/已成立）",
    "ai.form.companyName.placeholder": "例如：Core Machine Limited",
    "ai.form.targetCompany": "目标入职公司",
    "ai.form.targetCompany.placeholder": "例如：前海某科技公司",
    "ai.form.motivation": "决心北上发展的原因",
    "ai.form.motivation.placeholder": "例如：香港楼价高、事业遇到瓶颈、大湾区机遇前所未有...",
    "ai.form.goals": "申请目标",
    "ai.goals.subsidy": "前海港澳青年补贴",
    "ai.goals.opc": "OPC 8个0资助",
    "ai.goals.both": "两样都要",
    "ai.form.email": "电邮（可选）",
    "ai.form.email.placeholder": "我们将发送文件副本到您的邮箱",
    "ai.form.optional": "可选",
    "ai.next": "下一步",
    "ai.back": "返回",
    "ai.generate.subsidy": "生成补贴申请",
    "ai.generate.statement": "生成个人陈述",
    "ai.generating": "Johnny 正在为您生成中...",
    "ai.footer.note": "文件由 Core Machine AI 即时生成，可直接用于申请",
    "ai.footer.whatsapp": "需要人工帮助？WhatsApp 联络我们",
    
    // Contact
    "contact.title": "免费咨询",
    "contact.subtitle": "填写表单，我们会尽快联系您",
    "contact.form.name": "姓名",
    "contact.form.name.placeholder": "请输入您的姓名",
    "contact.form.contact": "联系方式",
    "contact.form.contact.placeholder": "电话或微信号",
    "contact.form.email": "电子邮件（可选）",
    "contact.form.email.placeholder": "example@email.com",
    "contact.form.needs": "您的需求",
    "contact.form.needs.placeholder": "请详细描述您的需求，例如：想注册前海公司、申请补贴、了解 AI 工具等",
    "contact.form.submit": "提交咨询",
    "contact.form.submitting": "提交中...",
    "contact.success": "提交成功！我们会尽快联系您。",
    "contact.error": "提交失败，请稍后再试。",
    
    // Footer
    "footer.company": "Core Machine Limited",
    "footer.tagline": "核芯机器有限公司",
    "footer.description": "专业的中港创业落地服务平台",
    "footer.contact.title": "联系我们",
    "footer.contact.email": "hello@coremachine.io",
    "footer.contact.website": "coremachine.io",
    "footer.services.title": "服务",
    "footer.services.registration": "公司注册",
    "footer.services.subsidy": "补贴申请",
    "footer.services.ai": "AI 工具",
    "footer.services.marketing": "内容营销",
    "footer.resources.title": "资源",
    "footer.resources.templates": "免费模板",
    "footer.resources.blog": "创业指南",
    "footer.resources.faq": "常见问题",
    "footer.copyright": "© 2026 Core Machine Limited. 版权所有。",
  },
};

// ========== Provider ==========
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      return (saved === "zh-CN" || saved === "zh-HK") ? saved : "zh-HK";
    }
    return "zh-HK";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
