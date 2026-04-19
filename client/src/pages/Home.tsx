import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, Sparkles, ArrowRight, CheckCircle2, Users, FileText, Clock, Globe, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import WhatsAppButton from "@/components/WhatsAppButton";
import CaseDisplay from "@/components/CaseDisplay";

// Simple 3-step "How it Works"
function HowItWorks() {
  const { language } = useLanguage();
  const steps = language === "zh-HK" ? [
    { icon: Sparkles, title: "免費評估", desc: "3分鐘知道夾唔夾申請補貼", time: "3 分鐘" },
    { icon: FileText, title: "AI 分析報告", desc: "個人化補貼配對 + 文件初稿", time: "AI 即時生成" },
    { icon: Users, title: "專人代辦", desc: "顧問幫你搞掂申請流程", time: "全程跟進" },
  ] : [
    { icon: Sparkles, title: "免费评估", desc: "3分钟知道夹唔夹申请补贴", time: "3 分钟" },
    { icon: FileText, title: "AI 分析报告", desc: "个人化补贴配对 + 文件初稿", time: "AI 即时生成" },
    { icon: Users, title: "专人代办", desc: "顾问帮你搞掂申请流程", time: "全程跟进" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {language === "zh-HK" ? "點樣運作" : "如何运作"}
          </h2>
          <p className="text-muted-foreground">
            {language === "zh-HK"
              ? "三步，幫你由零到補貼申請完成"
              : "三步，帮你由零到补贴申请完成"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center h-full hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{step.desc}</p>
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                      {step.time}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Trust signals bar
function TrustBar() {
  const { language } = useLanguage();
  const signals = language === "zh-HK" ? [
    "127+ 創業者已使用",
    "3 分鐘免費評估",
    "AI + 真人把關",
  ] : [
    "127+ 创业者已使用",
    "3 分钟免费评估",
    "AI + 真人把关",
  ];

  return (
    <div className="bg-primary/5 border-y border-primary/20 py-4">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-muted-foreground">
          {signals.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Condensed founder story
function FounderStory() {
  const { language } = useLanguage();
  const content = language === "zh-HK" ? {
    title: "我行過呢條路",
    desc: "38歲香港人，親身經歷前海創業由零到補貼申請嘅全過程。",
    quote: "自己走過嘅路，先有資格帶你走。",
    cta: "了解我哋嘅故事 →",
  } : {
    title: "我行过这条路",
    desc: "38岁香港人，亲身经历前海创业由零到补贴申请嘅全过程。",
    quote: "自己走过嘅路，先有资格带你走。",
    cta: "了解我们的故事 →",
  };

  return (
    <section className="py-16">
      <div className="container">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="py-8 px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <span className="text-3xl">🚀</span>
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                <p className="text-muted-foreground mb-3">{content.desc}</p>
                <p className="text-primary font-medium italic">"{content.quote}"</p>
              </div>
              <a
                href="#mission"
                className="text-sm text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                {content.cta}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Simple 3-tier pricing preview
function PricingPreview() {
  const { language } = useLanguage();
  const tiers = language === "zh-HK" ? [
    { name: "評估", price: "免費", desc: "知道自己夾唔夾", features: ["3分鐘 AI 評估", "個人化報告"], cta: "立即評估", highlight: false },
    { name: "代辦", price: "固定費用", desc: "幫你搞掂申請", features: ["AI 文件生成", "專人審核", "代提交"], cta: "了解更多", highlight: true },
    { name: "顧問", price: "月費", desc: "長期陪跑", features: ["所有代辦服務", "每月策略會議", "優先政策通知"], cta: "聯絡我們", highlight: false },
  ] : [
    { name: "评估", price: "免费", desc: "知道自己夹唔夹", features: ["3分钟 AI 评估", "个人化报告"], cta: "立即评估", highlight: false },
    { name: "代办", price: "固定费用", desc: "帮你搞掂申请", features: ["AI 文件生成", "专人审核", "代提交"], cta: "了解更多", highlight: true },
    { name: "顾问", price: "月费", desc: "长期陪跑", features: ["所有代办服务", "每月策略会议", "优先政策通知"], cta: "联络我们", highlight: false },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {language === "zh-HK" ? "收費模式" : "收费模式"}
          </h2>
          <p className="text-muted-foreground">
            {language === "zh-HK" ? "三個層次，適合你嘅唔同階段" : "三个层次，适合你的不同阶段"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-6 flex flex-col h-full ${
                tier.highlight
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                  {language === "zh-HK" ? "最受歡迎" : "最受欢迎"}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p className={`text-2xl font-bold mt-1 ${tier.highlight ? "" : "text-primary"}`}>
                  {tier.price}
                </p>
                <p className={`text-sm mt-1 ${tier.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {tier.desc}
                </p>
              </div>

              <ul className={`space-y-2 flex-1 ${tier.highlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {tier.features.map((f) => (
                  <li key={f} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-primary-foreground" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {tier.highlight ? (
                  <a
                    href="/free-assessment"
                    className="block w-full py-2.5 px-4 bg-white text-primary font-semibold rounded-lg text-center hover:bg-primary-foreground/90 transition-colors"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <button className="w-full py-2.5 px-4 border rounded-lg font-semibold transition-colors bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    {tier.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* WhatsApp 懸浮按鈕 */}
      <WhatsAppButton phoneNumber="85291444340" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <Rocket className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Core Machine</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-primary transition-colors">
              {language === "zh-HK" ? "點樣運作" : "如何运作"}
            </button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-primary transition-colors">
              {language === "zh-HK" ? "收費" : "收费"}
            </button>
            <button onClick={() => scrollToSection("cases")} className="hover:text-primary transition-colors">
              {language === "zh-HK" ? "案例" : "案例"}
            </button>
            <a href="/subsidies" className="hover:text-primary transition-colors">
              {language === "zh-HK" ? "資助一覽" : "资助一览"}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "zh-HK" ? "zh-CN" : "zh-HK")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === "zh-HK" ? "繁" : "简"}
            </Button>
            <Button asChild className="gap-2">
              <a href="/free-assessment">
                {language === "zh-HK" ? "免費評估" : "免费评估"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-primary">Core Machine</span>
            <br />
            <span className="text-2xl md:text-4xl text-muted-foreground mt-2 block">
              {language === "zh-HK"
                ? "港澳青年前海創業 AI 加速器"
                : "港澳青年前海创业 AI 加速器"}
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {language === "zh-HK"
              ? "幫你由零開始，申請資助、建立公司。免費評估你嘅補貼資格，AI + 真人全程支援。"
              : "帮你由零开始，申请资助、建立公司。免费评估你的补贴资格，AI + 真人全程支援。"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" asChild className="gap-2 text-base px-8">
              <a href="/free-assessment">
                <Sparkles className="h-5 w-5" />
                {language === "zh-HK" ? "免費評估補貼資格" : "免费评估补贴资格"}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 text-base px-8">
              <a href="https://wa.me/85291444340" target="_blank" rel="noopener noreferrer">
                {language === "zh-HK" ? "WhatsApp 傾傾" : "WhatsApp 倾倾"}
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {language === "zh-HK"
              ? "已幫 127+ 位港澳創業者評估 · 涵蓋科技、餐飲、零售、創意行業"
              : "已帮 127+ 位港澳创业者评估 · 涵盖科技、餐饮、零售、创意行业"}
          </p>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* How It Works */}
      <HowItWorks />

      {/* Pricing */}
      <div id="pricing">
        <PricingPreview />
      </div>

      {/* Cases */}
      <section id="cases" className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {language === "zh-HK" ? "創業者故事" : "创业者故事"}
            </h2>
            <p className="text-muted-foreground">
              {language === "zh-HK"
                ? "我哋協助緊嘅創業者（匿名）"
                : "我们协助紧的创业者（匿名）"}
            </p>
          </motion.div>

          <CaseDisplay />

          <div className="text-center mt-8">
            <Button asChild size="lg" className="gap-2">
              <a href="/free-assessment">
                <Sparkles className="h-4 w-4" />
                {language === "zh-HK" ? "立即評估你嘅補貼資格" : "立即评估你的补贴资格"}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <div id="mission">
        <FounderStory />
      </div>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === "zh-HK"
              ? "準備好開始你嘅創業之旅？"
              : "准备好开始你的创业之旅？"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === "zh-HK"
              ? "由免費評估開始，我哋陪你走每一步"
              : "由免费评估开始，我们陪你走每一步"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2 text-base px-8">
              <a href="/free-assessment">
                <Sparkles className="h-5 w-5" />
                {language === "zh-HK" ? "免費評估補貼資格" : "免费评估补贴资格"}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 text-base px-8">
              <a href="https://wa.me/85291444340" target="_blank" rel="noopener noreferrer">
                {language === "zh-HK" ? "WhatsApp 傾傾" : "WhatsApp 倾倾"}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Core Machine</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/subsidies" className="hover:text-primary transition-colors">
                {language === "zh-HK" ? "資助一覽" : "资助一览"}
              </a>
              <a href="/policy" className="hover:text-primary transition-colors">
                {language === "zh-HK" ? "政策資訊" : "政策资讯"}
              </a>
              <a href="/free-assessment" className="hover:text-primary transition-colors">
                {language === "zh-HK" ? "免費評估" : "免费评估"}
              </a>
            </div>
            <p>© 2025 Core Machine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
