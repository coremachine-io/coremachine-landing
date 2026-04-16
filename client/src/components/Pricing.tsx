import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Rocket, Building2, Users, Zap, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function Pricing() {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAI体验 = () => {
    if (!email) {
      toast.error(language === "zh-HK" ? "請輸入 email" : "请输入 email");
      return;
    }
    toast.success(language === "zh-HK" ? "報告將發送至你的 email！" : "报告将发送至你的 email！");
    scrollToSection("ai-generator");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
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
                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => scrollToSection("subsidy")}
                >
                  {t("pricing.free.cta")}
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
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
                {language === "zh-HK" ? "email 換" : "email 换"}
              </div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <Button
                  className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => scrollToSection("ai-generator")}
                >
                  {t("pricing.starter.cta")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
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
                  onClick={() => scrollToSection("contact")}
                >
                  {t("pricing.pro.cta")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enterprise - 隱藏式引導 */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {language === "zh-HK" ? "需要企業級方案？" : "需要企业级方案？"}
          </p>
          <Button variant="link" onClick={() => scrollToSection("contact")}>
            <Users className="h-4 w-4 mr-2" />
            {t("pricing.enterprise.cta")} →
          </Button>
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
    </div>
  );
}
