import Hero from '@/components/hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, FileText, MessageSquare, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";

const serviceFlow = [
  { step: "01", title: "免費 AI 評估", desc: "使用 AI 工具評估你的資助資格，無需註冊，30 秒出結果。", icon: Zap },
  { step: "02", title: "文件生成", desc: "輸入個人資料，AI 即時生成專業申請文件與個人陳述。", icon: FileText },
  { step: "03", title: "專家諮詢", desc: "與 Johnny 一對一諮詢，解答申請過程中的所有疑問。", icon: MessageSquare },
  { step: "04", title: "代辦提交", desc: "我們協助整理文件，指導你完成線上提交，跟進審批進度。", icon: Clock },
];

const plans = [
  {
    name: "基礎版",
    price: "HK$1,200",
    period: "/ 月",
    description: "適合初創企業，快速完成註冊同補貼申請",
    features: [
      "每月最多 5 件補貼代辦",
      "文件自動生成",
      "基本支援",
    ],
    highlight: false,
  },
  {
    name: "專業版",
    price: "HK$3,500",
    period: "/ 月",
    description: "全方位支援，包含 AI 內容營銷方案",
    features: [
      "每月最多 20 件補貼代辦",
      "API 存取",
      "客製化政策匹配",
      "優先支援",
    ],
    highlight: true,
  },
  {
    name: "額外服務",
    price: "HK$500",
    period: "/ 次",
    description: "靈活增值，按需使用",
    features: [
      "額外文件審核",
      "個別諮詢",
      "快速加急提交",
    ],
    highlight: false,
  },
];

export default function Subscription() {
  return (
    <>
      <Hero
        title="訂閱方案"
        subtitle="透明固定收費，無成功抽成。選擇適合你的方案，開始前海創業之旅。"
      />

      {/* Service Flow */}
      <section className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">服務流程</h2>
          <p className="text-xl text-muted-foreground">四步搞定前海創業申請</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {serviceFlow.map((flow, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <Card className="h-full border-border hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="text-4xl font-bold text-muted-foreground/30 mb-2">{flow.step}</div>
                  <flow.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{flow.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{flow.desc}</p>
                </CardContent>
              </Card>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-20 bg-card/30 rounded-3xl my-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">收費模式</h2>
          <p className="text-xl text-muted-foreground">透明固定收費，無成功抽成，讓您安心使用 AI 補貼代辦服務。</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className={`h-full relative overflow-hidden ${plan.highlight ? 'border-2 border-secondary' : 'border-border'}`}>
                {plan.highlight && (
                  <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    推薦
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-secondary' : 'text-primary'}`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <Button className={`w-full mt-6 ${plan.highlight ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' : ''}`}>
                    選擇方案 <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            所有方案皆 <strong>不收成功抽成</strong>，費用於每月固定收費，讓您可以提前預算而無額外風險。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">準備好開始了嗎？</h2>
          <p className="text-xl text-muted-foreground">
            先試用我們的免費 AI 評估工具，了解你的資助資格，再決定是否需要進一步服務。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/">
              <Button size="lg" className="gap-2">
                <Zap className="h-5 w-5" />免費 AI 評估
              </Button>
            </a>
            <a href="https://t.me/COOCMbot" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                Telegram 諮詢 <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
