import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, Sparkles, FileText, Users, Check, Download, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIDocumentGenerator from "@/components/AIDocumentGenerator";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    contact: "",
    email: "",
    needs: "",
  });
  const [templateEmail, setTemplateEmail] = useState("");

  const submitConsultation = trpc.consultation.submit.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setConsultationForm({ name: "", contact: "", email: "", needs: "" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const downloadTemplate = trpc.template.download.useMutation({
    onSuccess: (data) => {
      // 創建下載鏈接
      const blob = new Blob([data.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(language === "zh-HK" ? "下載成功！" : "下载成功！");
      setTemplateEmail("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitConsultation.mutate({
      ...consultationForm,
      language,
    });
  };

  const handleTemplateDownload = (templateType: "subsidy_application" | "personal_statement") => {
    downloadTemplate.mutate({
      templateType,
      language,
      email: templateEmail,
      ipAddress: undefined,
      userAgent: navigator.userAgent,
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground cyber-grid">
      {/* WhatsApp 懸浮按鈕 */}
      <WhatsAppButton phoneNumber="85291444340" />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold neon-text">Core Machine</span>
          </a>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("mission")} className="text-sm hover:text-primary transition-colors">
              {t("nav.story")}
            </button>
            <button onClick={() => scrollToSection("subsidy")} className="text-sm hover:text-primary transition-colors">
              {language === "zh-HK" ? "資助一覽" : "资助一览"}
            </button>
            <button onClick={() => scrollToSection("ai-generator")} className="text-sm hover:text-primary transition-colors">
              {t("nav.freeResources")}
            </button>
            <a href="/pricing" className="text-sm hover:text-primary transition-colors">
              {t("nav.pricing")}
            </a>
            <button onClick={() => scrollToSection("contact")} className="text-sm hover:text-primary transition-colors">
              {t("nav.contact")}
            </button>
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
            <Button onClick={() => scrollToSection("contact")} className="gap-2">
              {t("hero.cta.primary")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

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
            {t("hero.tagline")}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="neon-text">Core Machine</span>
            <br />
            <span className="text-3xl md:text-5xl text-muted-foreground mt-4 block">
              {language === "zh-HK" ? "港澳青年前海創業 AI 加速器" : "港澳青年前海创业 AI 加速器"}
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === "zh-HK"
              ? "用 AI 驗證每一個資助申請的可能——從自己開始，幫客戶複製成功。我哋幫你由零開始，申請資助、建立公司、實現夢想。"
              : "用 AI 验证每一个资助申请的可能——从自己开始，帮客户复制成功。我们帮你由零开始，申请资助、建立公司、实现梦想。"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => scrollToSection("ai-generator")} className="gap-2 text-lg px-8">
              {language === "zh-HK" ? "免費試用 AI" : "免费试用 AI"}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/pricing'} className="gap-2 text-lg px-8">
              <Sparkles className="h-5 w-5" />
              {t("nav.pricing")}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">{t("mission.title")}</h2>
          <p className="text-2xl text-accent font-semibold">{t("mission.subtitle")}</p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("mission.description")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-primary">{t("story.challenge.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("story.challenge.content")}</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/30">
            <CardHeader>
              <CardTitle className="text-secondary">{t("story.solution.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("story.solution.content")}</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="text-accent">{t("story.vision.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("story.vision.content")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Story - 準備中 */}
      <section className="container py-12">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30">
          <CardContent className="text-center py-12">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">{t("success.title")}</h3>
            <p className="text-muted-foreground mb-6">{t("success.subtitle")}</p>
            <Button onClick={() => scrollToSection("contact")} className="gap-2">
              {t("success.cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 中港創業資助一覽 Section */}
      <section id="subsidy" className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold">{t("fund.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("fund.subtitle")}</p>
        </motion.div>

        {/* Fund Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {/* OPC 國際社區 */}
          <Card className="border-primary/30 hover:border-primary/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{t("fund.opc.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.opc.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{t("fund.opc.amount")}</p>
                <p className="text-sm text-secondary font-medium">+ {t("fund.opc.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.opc.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.opc.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* 深圳智能券 */}
          <Card className="border-secondary/30 hover:border-secondary/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-secondary/10 text-secondary rounded-full">{t("fund.smartcoupon.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.smartcoupon.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-secondary">{t("fund.smartcoupon.amount")}</p>
                <p className="text-sm text-secondary font-medium">+ {t("fund.smartcoupon.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.smartcoupon.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.smartcoupon.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* 鯤鵬青年創新創業項目 */}
          <Card className="border-accent/30 hover:border-accent/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-accent/10 text-accent rounded-full">{t("fund.kunpeng.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.kunpeng.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">{t("fund.kunpeng.amount")}</p>
                <p className="text-sm text-accent font-medium">+ {t("fund.kunpeng.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.kunpeng.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.kunpeng.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Cyberport */}
          <Card className="border-primary/30 hover:border-primary/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{t("fund.cyberport.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.cyberport.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{t("fund.cyberport.amount")}</p>
                <p className="text-sm text-secondary font-medium">+ {t("fund.cyberport.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.cyberport.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.cyberport.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* HKSTP */}
          <Card className="border-secondary/30 hover:border-secondary/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-secondary/10 text-secondary rounded-full">{t("fund.hkstp.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.hkstp.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-secondary">{t("fund.hkstp.amount")}</p>
                <p className="text-sm text-secondary font-medium">+ {t("fund.hkstp.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.hkstp.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.hkstp.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* ITF AI 補貼 */}
          <Card className="border-accent/30 hover:border-accent/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-accent/10 text-accent rounded-full">{t("fund.itf.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.itf.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">{t("fund.itf.amount")}</p>
                <p className="text-sm text-accent font-medium">+ {t("fund.itf.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.itf.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.itf.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* GBA 青年創業基金 */}
          <Card className="border-primary/30 hover:border-primary/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{t("fund.gba.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.gba.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{t("fund.gba.amount")}</p>
                <p className="text-sm text-secondary font-medium">+ {t("fund.gba.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.gba.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.gba.eligible")}</p>
              </div>
            </CardContent>
          </Card>

          {/* 粵港澳青年創業計劃 */}
          <Card className="border-secondary/30 hover:border-secondary/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary/50" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-secondary/10 text-secondary rounded-full">{t("fund.youth.tag")}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{t("fund.youth.name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-secondary">{t("fund.youth.amount")}</p>
                <p className="text-sm text-secondary font-medium">+ {t("fund.youth.bonus")}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t("fund.youth.description")}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{t("fund.youth.eligible")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 申請流程 + 文件清單 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* 申請流程 */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">{t("fund.process.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold">{t("fund.process.step1.title")}</p>
                    <p className="text-sm text-muted-foreground">{t("fund.process.step1.desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold">{t("fund.process.step2.title")}</p>
                    <p className="text-sm text-muted-foreground">{t("fund.process.step2.desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold">{t("fund.process.step3.title")}</p>
                    <p className="text-sm text-muted-foreground">{t("fund.process.step3.desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">4</div>
                  <div>
                    <p className="font-semibold">{t("fund.process.step4.title")}</p>
                    <p className="text-sm text-muted-foreground">{t("fund.process.step4.desc")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 文件清單 */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">{t("fund.docs.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t("fund.docs.business")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t("fund.docs.reg")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t("fund.docs.id")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t("fund.docs.financial")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t("fund.docs.tech")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t("fund.docs.other")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={() => scrollToSection("contact")} className="gap-2 text-lg px-8">
            {t("fund.cta.button")}
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-3">{t("fund.cta.subtitle")}</p>
        </div>
      </section>

      {/* AI Document Generator Section */}

      {/* AI Generator Section - Free Experience */}
      <section id="ai-generator" className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-block px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-sm font-medium mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />
            {language === "zh-HK" ? "免費體驗" : "免费体验"}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            {language === "zh-HK" ? "AI 資助配對報告" : "AI 资助配对报告"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === "zh-HK"
              ? "輸入你嘅背景資料，即時獲得個人化資助配對報告（PDF）。免費一次，email 換取。"
              : "输入你的背景资料，即时获得个人化资助配对报告（PDF）。免费一次，email 换取。"}
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <AIDocumentGenerator />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container py-20 bg-card/30 rounded-3xl my-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "立即開始" : "立即开始"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === "zh-HK" ? "填寫表單，我哋會儘快聯絡你" : "填写表单，我们会尽快联络你"}
            </p>
          </div>

          <form onSubmit={handleConsultationSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("contact.form.name")}</Label>
              <Input
                id="name"
                required
                placeholder={t("contact.form.name.placeholder")}
                value={consultationForm.name}
                onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">{t("contact.form.contact")}</Label>
              <Input
                id="contact"
                required
                placeholder={t("contact.form.contact.placeholder")}
                value={consultationForm.contact}
                onChange={(e) => setConsultationForm({ ...consultationForm, contact: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("contact.form.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("contact.form.email.placeholder")}
                value={consultationForm.email}
                onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="needs">{t("contact.form.needs")}</Label>
              <Textarea
                id="needs"
                required
                rows={5}
                placeholder={t("contact.form.needs.placeholder")}
                value={consultationForm.needs}
                onChange={(e) => setConsultationForm({ ...consultationForm, needs: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full text-lg py-6" disabled={submitConsultation.isPending}>
              {submitConsultation.isPending ? t("contact.form.submitting") : t("contact.form.submit")}
            </Button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <a href="/" className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Core Machine</span>
              </a>
              <p className="text-sm text-muted-foreground">
                {language === "zh-HK"
                  ? "港澳青年前海創業 AI 加速器"
                  : "港澳青年前海创业 AI 加速器"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "zh-HK"
                  ? "用 AI 驗證每一個資助申請的可能"
                  : "用 AI 验证每一个资助申请的可能"}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.services.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="/pricing" className="hover:text-primary">{t("footer.pricing")}</a></p>
                <p><a href="/#subsidy" className="hover:text-primary">{t("footer.services.subsidy")}</a></p>
                <p><a href="/#ai-generator" className="hover:text-primary">{t("footer.services.ai")}</a></p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.resources.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="/#subsidy" className="hover:text-primary">{t("footer.resources.templates")}</a></p>
                <p><a href="/#contact" className="hover:text-primary">{t("footer.faq")}</a></p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.about")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="/#mission" className="hover:text-primary">{language === "zh-HK" ? "我哋嘅使命" : "我们的使命"}</a></p>
                <p><a href="/#contact" className="hover:text-primary">{t("nav.contact")}</a></p>
                <p>{t("footer.contact.email")}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2026 Core Machine Limited. {language === "zh-HK" ? "版權所有。" : "版权所有。"} | <a href="/pricing" className="hover:text-primary">{t("footer.terms")}</a> | <a href="/pricing" className="hover:text-primary">{t("footer.privacy")}</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
