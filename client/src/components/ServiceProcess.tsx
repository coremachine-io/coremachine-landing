import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Users, FileText, Shield, Clock, ArrowRight } from "lucide-react";

const steps = {
  "zh-HK": [
    {
      number: "01",
      icon: Sparkles,
      title: "免費 AI 評估",
      subtitle: "3分鐘了解你嘅補貼資格",
      description: "填寫基本資料，AI 即時分析你符合邊個資助計劃",
      humanRole: "系統自動化處理",
      aiPowered: true,
    },
    {
      number: "02",
      icon: Users,
      title: "專人解讀報告",
      subtitle: "我哋嘅顧問親自睇你份報告",
      description: "唔係淨係比你一份 PDF就算，有顧問一對一幫你拆解",
      humanRole: "資深顧問（20分鐘視像會議）",
      aiPowered: false,
    },
    {
      number: "03",
      icon: FileText,
      title: "AI 文件初稿",
      subtitle: "你提供資料，AI 生成申請文件",
      description: "商業計劃書、申請表、可行性報告——AI 幫你起好初稿",
      humanRole: "AI 系統生成",
      aiPowered: true,
    },
    {
      number: "04",
      icon: Shield,
      title: "專業顧問審核",
      subtitle: "每份文件都有人手把關",
      description: "我哋嘅顧問親自校對，確保符合政策導向同評審邏輯",
      humanRole: "資深顧問（全場面把關）",
      aiPowered: false,
    },
    {
      number: "05",
      icon: Clock,
      title: "代提交申請",
      subtitle: "我哋幫你搞掂最後一步",
      description: "幫你對接相關部門，確保文件格式正確，准时提交",
      humanRole: "我哋嘅團隊全程代辦",
      aiPowered: false,
    },
  ],
  "zh-CN": [
    {
      number: "01",
      icon: Sparkles,
      title: "免费 AI 评估",
      subtitle: "3分钟了解你的补贴资格",
      description: "填写基本资料，AI 即时分析你符合哪个资助计划",
      humanRole: "系统自动化处理",
      aiPowered: true,
    },
    {
      number: "02",
      icon: Users,
      title: "专人解读报告",
      subtitle: "我们的顾问亲自看你份报告",
      description: "不是净系比你一份 PDF 就完，有顾问一对一帮你拆解",
      humanRole: "资深顾问（20分钟视像会议）",
      aiPowered: false,
    },
    {
      number: "03",
      icon: FileText,
      title: "AI 文件初稿",
      subtitle: "你提供资料，AI 生成申请文件",
      description: "商业计划书、申请表、可行性报告——AI 帮你起好初稿",
      humanRole: "AI 系统生成",
      aiPowered: true,
    },
    {
      number: "04",
      icon: Shield,
      title: "专业顾问审核",
      subtitle: "每份文件都有人手把关",
      description: "我们的顾问亲自校对，确保符合政策导向同评审逻辑",
      humanRole: "资深顾问（全场面把关）",
      aiPowered: false,
    },
    {
      number: "05",
      icon: Clock,
      title: "代提交申请",
      subtitle: "我们帮你搞掂最后一步",
      description: "帮你对接相关部门，确保文件格式正确，准时提交",
      humanRole: "我们的团队全程代办",
      aiPowered: false,
    },
  ],
};

const threeTierPricing = {
  "zh-HK": [
    {
      tier: "評估",
      price: "免費",
      description: "知道自己夾唔夾申請資助",
      features: [
        "3分鐘 AI 評估",
        "個人化補貼報告",
        "初步申請方向建議",
      ],
      cta: "立即評估",
      highlight: false,
    },
    {
      tier: "代辦",
      price: "固定費用",
      description: "由零開始幫你搞掂申請",
      features: [
        "專人解讀評估報告",
        "AI 文件生成（初稿）",
        "專業顧問審核把關",
        "代提交申請",
        "全程進度通報",
      ],
      cta: "了解詳情",
      highlight: true,
    },
    {
      tier: "顧問",
      price: "月費計劃",
      description: "長期陪伴你嘅創業路",
      features: [
        "所有代辦服務",
        "每月策略諮詢會議",
        "優先新政策通知",
        "公司註冊指導",
        "生態資源對接",
      ],
      cta: "聯絡我們",
      highlight: false,
    },
  ],
  "zh-CN": [
    {
      tier: "评估",
      price: "免费",
      description: "知道自己夹唔夹申请资助",
      features: [
        "3分钟 AI 评估",
        "个人化补贴报告",
        "初步申请方向建议",
      ],
      cta: "立即评估",
      highlight: false,
    },
    {
      tier: "代办",
      price: "固定费用",
      description: "由零开始帮你搞掂申请",
      features: [
        "专人解读评估报告",
        "AI 文件生成（初稿）",
        "专业顾问审核把关",
        "代提交申请",
        "全程进度通报",
      ],
      cta: "了解详情",
      highlight: true,
    },
    {
      tier: "顾问",
      price: "月费计划",
      description: "长期陪伴你的创业路",
      features: [
        "所有代办服务",
        "每月策略谘询会议",
        "优先新政策通知",
        "公司注册指导",
        "生态资源对接",
      ],
      cta: "联络我们",
      highlight: false,
    },
  ],
};

export default function ServiceProcess() {
  const { language, t } = useLanguage();
  const lang = language as "zh-HK" | "zh-CN";
  const currentSteps = steps[lang];
  const pricing = threeTierPricing[lang];

  return (
    <div className="space-y-20">
      {/* Service Process Section */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {lang === "zh-HK" ? "服務流程" : "服务流程"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "zh-HK"
              ? "每一步都有 AI 加速 + 專業顧問把關——你唔係一個人"
              : "每一步都有 AI 加速 + 专业顾问把关——你不是一个人"}
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {currentSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className={`relative z-10 bg-card border rounded-xl p-5 h-full flex flex-col ${
                    step.aiPowered 
                      ? "border-primary/30 bg-primary/5" 
                      : "border-muted"
                  }`}>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl font-bold text-primary/20">
                        {step.number}
                      </span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.aiPowered 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                    <p className="text-xs text-primary font-medium mb-2">{step.subtitle}</p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground flex-1 mb-3">
                      {step.description}
                    </p>

                    {/* Human Role Badge */}
                    <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                      step.aiPowered
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {step.aiPowered ? (
                        <>
                          <Sparkles className="w-3 h-3" />
                          AI 驅動
                        </>
                      ) : (
                        <>
                          <Users className="w-3 h-3" />
                          真人負責
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {lang === "zh-HK"
              ? "💡 AI 負責加速，人工負責把關——兩者缺一不可"
              : "💡 AI 负责加速，人工负责把关——两者缺一不可"}
          </p>
        </motion.div>
      </section>

      {/* Three-Tier Pricing Section */}
      <section className="bg-muted/30 -mx-4 px-4 py-16 rounded-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {lang === "zh-HK" ? "收費模式" : "收费模式"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "zh-HK"
              ? "三個層次，適合你嘅唔同階段"
              : "三个层次，适合你的不同阶段"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((item, i) => (
            <motion.div
              key={item.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl p-6 flex flex-col h-full ${
                item.highlight
                  ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                  : "bg-card border"
              }`}
            >
              {item.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                  {lang === "zh-HK" ? "最受歡迎" : "最受欢迎"}
                </div>
              )}

              <div className="mb-4">
                <h3 className={`text-lg font-bold ${item.highlight ? "" : "text-foreground"}`}>
                  {item.tier}
                </h3>
                <p className={`text-3xl font-bold mt-2 ${item.highlight ? "" : "text-primary"}`}>
                  {item.price}
                </p>
                <p className={`text-sm mt-1 ${item.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {item.description}
                </p>
              </div>

              <ul className={`space-y-2 flex-1 ${item.highlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {item.features.map((feature, fi) => (
                  <li key={fi} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${item.highlight ? "text-primary-foreground" : "text-primary"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {item.highlight ? (
                  <a
                    href="/free-assessment"
                    className="block w-full py-2.5 px-4 bg-white text-primary font-semibold rounded-lg text-center hover:bg-primary-foreground/90 transition-colors"
                  >
                    {item.cta}
                  </a>
                ) : (
                  <button
                    className={`w-full py-2.5 px-4 border rounded-lg font-semibold transition-colors ${
                      item.highlight
                        ? "bg-white text-primary border-white hover:bg-primary-foreground/90"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    }`}
                  >
                    {item.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-3 bg-card border rounded-full px-6 py-3">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            {lang === "zh-HK"
              ? "我哋自己走過前海申請路，先有能力帶你走"
              : "我们自己走过前海申请路，先有能力带你走"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
