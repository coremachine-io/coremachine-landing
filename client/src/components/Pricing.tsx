import { useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Rocket, Building2, Users, Zap, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

export default function Pricing() {
  const { language, t } = useLanguage();
  const [freeEmail, setFreeEmail] = useState(""); // Free AI card email
  const [starterEmail, setStarterEmail] = useState("");
  const [showStarterCheckout, setShowStarterCheckout] = useState(false);

  const handleAI体验 = () => {
    if (!freeEmail) {
      toast.error(language === "zh-HK" ? "請輸入 email" : "请输入 email");
      return;
    }
    // 直接跳轉到首頁的 AI 生成器試用
    window.location.href = "/#ai-generator";
  };

  const handleStarterCheckout = () => {
    if (!starterEmail) {
      toast.error(language === "zh-HK" ? "請輸入你的 email" : "请输入你的 email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(starterEmail)) {
      toast.error(language === "zh-HK" ? "請輸入有效的 email 地址" : "请输入有效的 email 地址");
      return;
    }
    setShowStarterCheckout(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />
            {t("pricing.subtitle")}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
            <span className="neon-text">{t("pricing.title")}</span>
          </h1>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-2 border-secondary hover:border-secondary/70 transition-all duration-300 relative">
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
                    {t("pricing.ai.emailPlaceholder")}
                  </Label>
                  <Input
                    id="ai-email"
                    type="email"
                    placeholder="your@email.com"
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

          {/* Starter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-2 border-accent hover:border-accent/70 transition-all duration-300 relative">
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                {language === "zh-HK" ? "最受歡迎" : "最受欢迎"}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium px-2 py-1 bg-accent/10 text-accent rounded-full">
                    {t("pricing.starter.tag")}
                  </span>
                </div>
                <CardTitle className="text-2xl">{t("pricing.starter.title")}</CardTitle>
                <CardDescription className="text-2xl font-bold text-accent mt-2">
                  {t("pricing.starter.price")}
                </CardDescription>
                <p className="text-xs text-muted-foreground">{t("pricing.starter.priceYearly")}</p>
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
                      placeholder={language === "zh-HK" ? "你的 email 地址" : "你的 email 地址"}
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
                      {language === "zh-HK" ? "更改 email" : "更改 email"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full border-2 border-primary hover:border-primary/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                {language === "zh-HK" ? "旗艦" : "旗舰"}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {t("pricing.pro.tag")}
                  </span>
                </div>
                <CardTitle className="text-2xl">{t("pricing.pro.title")}</CardTitle>
                <CardDescription className="text-xl font-bold text-primary mt-2">
                  {t("pricing.pro.price")}
                </CardDescription>
                <p className="text-sm text-muted-foreground">{t("pricing.pro.priceMonthly")}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t("pricing.pro.description")}</p>
                <div className="space-y-3">
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
                <Button
                  className="w-full mt-6"
                  asChild
                >
                  <a href="/#contact">
                    {t("pricing.pro.cta")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enterprise - 獨立突出區塊 */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-4">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {language === "zh-HK" ? "企業方案" : "企业方案"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {language === "zh-HK"
                ? "公司註冊 + OPC 秘书 + 全程代辦補貼申請 + 无限次 AI 文件生成。適合認真做大灣區業務的創業者。"
                : "公司注册 + OPC 秘书 + 全程代办补贴申请 + 无限次 AI 文件生成。适合认真做大湾区业务的创业者。"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/#contact">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t("pricing.enterprise.cta")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/free-assessment">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {language === "zh-HK" ? "先做免費評估" : "先做免费评估"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="container pb-8">
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 text-center max-w-2xl mx-auto">
          <p className="text-sm text-orange-400">
            {language === "zh-HK"
              ? "⏰ 前海補貼名額有限，申請資格審批需時 2-6 個月 — 越早申請，越早有結果"
              : "⏰ 前海补贴名额有限，申请资格审批需时 2-6 个月 — 越早申请，越早有结果"}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t("pricing.faq.title")}</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("pricing.faq.q1")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("pricing.faq.a1")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("pricing.faq.q2")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("pricing.faq.a2")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("pricing.faq.q3")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("pricing.faq.a3")}</p>
            </CardContent>
          </Card>
        </div>
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
            className="text-primary hover:underline"
          >
            {language === "zh-HK"
              ? "📧 聯絡我們處理訂閱"
              : "📧 联络我们处理订阅"}
          </a>
        </div>
      </section>
    </div>
  );
}
