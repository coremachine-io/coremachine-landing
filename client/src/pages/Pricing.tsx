import { useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import {
  Check,
  Sparkles,
  Rocket,
  Building2,
  Zap,
  ArrowRight,
  Mail,
  Loader2,
  Shield,
  Clock,
  FileCheck,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

// SEO Helmet component
function SEOHead({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
    return () => {
      document.title = "Core Machine";
    };
  }, [title, description]);
  return null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function PricingPage() {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();
  const [freeEmail, setFreeEmail] = useState("");
  const [starterEmail, setStarterEmail] = useState("");
  const [starterYearlyEmail, setStarterYearlyEmail] = useState("");
  const [proEmail, setProEmail] = useState("");
  const [showStarterCheckout, setShowStarterCheckout] = useState(false);
  const [showStarterYearlyCheckout, setShowStarterYearlyCheckout] = useState(false);
  const [showProCheckout, setShowProCheckout] = useState(false);

  const seoTitle = language === "zh-HK"
    ? "訂閱方案 - Core Machine"
    : "订阅方案 - Core Machine";
  const seoDescription = language === "zh-HK"
    ? "選擇適合你的 Core Machine 訂閱方案：免費資源、Starter 月費/年費、或 Pro 企業方案。Stripe 安全付款。"
    : "选择适合你的 Core Machine 订阅方案：免费资源、Starter 月费/年费、或 Pro 企业方案。Stripe 安全付款。";

  const handleAI体验 = () => {
    if (!freeEmail) {
      toast.error(language === "zh-HK" ? "請輸入 email" : "请输入 email");
      return;
    }
    window.location.href = "/#ai-generator";
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleStarterCheckout = () => {
    if (!starterEmail) {
      toast.error(language === "zh-HK" ? "請輸入你的 email" : "请输入你的 email");
      return;
    }
    if (!validateEmail(starterEmail)) {
      toast.error(language === "zh-HK" ? "請輸入有效的 email 地址" : "请输入有效的 email 地址");
      return;
    }
    setShowStarterCheckout(true);
  };

  const handleStarterYearlyCheckout = () => {
    if (!starterYearlyEmail) {
      toast.error(language === "zh-HK" ? "請輸入你的 email" : "请输入你的 email");
      return;
    }
    if (!validateEmail(starterYearlyEmail)) {
      toast.error(language === "zh-HK" ? "請輸入有效的 email 地址" : "请输入有效的 email 地址");
      return;
    }
    setShowStarterYearlyCheckout(true);
  };

  const handleProCheckout = () => {
    if (!proEmail) {
      toast.error(language === "zh-HK" ? "請輸入你的 email" : "请输入你的 email");
      return;
    }
    if (!validateEmail(proEmail)) {
      toast.error(language === "zh-HK" ? "請輸入有效的 email 地址" : "请输入有效的 email 地址");
      return;
    }
    setShowProCheckout(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title={seoTitle} description={seoDescription} />
      <NavBar />

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />
            {t("pricing.subtitle")}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
            <span className="neon-text">{t("pricing.title")}</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "zh-HK"
              ? "無論你係剛起步定係準備擴展業務，我哋都有適合你嘅方案。"
              : "无论你刚起步还是准备扩展业务，我们都有适合你的方案。"}
          </p>
        </motion.div>
      </section>

      {/* Urgency Banner */}
      <section className="container pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
            <Clock className="h-4 w-4" />
            <span>
              {language === "zh-HK"
                ? "⏰ 前海補貼名額有限，申請資格審批需時 2-6 個月 — 越早申請，越早有結果"
                : "⏰ 前海补贴名额有限，申请资格审批需时 2-6 个月 — 越早申请，越早有结果"}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {/* Free */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {t("pricing.free.tag")}
                  </span>
                </div>
                <CardTitle className="text-2xl">{t("pricing.free.title")}</CardTitle>
                <CardDescription className="text-3xl font-bold text-primary mt-2">$0</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t("pricing.free.description")}</p>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t(`pricing.free.feature${i}`)}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/free-resources">
                    {t("pricing.free.cta")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Experience */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-2 border-secondary hover:border-secondary/70 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5 relative">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                    {t("pricing.ai.tag")}
                  </span>
                </div>
                <CardTitle className="text-2xl">{t("pricing.ai.title")}</CardTitle>
                <CardDescription className="text-3xl font-bold text-secondary mt-2">$0</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t("pricing.ai.description")}</p>
                <div className="space-y-3 pt-4">
                  <Label htmlFor="ai-email" className="text-sm">
                    {t("pricing.ai.emailLabel")}
                  </Label>
                  <Input
                    id="ai-email"
                    type="email"
                    placeholder={t("pricing.ai.emailPlaceholder")}
                    value={freeEmail}
                    onChange={(e) => setFreeEmail(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  onClick={handleAI体验}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t("pricing.ai.cta")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Starter Monthly */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-2 border-accent hover:border-accent/70 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                {t("pricing.starter.tag")}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-2xl">{t("pricing.starter.title")}</CardTitle>
                <CardDescription className="text-2xl font-bold text-accent mt-2">
                  HK$38<span className="text-sm font-normal text-muted-foreground">/月</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t("pricing.starter.description")}</p>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t(`pricing.starter.feature${i}`)}</span>
                    </div>
                  ))}
                </div>
                {!showStarterCheckout ? (
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder={t("pricing.starter.emailPlaceholder")}
                      value={starterEmail}
                      onChange={(e) => setStarterEmail(e.target.value)}
                    />
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handleStarterCheckout}
                    >
                      {t("pricing.starter.cta")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center">
                      {language === "zh-HK"
                        ? `將為 ${starterEmail} 開通 Starter`
                        : `将为 ${starterEmail} 开通 Starter`}
                    </p>
                    <StripeCheckoutButton
                      planKey="starter"
                      price="HK$38/月"
                      email={starterEmail}
                      className="bg-accent hover:bg-accent/90"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => setShowStarterCheckout(false)}
                    >
                      t("pricing.starter.changeEmail")
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Starter Yearly */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-2 border-accent/60 hover:border-accent/80 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                t("pricing.starter.savings")
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-2xl">
                  t("pricing.starter.yearly")
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-accent mt-2">
                  HK$388<span className="text-sm font-normal text-muted-foreground">/年</span>
                </CardDescription>
                <p className="text-xs text-muted-foreground">
                  t("pricing.starter.monthlyEquiv")
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === "zh-HK"
                    ? "全年無憂，一次付款享全年服務"
                    : "全年无忧，一次付款享全年服务"}
                </p>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t(`pricing.starter.feature${i}`)}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 bg-accent/10 p-3 rounded-lg">
                    <Sparkles className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-accent">
                      t("pricing.starter.yearlySupport")
                    </span>
                  </div>
                </div>
                {!showStarterYearlyCheckout ? (
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder={t("pricing.starter.emailPlaceholder")}
                      value={starterYearlyEmail}
                      onChange={(e) => setStarterYearlyEmail(e.target.value)}
                    />
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handleStarterYearlyCheckout}
                    >
                      t("pricing.starter.subscribeYearly")
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center">
                      {language === "zh-HK"
                        ? `將為 ${starterYearlyEmail} 開通 Starter 年費`
                        : `将为 ${starterYearlyEmail} 开通 Starter 年费`}
                    </p>
                    <StripeCheckoutButton
                      planKey="starter_yearly"
                      price="HK$388/年"
                      email={starterYearlyEmail}
                      className="bg-accent hover:bg-accent/90"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => setShowStarterYearlyCheckout(false)}
                    >
                      t("pricing.starter.changeEmail")
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Pro Plan - Full Width */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto mt-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-primary hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                {t("pricing.pro.tag")}
              </div>
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      <span className="text-lg font-bold">{t("pricing.pro.title")}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">HK$12,800</span>
                        <span className="text-sm text-muted-foreground">
                          t("pricing.pro.onetime")
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === "zh-HK"
                          ? "或選擇月付 HK$1,800/月"
                          : "或选择月付 HK$1,800/月"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("pricing.pro.description")}</p>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t(`pricing.pro.feature${i}`)}</span>
                        </div>
                      ))}
                      <div className="flex items-start gap-3 bg-primary/10 p-3 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-primary">{t("pricing.pro.bonus")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {!showProCheckout ? (
                      <div className="space-y-3 max-w-sm mx-auto md:mx-0 md:ml-auto">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                          <Label className="text-sm font-medium">
                            language === "zh-HK" ? "輸入你的 email 開始 Pro 方案" : "输入你的 email 开始 Pro 方案"
                          </Label>
                          <Input
                            type="email"
                            placeholder={t("pricing.pro.emailPlaceholder")}
                            value={proEmail}
                            onChange={(e) => setProEmail(e.target.value)}
                          />
                          <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={handleProCheckout}
                          >
                            t("pricing.pro.choosePayment")
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center md:justify-start">
                          <Shield className="h-3 w-3" />
                          <span>{t("pricing.stripePay")}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 max-w-sm mx-auto md:mx-0 md:ml-auto">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                          <p className="text-xs text-muted-foreground text-center">
                            {language === "zh-HK"
                              ? `將為 ${proEmail} 開通 Pro`
                              : `将为 ${proEmail} 开通 Pro`}
                          </p>
                          <div className="space-y-2">
                            <StripeCheckoutButton
                              planKey="pro"
                              price="HK$12,800（一次性）"
                              email={proEmail}
                              className="bg-primary hover:bg-primary/90"
                            />
                            <StripeCheckoutButton
                              planKey="pro_monthly"
                              price="HK$1,800/月"
                              email={proEmail}
                              className="bg-primary/80 hover:bg-primary/70"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            className="w-full text-xs"
                            onClick={() => setShowProCheckout(false)}
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            t("pricing.starter.changeEmail")
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-4">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              t("pricing.enterprise")
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              {language === "zh-HK"
                ? "公司註冊 + OPC 秘书 + 全程代辦補貼申請 + 无限次 AI 文件生成。適合認真做大灣區業務的創業者。"
                : "公司注册 + OPC 秘书 + 全程代办补贴申请 + 无限次 AI 文件生成。适合认真做大湾区业务的创业者。"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/#contact-form">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t("pricing.enterprise.cta")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/free-assessment">
                  <Sparkles className="h-4 w-4 mr-2" />
                  t("pricing.enterpriseCTA")
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Shield className="h-6 w-6 text-primary mx-auto" />
              <p className="text-xs text-muted-foreground">
                t("pricing.stripePay")
              </p>
            </div>
            <div className="space-y-2">
              <Clock className="h-6 w-6 text-primary mx-auto" />
              <p className="text-xs text-muted-foreground">
                t("pricing.cancelAnytime")
              </p>
            </div>
            <div className="space-y-2">
              <FileCheck className="h-6 w-6 text-primary mx-auto" />
              <p className="text-xs text-muted-foreground">
                t("pricing.docReview")
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">{t("pricing.faq.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{t("pricing.faq.q1")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("pricing.faq.a1")}</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{t("pricing.faq.q2")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("pricing.faq.a2")}</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{t("pricing.faq.q3")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("pricing.faq.a3")}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Subscription Management */}
      <section className="container py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            {language === "zh-HK"
              ? "已經訂閱？想管理或取消你的訂閱"
              : "已经订阅？想管理或取消你的订阅"}
          </p>
          <a
            href="mailto:iocoremachine@gmail.com?subject=訂閱管理查詢"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <Mail className="h-3 w-3" />
            {language === "zh-HK"
              ? "聯絡我們處理訂閱"
              : "联络我们处理订阅"}
          </a>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-12" />
    </div>
  );
}
