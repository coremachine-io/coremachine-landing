import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "zh-HK" | "zh-CN";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻譯字典
const translations: Record<Language, Record<string, string>> = {
  "zh-HK": {
    // Navigation
    "nav.services": "服務方案",
    "nav.story": "創辦人故事",
    "nav.templates": "免費模板",
    "nav.contact": "免費咨詢",
    
    // Hero Section
    "hero.title": "核芯機器",
    "hero.subtitle": "港澳青年北上前海創業加速器",
    "hero.tagline": "1站式註冊 + 補貼 + AI工具",
    "hero.description": "我哋係專業嘅中港創業落地服務平台，幫助香港創業者輕鬆完成前海公司註冊、補貼申請同 AI 工具落地。我行過嘅路，教你避坑。",
    "hero.cta.primary": "免費咨詢",
    "hero.cta.secondary": "下載免費模板",
    
    // Services Section
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
    
    // Story Section
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
    
    // Templates Section
    "templates.title": "免費 AI 模板下載",
    "templates.subtitle": "專業文件模板，助你快速完成申請",
    "templates.subsidy.title": "前海補貼申請文件模板",
    "templates.subsidy.description": "包含完整嘅申請資格說明、所需文件清單同線上申請步驟，繁簡雙語版本。",
    "templates.statement.title": "個人陳述專業模板",
    "templates.statement.description": "專業撰寫指引，幫你突出個人優勢，提高申請成功率。",
    "templates.download": "下載模板",
    "templates.email.placeholder": "電子郵件（可選）",
    "templates.email.hint": "留低郵箱，獲取更多創業資訊",
    
    // Contact Section
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

    // =============================================
    // 中港創業資助一覽 - 新 section
    // =============================================
    
    // Section Header
    "fund.title": "中港創業資助一覽",
    "fund.subtitle": "精準配對 · 最高效的路徑補貼",
    "fund.cta": "評估適合你的資助",
    "fund.viewAll": "查看全部資助",
    
    // Tab Labels
    "fund.tab.qianhai": "前海 · 深圳",
    "fund.tab.hongkong": "香港",
    "fund.tab.gba": "大灣區",
    
    // ========== 前海 · 深圳資助 ==========
    
    // Card 1: OPC 國際社區
    "fund.opc.name": "前海OPC「獨行俠禮包」",
    "fund.opc.tag": "AI 創業首選",
    "fund.opc.amount": "最高 200㎡ 空間 + 50P 算力",
    "fund.opc.bonus": "人才獎勵最高 60 萬",
    "fund.opc.description": "專為 AI 獨行俠設計的一人公司創業基地。3 個月主流大模型免費試用，讓你專注產品開發。",
    "fund.opc.eligible": "• 港澳居民（18-45歲）\n• AI / 數碼科技相關項目優先\n• 已注冊或計劃注冊前海公司",
    "fund.opc.tips": "• 強調 AI 應用場景 + 深港融合價值\n• 展示社會效益（如：協助更多青年創業）\n• Core Machine 可代辦入駐手續",
    
    // Card 2: 深圳智能券
    "fund.smartcoupon.name": "深圳智能券 · 訓力券 · 模型券",
    "fund.smartcoupon.tag": "算力補貼",
    "fund.smartcoupon.amount": "最高 1000 萬算力補貼",
    "fund.smartcoupon.bonus": "200萬 模型券 + 200萬 語料券",
    "fund.smartcoupon.description": "深圳市 AI 訓練與部署專項補貼。入駐 OPC 後自動匹配，後續可持續申請。",
    "fund.smartcoupon.eligible": "• OPC 園區入駐企業\n• AI 訓練或模型部署需求\n• 深圳有效工商登記",
    "fund.smartcoupon.tips": "• 准備 Hermes Agent 實際使用算力證明\n• 展示 AI 產品商業化路徑\n• 我們可協助對接園區資源",
    
    // Card 3: 鯤鵬青年創新創業項目
    "fund.kunpeng.name": "鯤鵬青年創新創業項目",
    "fund.kunpeng.tag": "創新創業",
    "fund.kunpeng.amount": "最高 5 萬獎勵 + 100 萬研發資助",
    "fund.kunpeng.bonus": "導師資源 + 產業對接",
    "fund.kunpeng.description": "面向 35 歲以下青年創業者的創新項目資助。重點支持信息技術、生物醫藥、新能源等領域。",
    "fund.kunpeng.eligible": "• 35 歲以下青年創業者\n• 具備創新技術或商業模式\n• 項目具有市場化潛力",
    "fund.kunpeng.tips": "• 突出技術壁壘和創新性\n• 商業計劃書要展示成長潛力\n• 建議配合 Core Machine 服務申請",
    
    // ========== 香港資助 ==========
    
    // Card 4: Cyberport Incubation
    "fund.cyberport.name": "Cyberport 數碼港孵化計劃",
    "fund.cyberport.tag": "香港旗艦孵化",
    "fund.cyberport.amount": "最高 50 萬孵化資助",
    "fund.cyberport.bonus": "免費辦公室 + 導師網絡",
    "fund.cyberport.description": "香港數碼港旗艦孵化項目，專為 AI 和數碼科技初創設計，提供全方位創業支援。",
    "fund.cyberport.eligible": "• AI / 數碼科技相關項目\n• 香港注冊公司或計劃在香港注冊\n• 具有跨境發展潛力（如 GBA）",
    "fund.cyberport.tips": "• 強調 AI 賦能中小企轉型能力\n• 展示大灣區跨境應用場景\n• 善用數碼港國際網絡優勢",
    
    // Card 5: HKSTP Incu-Tech
    "fund.hkstp.name": "科技園 Incu-Tech 計劃",
    "fund.hkstp.tag": "科技企業",
    "fund.hkstp.amount": "最高百萬資助 + 資源對接",
    "fund.hkstp.bonus": "科研設施 + 人才網絡",
    "fund.hkstp.description": "香港科技園 Incu-Tech 計劃，為科技初創提供資助、辦公室和科研設施支援。",
    "fund.hkstp.eligible": "• 科技初創企業\n• 持有香港身份證的創業者\n• 具備核心技術或 IP",
    "fund.hkstp.tips": "• 突出核心技術和 IP 價值\n• 展示與科技園產業生態的協同\n• 可結合內地供應鏈優勢",
    
    // Card 6: ITF AI 補貼
    "fund.itf.name": "創新及科技基金 AI 補貼",
    "fund.itf.tag": "創科支援",
    "fund.itf.amount": "最高 70% 算力補貼",
    "fund.itf.bonus": "研發資助 + 技術支持",
    "fund.itf.description": "創新及科技基金下的 AI 專項補貼計劃，資助企業採用和開發 AI 技術。",
    "fund.itf.eligible": "• 香港注冊的中小企\n• AI 技術應用或研發項目\n• 具有技術團隊或合作夥伴",
    "fund.itf.tips": "• 准備詳細的 AI 應用方案\n• 展示算力需求和使用效率\n• 可與其他資助計劃叠加申請",
    
    // ========== 大灣區資助 ==========
    
    // Card 7: GBA 青年創業基金
    "fund.gba.name": "大灣區青年創業基金",
    "fund.gba.tag": "跨境創業",
    "fund.gba.amount": "香港青年大灣區創業專項資助",
    "fund.gba.bonus": "額外配套獎勵 + 落地支援",
    "fund.gba.description": "專為香港青年在大灣區創業設立的專項基金，提供資金和落地支援。",
    "fund.gba.eligible": "• 香港永久居民\n• 在大灣區內地城市創業\n• 18-40 歲青年創業者",
    "fund.gba.tips": "• 展示深港融合的獨特優勢\n• 強調市場擴展到內地的路徑\n• 配合前海/深圳園區效果更佳",
    
    // Card 8: 青年創業計劃 (統合)
    "fund.youth.name": "粵港澳青年創業計劃",
    "fund.youth.tag": "青年創業",
    "fund.youth.amount": "生活補貼 + 創業支援",
    "fund.youth.bonus": "孵化服務 + 導師指導",
    "fund.youth.description": "支持粵港澳三地青年在內地創業的綜合性資助計劃，包含生活補貼和創業支援。",
    "fund.youth.eligible": "• 粵港澳三地青年（18-45歲）\n• 在內地創業的港澳青年\n• 已開展創業項目或已有商業計劃",
    "fund.youth.tips": "• 展現三地合作的協同效應\n• 突出香港國際化優勢\n• 建議與其他園區資助叠加申請",
    
    // ========== 申請流程 ==========
    "fund.process.title": "申請流程",
    "fund.process.step1.title": "評估配對",
    "fund.process.step1.desc": "根據你的項目和背景，評估最適合的資助方案",
    "fund.process.step2.title": "准備文件",
    "fund.process.step2.desc": "協助准備商業計劃書、財務預測等申請文件",
    "fund.process.step3.title": "遞交申請",
    "fund.process.step3.desc": "代為遞交申請，確保資料完整合規",
    "fund.process.step4.title": "跟進管理",
    "fund.process.step4.desc": "跟進審批進度，及時補充材料直至獲批",
    
    // ========== 文件清單 ==========
    "fund.docs.title": "必備文件清單",
    "fund.docs.business": "商業計劃書（Word/PDF）",
    "fund.docs.reg": "公司注冊證書副本",
    "fund.docs.id": "創業者身份證明文件",
    "fund.docs.financial": "財務預測或現有財務報表",
    "fund.docs.tech": "技術/產品介紹（如有）",
    "fund.docs.other": "其他輔助材料（專利、獎項、合作意向書等）",
    
    // ========== CTA ==========
    "fund.cta.title": "立即評估你的資助資格",
    "fund.cta.subtitle": "Core Machine 專業團隊為你免費評估",
    "fund.cta.button": "免費評估",

    // AI Document Generation
    "ai.title": "AI 文件生成",
    "ai.subtitle": "由 AI 驅動嘅專業文件生成服務",
    "ai.description": "輸入你嘅信息，我哋嘅 AI 會根據你嘅背景同需求，生成一份專業、有說服力嘅申請文件。",
    "ai.form.documentType": "選擇文件類型",
    "ai.form.documentType.subsidy": "前海補貼申請文件",
    "ai.form.documentType.statement": "個人陳述",
    "ai.form.name": "姓名",
    "ai.form.name.placeholder": "請輸入你嘅姓名",
    "ai.form.age": "年齡",
    "ai.form.age.placeholder": "例如：38",
    "ai.form.background": "個人背景",
    "ai.form.background.placeholder": "例如：香港科技公司主管，10年 IT 經驗",
    "ai.form.businessIdea": "創業理念",
    "ai.form.businessIdea.placeholder": "詳細描述你嘅創業想法同核心價值主張",
    "ai.form.experience": "相關經驗",
    "ai.form.experience.placeholder": "描述你喺創業相關領域嘅經驗同成就",
    "ai.form.targetMarket": "目標市場",
    "ai.form.targetMarket.placeholder": "例如：東南亞 SaaS 市場、香港初創生態",
    "ai.form.fundingNeeds": "融資需求",
    "ai.form.fundingNeeds.placeholder": "例如：HK$500,000 用於產品開發同市場推廣",
    "ai.form.otherInfo": "其他信息",
    "ai.form.otherInfo.placeholder": "任何其他對申請有幫助嘅信息",
    "ai.form.generate": "生成文件",
    "ai.form.generating": "生成中...",
    "ai.form.download": "下載文件",
    "ai.form.copy": "複製文本",
    "ai.success": "文件生成成功！",
    "ai.error": "生成失敗，請稍後再試。",
    "ai.copied": "已複製到剪貼板",
    // 新定價結構 keys (覆蓋現有翻譯)
    "nav.pricing": "定價",
    "nav.freeResources": "免費資源",
    "pricing.title": "靈活嘅訂閱方案",
    "pricing.subtitle": "無論你係一人創業者，定係企業客戶，我哋都有合適嘅方案",
    "pricing.free.title": "免費資源區",
    "pricing.free.tag": "完全免費",
    "pricing.free.description": "所有資助資訊、資格比較、截止日期、申請流程，全部公開免費查閱。",
    "pricing.free.cta": "立即查閱",
    "pricing.free.feature1": "資助一覽表",
    "pricing.free.feature2": "資格比較",
    "pricing.free.feature3": "截止日期時間線",
    "pricing.free.feature4": "申請流程指南",
    "pricing.free.feature5": "AI 初步評估（1次）",
    "pricing.ai.title": "AI 體驗",
    "pricing.ai.tag": "email 換一次",
    "pricing.ai.description": "輸入你嘅背景資料，即時獲得個人化資助配對報告（PDF）。留低 email，即可下載 + 接收最新資助更新。",
    "pricing.ai.cta": "立即試用",
    "pricing.ai.emailPlaceholder": "輸入 email 接收報告",
    "pricing.starter.title": "Starter",
    "pricing.starter.tag": "入門首選",
    "pricing.starter.price": "HK$38/月",
    "pricing.starter.priceYearly": "或 HK$388/年（相當於 HK$32/月）",
    "pricing.starter.description": "已經試過免費版？每月只需 HK$38，即可解鎖 10 次高質 AI 生成 + 最新資助資訊 + 初步批核評估。",
    "pricing.starter.cta": "立即開始",
    "pricing.starter.feature1": "每月 10 次 AI 文件生成",
    "pricing.starter.feature2": "最新資助資訊",
    "pricing.starter.feature3": "初步批核評估",
    "pricing.starter.feature4": "截止日期提醒",
    "pricing.starter.feature5": "申請進度追蹤",
    "pricing.pro.title": "Pro",
    "pricing.pro.tag": "公司秘書式服務",
    "pricing.pro.price": "HK$12,800 一次性",
    "pricing.pro.priceMonthly": "+ HK$1,800/月",
    "pricing.pro.description": "想一站式搞掂前海創業？一次性 HK$12,800 + 月費 HK$1,800，即可享有無限 AI 生成 + 公司註冊/秘書服務 + 全程申請代辦 + 3 個月跟進。",
    "pricing.pro.cta": "立即升級",
    "pricing.pro.feature1": "無限次 AI 文件生成",
    "pricing.pro.feature2": "公司註冊/秘書服務",
    "pricing.pro.feature3": "全程申請代辦",
    "pricing.pro.feature4": "3 個月免費跟進",
    "pricing.pro.feature5": "專屬顧問支援",
    "pricing.pro.bonus": "成功獲批後 5% 現金回贈",
    "pricing.enterprise.title": "Enterprise",
    "pricing.enterprise.tag": "企業定制",
    "pricing.enterprise.price": "項目報價",
    "pricing.enterprise.priceBonus": "成功後 8-10% 獎勵",
    "pricing.enterprise.description": "適合有規模嘅企業或批量申請。由我哋專業團隊為你量身定制全方位一條龍服務。",
    "pricing.enterprise.cta": "聯絡我們",
    "pricing.enterprise.feature1": "批量處理能力",
    "pricing.enterprise.feature2": "專屬 AI Agent",
    "pricing.enterprise.feature3": "團隊培訓",
    "pricing.enterprise.feature4": "專屬顧問團隊",
    "pricing.enterprise.feature5": "API 接入",
    "pricing.faq.title": "常見問題",
    "pricing.faq.q1": "我可以隨時取消訂閱嗎？",
    "pricing.faq.a1": "可以隨時取消，取消後下個週期不再收費。",
    "pricing.faq.q2": "AI 生成嘅文件可以用嚟正式申請嗎？",
    "pricing.faq.a2": "可以，我哋嘅 AI 生成文件符合各大資助計劃嘅格式要求。",
    "pricing.faq.q3": "Pro 嘅公司註冊服務包括啲乜？",
    "pricing.faq.a3": "包括前海公司註冊地址、公司秘書服務、税務登記等基礎服務。",
    "footer.pricing": "定價",
    "footer.about": "關於我哋",
    "footer.faq": "常見問題",
    "footer.terms": "服務條款",
    "footer.privacy": "私隱政策",
    "mission.title": "我哋嘅使命",
    "mission.subtitle": "用 AI 驗證每一個資助申請的可能",
    "mission.description": "從自己開始，幫客戶複製成功。我哋唔單止係服務平台，仲係你創業路上嘅 AI 夥伴。",
    "success.title": "成功案例",
    "success.subtitle": "我哋正準備發佈我哋嘅第一個成功案例",
    "success.cta": "成為我哋嘅第一個 Pro 客戶",
  },

  "zh-CN": {
    // Navigation
    "nav.services": "服务方案",
    "nav.story": "创办人故事",
    "nav.templates": "免费模板",
    "nav.contact": "免费咨询",
    
    // Hero Section
    "hero.title": "核芯机器",
    "hero.subtitle": "港澳青年北上前海创业加速器",
    "hero.tagline": "1站式注册 + 补贴 + AI工具",
    "hero.description": "我们是专业的中港创业落地服务平台，帮助香港创业者轻松完成前海公司注册、补贴申请和 AI 工具落地。我走过的路，教你避坑。",
    "hero.cta.primary": "免费咨询",
    "hero.cta.secondary": "下载免费模板",
    
    // Services Section
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
    
    // Story Section
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
    
    // Templates Section
    "templates.title": "免费 AI 模板下载",
    "templates.subtitle": "专业文件模板，助您快速完成申请",
    "templates.subsidy.title": "前海补贴申请文件模板",
    "templates.subsidy.description": "包含完整的申请资格说明、所需文件清单和线上申请步骤，繁简双语版本。",
    "templates.statement.title": "个人陈述专业模板",
    "templates.statement.description": "专业撰写指引，帮您突出个人优势，提高申请成功率。",
    "templates.download": "下载模板",
    "templates.email.placeholder": "电子邮件（可选）",
    "templates.email.hint": "留下邮箱，获取更多创业资讯",
    
    // Contact Section
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

    // =============================================
    // 中港创业资助一览 - 新 section
    // =============================================
    
    // Section Header
    "fund.title": "中港创业资助一览",
    "fund.subtitle": "精准配对 · 最高效的路径补贴",
    "fund.cta": "评估适合你的资助",
    "fund.viewAll": "查看全部资助",
    
    // Tab Labels
    "fund.tab.qianhai": "前海 · 深圳",
    "fund.tab.hongkong": "香港",
    "fund.tab.gba": "大湾区",
    
    // ========== 前海 · 深圳资助 ==========
    
    // Card 1: OPC 国际社区
    "fund.opc.name": "前海OPC「独行侠礼包」",
    "fund.opc.tag": "AI 创业首选",
    "fund.opc.amount": "最高 200㎡ 空间 + 50P 算力",
    "fund.opc.bonus": "人才奖励最高 60 万",
    "fund.opc.description": "专为 AI 独行侠设计的一人公司创业基地。3 个月主流大模型免费试用，让你专注产品开发。",
    "fund.opc.eligible": "• 港澳居民（18-45岁）\n• AI / 数码科技相关项目优先\n• 已注册或计划注册前海公司",
    "fund.opc.tips": "• 强调 AI 应用场景 + 深港融合价值\n• 展示社会效益（如：协助更多青年创业）\n• Core Machine 可代办入驻手续",
    
    // Card 2: 深圳智能券
    "fund.smartcoupon.name": "深圳智能券 · 训力券 · 模型券",
    "fund.smartcoupon.tag": "算力补贴",
    "fund.smartcoupon.amount": "最高 1000 万算力补贴",
    "fund.smartcoupon.bonus": "200万 模型券 + 200万 语料券",
    "fund.smartcoupon.description": "深圳市 AI 训练与部署专项补贴。入驻 OPC 后自动匹配，后续可持续申请。",
    "fund.smartcoupon.eligible": "• OPC 园区入驻企业\n• AI 训练或模型部署需求\n• 深圳有效工商登记",
    "fund.smartcoupon.tips": "• 准备 Hermes Agent 实际使用算力证明\n• 展示 AI 产品商业化路径\n• 我们可协助对接园区资源",
    
    // Card 3: 鲲鹏青年创新创业项目
    "fund.kunpeng.name": "鲲鹏青年创新创业项目",
    "fund.kunpeng.tag": "创新创业",
    "fund.kunpeng.amount": "最高 5 万奖励 + 100 万研发资助",
    "fund.kunpeng.bonus": "导师资源 + 产业对接",
    "fund.kunpeng.description": "面向 35 岁以下青年创业者的创新项目资助。重点支持信息技术、生物医药、新能源等领域。",
    "fund.kunpeng.eligible": "• 35 岁以下青年创业者\n• 具备创新技术或商业模式\n• 项目具有市场化潜力",
    "fund.kunpeng.tips": "• 突出技术壁垒和创新性\n• 商业计划书要展示成长潜力\n• 建议配合 Core Machine 服务申请",
    
    // ========== 香港资助 ==========
    
    // Card 4: Cyberport Incubation
    "fund.cyberport.name": "Cyberport 数码港孵化计划",
    "fund.cyberport.tag": "香港旗舰孵化",
    "fund.cyberport.amount": "最高 50 万孵化资助",
    "fund.cyberport.bonus": "免费办公室 + 导师网络",
    "fund.cyberport.description": "香港数码港旗舰孵化项目，专为 AI 和数码科技初创设计，提供全方位创业支援。",
    "fund.cyberport.eligible": "• AI / 数码科技相关项目\n• 香港注册公司或计划在香港注册\n• 具有跨境发展潜力（如 GBA）",
    "fund.cyberport.tips": "• 强调 AI 赋能中小企业转型能力\n• 展示大湾区跨境应用场景\n• 善用数码港国际网络优势",
    
    // Card 5: HKSTP Incu-Tech
    "fund.hkstp.name": "科技园 Incu-Tech 计划",
    "fund.hkstp.tag": "科技企业",
    "fund.hkstp.amount": "最高百万资助 + 资源对接",
    "fund.hkstp.bonus": "科研设施 + 人才网络",
    "fund.hkstp.description": "香港科技园 Incu-Tech 计划，为科技初创提供资助、办公室和科研设施支援。",
    "fund.hkstp.eligible": "• 科技初创企业\n• 持有香港身份证的创业者\n• 具备核心技术或 IP",
    "fund.hkstp.tips": "• 突出核心技术和 IP 价值\n• 展示与科技园产业生态的协同\n• 可结合内地供应链优势",
    
    // Card 6: ITF AI 补贴
    "fund.itf.name": "创新及科技基金 AI 补贴",
    "fund.itf.tag": "创科支援",
    "fund.itf.amount": "最高 70% 算力补贴",
    "fund.itf.bonus": "研发资助 + 技术支持",
    "fund.itf.description": "创新及科技基金下的 AI 专项补贴计划，资助企业采用和开发 AI 技术。",
    "fund.itf.eligible": "• 香港注册的中小企\n• AI 技术应用或研发项目\n• 具有技术团队或合作伙伴",
    "fund.itf.tips": "• 准备详细的 AI 应用方案\n• 展示算力需求和使用效率\n• 可与其他资助计划叠加申请",
    
    // ========== 大湾区资助 ==========
    
    // Card 7: GBA 青年创业基金
    "fund.gba.name": "大湾区青年创业基金",
    "fund.gba.tag": "跨境创业",
    "fund.gba.amount": "香港青年大湾区创业专项资助",
    "fund.gba.bonus": "额外配套奖励 + 落地支援",
    "fund.gba.description": "专为香港青年在大湾区创业设立的专项基金，提供资金和落地支援。",
    "fund.gba.eligible": "• 香港永久居民\n• 在大湾区内地城市创业\n• 18-40 岁青年创业者",
    "fund.gba.tips": "• 展示深港融合的独特优势\n• 强调市场扩展到内地的路径\n• 配合前海/深圳园区效果更佳",
    
    // Card 8: 青年创业计划 (统合)
    "fund.youth.name": "粤港澳青年创业计划",
    "fund.youth.tag": "青年创业",
    "fund.youth.amount": "生活补贴 + 创业支援",
    "fund.youth.bonus": "孵化服务 + 导师指导",
    "fund.youth.description": "支持粤港澳三地青年在内地创业的综合资助计划，包含生活补贴和创业支援。",
    "fund.youth.eligible": "• 粤港澳三地青年（18-45岁）\n• 在内地创业的港澳青年\n• 已开展创业项目或已有商业计划",
    "fund.youth.tips": "• 展现三地合作的协同效应\n• 突出香港国际化优势\n• 建议与其他园区资助叠加申请",
    
    // ========== 申请流程 ==========
    "fund.process.title": "申请流程",
    "fund.process.step1.title": "评估配对",
    "fund.process.step1.desc": "根据你的项目和背景，评估最合适的资助方案",
    "fund.process.step2.title": "准备文件",
    "fund.process.step2.desc": "协助准备商业计划书、财务预测等申请文件",
    "fund.process.step3.title": "递交申请",
    "fund.process.step3.desc": "代为递交申请，确保资料完整合规",
    "fund.process.step4.title": "跟进管理",
    "fund.process.step4.desc": "跟进审批进度，及时补充材料直至获批",
    
    // ========== 文件清单 ==========
    "fund.docs.title": "必备文件清单",
    "fund.docs.business": "商业计划书（Word/PDF）",
    "fund.docs.reg": "公司注册证书副本",
    "fund.docs.id": "创业者身份证明文件",
    "fund.docs.financial": "财务预测或现有财务报表",
    "fund.docs.tech": "技术/产品介绍（如有）",
    "fund.docs.other": "其他辅助材料（专利、奖项、合作意向书等）",
    
    // ========== CTA ==========
    "fund.cta.title": "立即评估你的资助资格",
    "fund.cta.subtitle": "Core Machine 专业团队为你免费评估",
    "fund.cta.button": "免费评估",

    // AI Document Generation
    "ai.title": "AI 文件生成",
    "ai.subtitle": "由 AI 驅動嘅專業文件生成服務",
    "ai.description": "輸入你嘅信息，我哋嘅 AI 會根據你嘅背景同需求，生成一份專業、有說服力嘅申請文件。",
    "ai.form.documentType": "選擇文件類型",
    "ai.form.documentType.subsidy": "前海補貼申請文件",
    "ai.form.documentType.statement": "個人陳述",
    "ai.form.name": "姓名",
    "ai.form.name.placeholder": "請輸入你嘅姓名",
    "ai.form.age": "年齡",
    "ai.form.age.placeholder": "例如：38",
    "ai.form.background": "個人背景",
    "ai.form.background.placeholder": "例如：香港科技公司主管，10年 IT 經驗",
    "ai.form.businessIdea": "創業理念",
    "ai.form.businessIdea.placeholder": "詳細描述你嘅創業想法同核心價值主張",
    "ai.form.experience": "相關經驗",
    "ai.form.experience.placeholder": "描述你喺創業相關領域嘅經驗同成就",
    "ai.form.targetMarket": "目標市場",
    "ai.form.targetMarket.placeholder": "例如：東南亞 SaaS 市場、香港初創生態",
    "ai.form.fundingNeeds": "融資需求",
    "ai.form.fundingNeeds.placeholder": "例如：HK$500,000 用於產品開發同市場推廣",
    "ai.form.otherInfo": "其他信息",
    "ai.form.otherInfo.placeholder": "任何其他對申請有幫助嘅信息",
    "ai.form.generate": "生成文件",
    "ai.form.generating": "生成中...",
    "ai.form.download": "下載文件",
    "ai.form.copy": "複製文本",
    "ai.success": "文件生成成功！",
    "ai.error": "生成失敗，請稍後再試。",
    "ai.copied": "已複製到剪貼板",
    // 新增 Navigation
    "nav.pricing": "定价",
    "nav.freeResources": "免费资源",
    
    // Pricing Section
    "pricing.title": "灵活的订阅方案",
    "pricing.subtitle": "无论你是一人创业者，还是企业客户，我们都有合适的方案",
    "pricing.free.title": "免费资源区",
    "pricing.free.tag": "完全免费",
    "pricing.free.description": "所有资助资讯、资格比较，截止日期、申请流程，全部公开免费查阅。",
    "pricing.free.cta": "立即查阅",
    "pricing.free.feature1": "资助一览表",
    "pricing.free.feature2": "资格比较",
    "pricing.free.feature3": "截止日期时间线",
    "pricing.free.feature4": "申请流程指南",
    "pricing.free.feature5": "AI 初步评估（1次）",
    "pricing.ai.title": "AI 体验",
    "pricing.ai.tag": "email 换一次",
    "pricing.ai.description": "输入你的背景资料，即时获得个人化资助配对报告（PDF）。留下 email，即可下载 + 接收最新资助更新。",
    "pricing.ai.cta": "立即试用",
    "pricing.ai.emailPlaceholder": "输入 email 接收报告",
    "pricing.starter.title": "Starter",
    "pricing.starter.tag": "入门首选",
    "pricing.starter.price": "HK$38/月",
    "pricing.starter.priceYearly": "或 HK$388/年（相当于 HK$32/月）",
    "pricing.starter.description": "已经试过免费版？每月只需 HK$38，即可解锁 10 次高质量 AI 生成 + 最新资助资讯 + 初步批核评估。",
    "pricing.starter.cta": "立即开始",
    "pricing.starter.feature1": "每月 10 次 AI 文件生成",
    "pricing.starter.feature2": "最新资助资讯",
    "pricing.starter.feature3": "初步批核评估",
    "pricing.starter.feature4": "截止日期提醒",
    "pricing.starter.feature5": "申请进度追踪",
    "pricing.pro.title": "Pro",
    "pricing.pro.tag": "公司秘书式服务",
    "pricing.pro.price": "HK$12,800 一次性",
    "pricing.pro.priceMonthly": "+ HK$1,800/月",
    "pricing.pro.description": "想一站式搞掂前海创业？一次性 HK$12,800 + 月费 HK$1,800，即可享有无限 AI 生成 + 公司注册/秘书服务 + 全程申请代办 + 3 个月跟进。",
    "pricing.pro.cta": "立即升级",
    "pricing.pro.feature1": "无限次 AI 文件生成",
    "pricing.pro.feature2": "公司注册/秘书服务",
    "pricing.pro.feature3": "全程申请代办",
    "pricing.pro.feature4": "3 个月免费跟进",
    "pricing.pro.feature5": "专属顾问支援",
    "pricing.pro.bonus": "成功获批后 5% 现金回赠",
    "pricing.enterprise.title": "Enterprise",
    "pricing.enterprise.tag": "企业定制",
    "pricing.enterprise.price": "项目报价",
    "pricing.enterprise.priceBonus": "成功后 8-10% 奖励",
    "pricing.enterprise.description": "适合有一定规模的企业或批量申请。由我们专业团队为你量身定制全方位一条龙服务。",
    "pricing.enterprise.cta": "联络我们",
    "pricing.enterprise.feature1": "批量处理能力",
    "pricing.enterprise.feature2": "专属 AI Agent",
    "pricing.enterprise.feature3": "团队培训",
    "pricing.enterprise.feature4": "专属顾问团队",
    "pricing.enterprise.feature5": "API 接入",
    "pricing.faq.title": "常见问题",
    "pricing.faq.q1": "我可以随时取消订阅吗？",
    "pricing.faq.a1": "可以随时取消，取消后下个周期不再收费。",
    "pricing.faq.q2": "AI 生成的文件可以用来正式申请吗？",
    "pricing.faq.a2": "可以，我们的 AI 生成文件符合各大资助计划的格式要求。",
    "pricing.faq.q3": "Pro 的公司注册服务包括什么？",
    "pricing.faq.a3": "包括前海公司注册地址、公司秘书服务、税务登记等基础服务。",
    "footer.pricing": "定价",
    "footer.about": "关于我们",
    "footer.faq": "常见问题",
    "footer.terms": "服务条款",
    "footer.privacy": "隐私政策",
    "mission.title": "我们的使命",
    "mission.subtitle": "用 AI 验证每一个资助申请的可能",
    "mission.description": "从自己开始，帮客户复制成功。我们不只是服务平台，还是你创业路上的 AI 伙伴。",
    "success.title": "成功案例",
    "success.subtitle": "我们正准备发布我们的第一个成功案例",
    "success.cta": "成为我们的第一个 Pro 客户",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // 从 localStorage 读取语言偏好
    const saved = localStorage.getItem("language");
    return (saved === "zh-CN" || saved === "zh-HK") ? saved : "zh-HK";
  });

  useEffect(() => {
    // 保存語言偏好到 localStorage
    localStorage.setItem("language", language);
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

