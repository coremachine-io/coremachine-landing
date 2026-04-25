import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc-client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Rocket, Sparkles, FileText, Users, Check, Download, Globe, ArrowRight, MessageCircle, Zap, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    contact: "",
    email: "",
    needs: "",
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [csrfSessionId, setCsrfSessionId] = useState("");
  const [templateEmail, setTemplateEmail] = useState("");

  // 獲取 CSRF Token
  const csrfQuery = trpc.csrf.getToken.useQuery(undefined, {
    enabled: false, // 手動觸發
  });

  useEffect(() => {
    // 頁面載入時獲取 CSRF token
    csrfQuery.refetch().then((result) => {
      if (result.data) {
        setCsrfToken(result.data.token);
        setCsrfSessionId(result.data.sessionId);
      }
    });
  }, []);

  // AI Generator states
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [aiForm, setAiForm] = useState({
    name: "",
    age: 30,
    education: "bachelor" as "associate" | "bachelor" | "master" | "doctorate",
    industry: "",
    experience: "",
    motivation: "",
    isFounder: true,
    companyName: "",
    targetCompany: "",
    goals: "subsidy" as "subsidy" | "opc" | "both",
    email: "",
  });

  // Listen for external CTA trigger (e.g., from CtaButton)
  useEffect(() => {
    const handleOpenGenerator = () => setShowAIGenerator(true);
    window.addEventListener("open-ai-generator", handleOpenGenerator);
    return () => window.removeEventListener("open-ai-generator", handleOpenGenerator);
  }, []);

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
      const blob = new Blob([data.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(language === "zh-HK" ? "\u4e0b\u8f09\u6210\u529f\uff01" : "\u4e0b\u8f7d\u6210\u529f\uff01");
      setTemplateEmail("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const generateAIDocument = trpc.ai.generateDocument.useMutation({
    onSuccess: (data) => {
      // If user provided email, show email confirmation; otherwise show download
      if (aiForm.email) {
        toast.success(
          language === "zh-HK"
            ? `文件已生成，正發送到 ${aiForm.email}！`
            : `文件已生成，正发送到 ${aiForm.email}！`
        );
      } else {
        toast.success(
          language === "zh-HK" ? "文件生成成功！" : "文件生成成功！"
        );
      }
      const blob = new Blob([data.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowAIGenerator(false);
      setAiForm({
        name: "", age: 30, education: "bachelor", industry: "",
        experience: "", motivation: "", isFounder: true,
        companyName: "", targetCompany: "", goals: "subsidy", email: "",
      });
      setFormStep(1);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 前端驗證
    if (!consultationForm.name.trim()) {
      toast.error(language === "zh-HK" ? "請輸入姓名" : "请输入姓名");
      return;
    }
    if (!consultationForm.contact.trim()) {
      toast.error(language === "zh-HK" ? "請輸入聯絡方式" : "请输入联络方式");
      return;
    }
    if (consultationForm.needs.trim().length < 10) {
      toast.error(language === "zh-HK" ? "請詳細描述您的需求（至少10字）" : "请详细描述您的需求（至少10字）");
      return;
    }
    if (!csrfToken || !csrfSessionId) {
      toast.error(language === "zh-HK" ? "安全驗證載入中，請稍候再試" : "安全验证载入中，请稍候再试");
      // 重新獲取 token
      csrfQuery.refetch().then((result) => {
        if (result.data) {
          setCsrfToken(result.data.token);
          setCsrfSessionId(result.data.sessionId);
        }
      });
      return;
    }
    submitConsultation.mutate({
      ...consultationForm,
      language,
      csrfToken,
      sessionId: csrfSessionId,
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

  const handleAIGenerate = (documentType: "subsidy_application" | "personal_statement") => {
    generateAIDocument.mutate({
      documentType,
      language,
      email: aiForm.email || undefined,
      userInfo: {
        name: aiForm.name,
        age: aiForm.age,
        background: aiForm.education,
        businessIdea: aiForm.industry,
        experience: aiForm.experience,
        motivation: aiForm.motivation,
        companyName: aiForm.companyName,
        targetCompany: aiForm.targetCompany,
        fundingNeeds: undefined,
        otherInfo: undefined,
      },
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground cyber-grid">
      <WhatsAppButton phoneNumber="85291444340" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold neon-text">{t("hero.title")}</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/free-resources" className="text-sm hover:text-primary transition-colors">免費資源</a>
            <a href="/witness-journey" className="text-sm hover:text-primary transition-colors">見證之旅</a>
            <a href="/subscription" className="text-sm hover:text-primary transition-colors">訂閱方案</a>
            <button onClick={() => scrollToSection("contact")} className="text-sm hover:text-primary transition-colors">聯絡我們</button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "zh-HK" ? "zh-CN" : "zh-HK")} className="gap-2">
              <Globe className="h-4 w-4" />
              {language === "zh-HK" ? "繁" : "简"}
            </Button>
            <Button onClick={() => setShowAIGenerator(true)} className="gap-2">
              <Zap className="h-4 w-4" />免費 AI 評估
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section — Johnny's Personal Story */}
      <section className="container py-24 md:py-36">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />
            {language === "zh-HK" ? "一個香港人嘅北上故事" : "一个香港人的北上故事"}
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="neon-text">
              {language === "zh-HK" 
                ? "我 38 歲，由香港走到前海" 
                : "我 38 岁，由香港走到前海"}
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-muted-foreground mt-4 block">
              {language === "zh-HK" 
                ? "用 9 個月行晒所有冤枉路" 
                : "用 9 个月行晒所有冤枉路"}
            </span>
            <br />
            <span className="text-2xl md:text-4xl text-primary mt-4 block">
              {language === "zh-HK" 
                ? "然後畫咗張地圖俾你" 
                : "然后画了张地图给你"}
            </span>
          </h1>
          
          {/* Sub-headline — Johnny's voice */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {language === "zh-HK"
              ? "我係 Johnny，38 歲由香港金融業轉戰前海。香港上升空間窄、前海機遇前所未有——但補貼門路複雜，文件要求繁瑣。我用 9 個月先搞清楚玩法，而家做成呢張「地圖」。"
              : "我是 Johnny，38 岁由香港金融业转战前海。香港上升空间窄、前海机遇前所未有——但补贴门路复杂，文件要求繁琐。我用 9 个月先搞清楚玩法，现在做成这张「地图」。"}
          </p>
          
          {/* Why me? */}
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            {[
              language === "zh-HK" ? "✅ 香港出生，幾時北上都知" : "✅ 香港出生，几时北上都知道",
              language === "zh-HK" ? "✅ 行過晒所有冤枉路" : "✅ 行过晒所有冤枉路",
              language === "zh-HK" ? "✅ 而家畫圖教你" : "✅ 现在画图教你",
            ].map((item, i) => (
              <p key={i} className="text-base text-foreground bg-primary/5 px-4 py-2 rounded-lg">{item}</p>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={() => setShowAIGenerator(true)} 
              className="gap-2 text-lg px-10 py-7 h-auto"
            >
              <Zap className="h-5 w-5" />
              {language === "zh-HK" ? "免費評估我合唔合資格" : "免费评估我合不合资格"}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection("founder-story")} 
              className="gap-2 text-lg px-10 py-7 h-auto"
            >
              <Users className="h-5 w-5" />
              {language === "zh-HK" ? "了解我點解要做呢件事" : "了解我为什么要做这件事"}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Problem / Solution Section */}
      <section className="container py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === "zh-HK" ? "九成香港創業者都遇到這三個問題" : "九成香港创业者都遇到这三个问题"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "zh-HK"
                ? "並非你不了解，而是沒人為你解釋清楚"
                : "不是你不懂，是没人跟你讲清楚"}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <CardTitle className="text-lg">
                  {language === "zh-HK" ? "不了解有什麼資助適合自己" : "不知道有什么资助适合自己"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === "zh-HK"
                    ? "前海有十幾種補貼，每種資格不同。大多數人只聽過兩三種，漏了最適合自己的。"
                    : "前海有十几种补贴，每种资格不同。大多数人只听过两三种，漏了最适合自己的。"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <FileText className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle className="text-lg">
                  {language === "zh-HK" ? "文件繁復，不知如何填寫" : "文件复杂，不知道怎么填"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === "zh-HK"
                    ? "申請書、個人陳述、商業計劃書……每份文件都有「隱藏關卡」，填錯一個字就被退件。"
                    : "申请书、个人陈述、商业计划书……每份文件都有「隐藏关卡」，填错一个字就被退件。"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-secondary mb-2" />
                <CardTitle className="text-lg">
                  {language === "zh-HK" ? "擔心受骗，對中介缺乏信任" : "怕被骗，不敢信中介"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === "zh-HK"
                    ? "代辦費用不透明、流程不公開，付完錢之後才發現有更平價的選擇。你想自己掌握主導權。"
                    : "代办费用不透明、流程不公开，付完钱之后才发现有更平价的选择。你想自己掌握主导权。"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center pt-4">
            <p className="text-lg font-medium text-primary">
              {language === "zh-HK"
                ? "我們並非代你前行，而是教你掌握方向。AI 評估免費，主導權在你。"
                : "我们并非代你前行，而是教你掌握方向。AI 评估免费，主导权在你。"}
            </p>
          </div>
        </motion.div>
      </section>

      {/* 你適合嗎？— 目標客戶過濾 */}
      <section id="eligibility" className="container py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-600 text-sm font-medium">
              <AlertCircle className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "你適合嗎？" : "你适合吗？"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === "zh-HK" ? "我哋為呢種人而設" : "我们为这种人而设"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "zh-HK"
                ? "如果你符合以下條件，Core Machine 可能幫到你。如果你唔係，搵其他服務可能更啱。"
                : "如果你符合以下条件，Core Machine 可能帮到你。如果你不是，找其他服务可能更合适。"}
            </p>
          </div>

          {/* 適合的人 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              {language === "zh-HK" ? "✅ 你係我哋嘅目標客戶如果：" : "✅ 你是我们的目标客户如果："}
            </h3>
            {[
              language === "zh-HK" 
                ? "你有香港或澳門居民身份，考慮北上深圳或大灣區創業"
                : "你有香港或澳门居民身份，考虑北上深圳或大湾区创业",
              language === "zh-HK"
                ? "你想申請前海補貼、創業基地入駐，但唔知從何入手"
                : "你想申请前海补贴、创业基地入驻，但不知从何入手",
              language === "zh-HK"
                ? "你想要專業文件（個人陳述、補貼申請），但唔想俾天價代辦費"
                : "你想要专业文件（个人陈述、补贴申请），但不想给天价代办费",
              language === "zh-HK"
                ? "你希望主導整個過程，唔係交晒俾中介"
                : "你希望主导整个过程，不是交晒给中介",
              language === "zh-HK"
                ? "你願意自己學習和準備，唔係完全依賴別人幫你搞掂"
                : "你愿意自己学习和准备，不是完全依赖别人帮你搞掂",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>

          {/* 不適合的人 */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-muted-foreground">
              {language === "zh-HK" ? "❌ 你唔係我哋嘅目標客戶如果：" : "❌ 你不是我们的目标客户如果："}
            </h3>
            {[
              language === "zh-HK"
                ? "你想要一條龍服務，由零幫你搞到掂，唔想自己郁手"
                : "你想要一条龙服务，由零帮你搞到掂，不想自己郁手",
              language === "zh-HK"
                ? "你想快靚正，三日內搞惦所有文件"
                : "你想快靓正，三日内搞惦所有文件",
              language === "zh-HK"
                ? "你完全唔願意自己學習和準備，只想搵人幫你代做"
                : "你完全不愿意学习和准备，只想找人帮你代做",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-muted/30 border border-border rounded-lg p-4">
                <span className="text-muted-foreground flex-shrink-0">✗</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <p className="text-base text-muted-foreground mb-4">
              {language === "zh-HK"
                ? "如果你認為自己係前者，歡迎試用我哋嘅免費 AI 評估。"
                : "如果你认为自己适合前者，欢迎试用我们的免费 AI 评估。"}
            </p>
            <Button 
              size="lg" 
              onClick={() => setShowAIGenerator(true)} 
              className="gap-2 text-lg px-10 py-7 h-auto"
            >
              <Zap className="h-5 w-5" />
              {language === "zh-HK" ? "立即評估（免費）" : "立即评估（免费）"}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Vision & Mission Section — 願景與使命 (Replaces fake case study) */}
      <section id="vision" className="container py-24">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
            <Sparkles className="inline h-4 w-4 mr-2" />
            {language === "zh-HK" ? "願景與使命" : "愿景与使命"}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold">
            {language === "zh-HK" 
              ? "我哋存在，係為咗縮小資訊差距" 
              : "我们存在，是为了缩小资讯差距"}
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {language === "zh-HK"
              ? "香港、澳門青年有大灣區嘅創業夢，但唔知道有邊啲補貼、點樣申請。我哋建立咗一套 AI 系統，由資格評估到文件生成，全部透明公開，陪你由零走到審批通過。"
              : "香港、澳门青年有大湾区的创业梦，但不知道有哪些补贴、怎么申请。我们建立了一套 AI 系统，由资格评估到文件生成，全部透明公开，陪你由零走到审批通过。"}
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-8 text-left">
            {[
              {
                title: language === "zh-HK" ? "工具俾你" : "工具给你",
                desc: language === "zh-HK" 
                  ? "我哋唔會幫你claim補貼。我哋教你邊個係啱、幾多錢、點樣填。你自己掌握主導權。"
                  : "我们不会帮你claim补贴。我们教你哪个是对、多少、怎么填。你自己掌握主导权。",
                icon: "🎯",
              },
              {
                title: language === "zh-HK" ? "資訊透明" : "资讯透明",
                desc: language === "zh-HK"
                  ? "所有資助資格、金額、截止日期完全公開。唔會收完你先話「唔啱」或者「超額」。
"
                  : "所有资助资格、金额、截止日期完全公开。不会收完你才说「不对」或者「超额」。",
                icon: "🔍",
              },
              {
                title: language === "zh-HK" ? "啟發多於推銷" : "启发多于推销",
                desc: language === "zh-HK"
                  ? "就算你最後唔係我哋客人，我都希望你搞清楚自己想點。做明智嘅決定，比成功申請更重要。"
                  : "就算你最后不是我们客人，我都希望你搞清楚自己想怎样。做明智的决定，比成功申请更重要。",
                icon: "🌱",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-primary/20 bg-primary/5 hover:border-primary/40 transition-all">
                  <CardHeader className="pb-3">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="pt-8">
            <Button 
              size="lg" 
              onClick={() => setShowAIGenerator(true)} 
              className="gap-2 text-lg px-10 py-7 h-auto"
            >
              <Zap className="h-5 w-5" />
              {language === "zh-HK" ? "立即評估我合唔合資格" : "立即评估我合不合资格"}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 雙模型把關 — 技術差異化 Section */}
      <section id="dual-model" className="container py-20 bg-card/30 rounded-3xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-sm font-medium">
              <Sparkles className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "核心技術" : "核心技术"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" 
                ? "雙模型把關，你嘅文件有兩次 AI 審閱" 
                : "双模型把关，你的文件有两次 AI 审阅"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "zh-HK"
                ? "其他代辦用通用模板填表格。我哋用兩個頂尖中文大語言模型，先分析、後生成、再有真人把關。"
                : "其他代办用通用模板填表格。我们用两个顶尖中文大语言模型，先分析、后生成、再有真人把关。"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Model 1: Kimi — Policy Analysis */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Kimi（Moonshot）</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {language === "zh-HK" ? "政策分析引擎" : "政策分析引擎"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {language === "zh-HK" 
                      ? "分析你嘅背景，識別最适合的補貼類型"
                      : "分析你的背景，识别最适合的补贴类型"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {language === "zh-HK"
                      ? "比對最新政策，計算預計資助金額"
                      : "对比最新政策，计算预计资助金额"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {language === "zh-HK"
                      ? "識別文件關鍵點，確保符合評審標準"
                      : "识别文件关键点，确保符合评审标准"}
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-200">
                  <p className="text-xs text-muted-foreground">
                    {language === "zh-HK"
                      ? "擅長：深度推理、政策解讀、複雜判斷"
                      : "擅长：深度推理、政策解读、复杂判断"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Model 2: MiniMax — Document Generation */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">MiniMax</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {language === "zh-HK" ? "文件生成引擎" : "文件生成引擎"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {language === "zh-HK"
                      ? "根據 Kimi 分析結果，生成個人化申請文件"
                      : "根据 Kimi 分析结果，生成个性化申请文件"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {language === "zh-HK"
                      ? "即時生成個人陳述、補貼申請表"
                      : "即时生成个人陈述、补贴申请表"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {language === "zh-HK"
                      ? "配合 Johnny 真人審閱，確保準確無誤"
                      : "配合 Johnny 真人审阅，确保准确无误"}
                  </p>
                </div>
                <div className="pt-3 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    {language === "zh-HK"
                      ? "擅長：流暢寫作、格式規範、專業語氣"
                      : "擅长：流畅写作、格式规范、专业语气"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Human Review Note */}
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                {language === "zh-HK" ? "仲有 Johnny 真人把關" : "还有 Johnny 真人把关"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "zh-HK"
                ? "AI 生成的每一份文件，都會由 Johnny 親自審閱，確保內容準確、符合你的實際情況，先會發送俾你。"
                : "AI 生成的每一份文件，都会由 Johnny 亲自审阅，确保内容准确、符合你的实际情况，发给你之前先会过关。"}
            </p>
          </div>

          {/* Comparison note */}
          <div className="text-center">
            <p className="text-base text-muted-foreground">
              {language === "zh-HK"
                ? "傳統方式 = 人工表格審核 / 通用模板填充"
                : "传统方式 = 人工表格审核 / 通用模板填充"}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Founder Story — 三問三答 (Replaces duplicate Platform & Vision) */}
      <section id="founder-story" className="container py-20">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
              <Users className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "創辦人故事" : "创始人故事"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "點解係我？我可以幫你乜？" : "为什么是我？我可以帮你什么？"}
            </h2>
          </div>

          {/* Three Questions */}
          <div className="space-y-8">
            {/* Q1: 職場瓶頸 */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💼</span>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-bold">
                    {language === "zh-HK" ? "Q1：點解要放棄香港嘅一切？" : "Q1：为什么要放弃香港的一切？"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "38歲，從事了十多年金融和科技行業，發現香港的上升空間越來越窄。想轉型，但成本太高、風險太大。問自己：是否就係咁做到退休？"
                      : "38岁，从事十多年金融和科技行业，发现香港的上升空间越来越窄。想转型，但成本太高、风险太大。问自己：是否就这样做到退休？"}
                  </p>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-2">
                    <p className="text-sm text-primary font-medium">
                      {language === "zh-HK" ? "→ 答案：帶著兩個行李箱，一個人搬去前海" : "→ 答案：带着两个行李箱，一个人搬去前海"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Q2: 經歷了什麼 */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-bold">
                    {language === "zh-HK" ? "Q2：北上之後遇到咩困難？" : "Q2：北上之后遇到什么困难？"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "最難嘅並非做生意，而係搞清楚邊度有資金領取、如何領取。搵寫字樓、註冊公司、搞清楚邊啲補貼適合自己——全部親自處理。走錯路、填錯表、漏交文件，每樣都經歷過。"
                      : "最难的并非做生意，而是搞清楚哪里有资金领取、如何领取。找写字楼、注册公司、搞清楚哪些补贴适合自己——全部亲自处理。走错路、填错表、漏交文件，每样都经历过。"}
                  </p>
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-2">
                    <p className="text-sm text-amber-600 font-medium">
                      {language === "zh-HK" ? "→ 結果：用 9 個月行晒所有冤枉路，先搞清遊戲規則" : "→ 结果：用 9 个月行过所有冤枉路，先搞清楚游戏规则"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Q3: 為什麼做這件事 */}
            <div className="bg-card border border-primary/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-bold">
                    {language === "zh-HK" ? "Q3：點解我要做 Core Machine？" : "Q3：为什么我要做 Core Machine？"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "發現九成香港創業者都和我一樣：不了解有什麼資助、不懂得如何申請、擔心受騙。所以創立 Core Machine——並非代你前行，而是繪製地圖俾你，讓你學會自己前行。"
                      : "发现九成香港创业者都和我一样：不知道有什么资助、不懂得如何申请、担心受骗。所以创立 Core Machine——并非代你前行，而是绘制地图给你，让你学会自己前行。"}
                  </p>
                  <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 mt-2">
                    <p className="text-sm text-secondary font-medium">
                      {language === "zh-HK" ? "→ 使命：最可靠嘅導航，係你自己學會睇路" : "→ 使命：最可靠的导航，是你自己学会睇路"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <p className="text-lg text-muted-foreground mb-6">
              {language === "zh-HK"
                ? "我走過嘅路，化作地圖俾你。你準備好未？"
                : "我走过的路，化作地图给你。你准备好了未？"}
            </p>
            <Button 
              size="lg" 
              onClick={() => setShowAIGenerator(true)} 
              className="gap-2 text-lg px-10 py-7 h-auto"
            >
              <Zap className="h-5 w-5" />
              {language === "zh-HK" ? "立即評估我合唔合資格" : "立即评估我合不合资格"}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Company Milestones */}
      <section id="milestones" className="container py-20 bg-card/30 rounded-3xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm font-medium">
              <Calendar className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "平台成長歷程" : "平台成长历程"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "我哋做到咗乜" : "我们做到了什么"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "zh-HK"
                ? "每一步都係學習，每個功能都係為咗幫你走少啲冤枉路"
                : "每一步都是学习，每个功能都是为了帮你走少点冤枉路"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                date: "2025.Q1", 
                title: language === "zh-HK" ? "系統誕生" : "系统诞生",
                desc: language === "zh-HK" 
                  ? "建立初始 AI 評估框架，確認前海創業補貼資格審核邏輯"
                  : "建立初始 AI 评估框架，确认前海创业补贴资格审核逻辑",
                icon: Rocket,
              },
              { 
                date: "2025.Q3", 
                title: language === "zh-HK" ? "服務上線" : "服务上线",
                desc: language === "zh-HK"
                  ? "開放免費 AI 評估，逐步建立大灣區創業補貼資訊庫"
                  : "开放免费 AI 评估，逐步建立大湾区创业补贴资讯库",
                icon: Users,
              },
              { 
                date: "2026.Q1", 
                title: language === "zh-HK" ? "文件生成 + Email 直送" : "文件生成 + Email 直送",
                desc: language === "zh-HK"
                  ? "AI 即時生成補貼申請文件，直接 email 俾用戶，唔使任何中介"
                  : "AI 即时生成补贴申请文件，直接 email 给用户，不用任何中介",
                icon: FileText,
              },
              { 
                date: "2026.Q2", 
                title: language === "zh-HK" ? "持續迭代" : "持续迭代",
                desc: language === "zh-HK"
                  ? "根據用戶反饋優化流程，目標係幫到更多港澳青年喺大灣區落地"
                  : "根据用户反馈优化流程，目标是帮到更多港澳青年在大湾区落地",
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border hover:border-primary/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">{item.date}</div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container py-20 bg-card/30 rounded-3xl my-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">{t("contact.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("contact.subtitle")}</p>
          </div>
          <form onSubmit={handleConsultationSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("contact.form.name")}</Label>
              <Input id="name" required placeholder={t("contact.form.name.placeholder")} value={consultationForm.name} onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">{t("contact.form.contact")}</Label>
              <Input id="contact" required placeholder={t("contact.form.contact.placeholder")} value={consultationForm.contact} onChange={(e) => setConsultationForm({ ...consultationForm, contact: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("contact.form.email")}</Label>
              <Input id="email" type="email" placeholder={t("contact.form.email.placeholder")} value={consultationForm.email} onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="needs">{t("contact.form.needs")}</Label>
              <Textarea id="needs" required rows={5} placeholder={t("contact.form.needs.placeholder")} value={consultationForm.needs} onChange={(e) => setConsultationForm({ ...consultationForm, needs: e.target.value })} />
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={submitConsultation.isPending}>
              {submitConsultation.isPending ? t("contact.form.submitting") : t("contact.form.submit")}
            </Button>
          </form>
        </motion.div>
      </section>

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" />{t("ai.title")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("ai.subtitle")}</p>
              </div>
              <button onClick={() => setShowAIGenerator(false)} className="text-muted-foreground hover:text-foreground text-2xl">\u00d7</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-2 rounded-full ${formStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                <span className="text-xs text-muted-foreground">1/2</span>
                <div className={`flex-1 h-2 rounded-full ${formStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>

              {/* Step 1 */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("ai.form.name")}</Label>
                      <Input value={aiForm.name} onChange={(e) => setAiForm({ ...aiForm, name: e.target.value })} placeholder={t("ai.form.name.placeholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("ai.form.age")}</Label>
                      <Input type="number" min={18} max={60} value={aiForm.age} onChange={(e) => setAiForm({ ...aiForm, age: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ai.form.education")}</Label>
                    <select value={aiForm.education} onChange={(e) => setAiForm({ ...aiForm, education: e.target.value as any })} className="w-full px-3 py-2 bg-input border border-border rounded-lg">
                      <option value="associate">{t("ai.education.associate")}</option>
                      <option value="bachelor">{t("ai.education.bachelor")}</option>
                      <option value="master">{t("ai.education.master")}</option>
                      <option value="doctorate">{t("ai.education.doctorate")}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ai.form.industry")}</Label>
                    <Input value={aiForm.industry} onChange={(e) => setAiForm({ ...aiForm, industry: e.target.value })} placeholder={t("ai.form.industry.placeholder")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ai.form.experience")}</Label>
                    <Textarea value={aiForm.experience} onChange={(e) => setAiForm({ ...aiForm, experience: e.target.value })} placeholder={t("ai.form.experience.placeholder")} rows={3} />
                  </div>
                  <Button onClick={() => setFormStep(2)} className="w-full gap-2">{t("ai.next")}<ArrowRight className="h-4 w-4" /></Button>
                </div>
              )}

              {/* Step 2 */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("ai.form.identity")}</Label>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setAiForm({ ...aiForm, isFounder: true })} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${aiForm.isFounder ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/50"}`}>
                        <Rocket className="h-5 w-5 mx-auto mb-1" /><span className="text-sm font-medium">{t("ai.identity.founder")}</span>
                      </button>
                      <button type="button" onClick={() => setAiForm({ ...aiForm, isFounder: false })} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${!aiForm.isFounder ? "border-secondary bg-secondary/10 text-secondary" : "border-border bg-card hover:border-secondary/50"}`}>
                        <Users className="h-5 w-5 mx-auto mb-1" /><span className="text-sm font-medium">{t("ai.identity.employee")}</span>
                      </button>
                    </div>
                  </div>
                  {aiForm.isFounder ? (
                    <div className="space-y-2">
                      <Label>{t("ai.form.companyName")}</Label>
                      <Input value={aiForm.companyName} onChange={(e) => setAiForm({ ...aiForm, companyName: e.target.value })} placeholder={t("ai.form.companyName.placeholder")} />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>{t("ai.form.targetCompany")}</Label>
                      <Input value={aiForm.targetCompany} onChange={(e) => setAiForm({ ...aiForm, targetCompany: e.target.value })} placeholder={t("ai.form.targetCompany.placeholder")} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>{t("ai.form.motivation")}</Label>
                    <Textarea value={aiForm.motivation} onChange={(e) => setAiForm({ ...aiForm, motivation: e.target.value })} placeholder={t("ai.form.motivation.placeholder")} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ai.form.goals")}</Label>
                    <select value={aiForm.goals} onChange={(e) => setAiForm({ ...aiForm, goals: e.target.value as any })} className="w-full px-3 py-2 bg-input border border-border rounded-lg">
                      <option value="subsidy">{t("ai.goals.subsidy")}</option>
                      <option value="opc">{t("ai.goals.opc")}</option>
                      <option value="both">{t("ai.goals.both")}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ai.form.email")}\uff08{t("ai.form.optional")}\uff09</Label>
                    <Input type="email" value={aiForm.email} onChange={(e) => setAiForm({ ...aiForm, email: e.target.value })} placeholder={t("ai.form.email.placeholder")} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setFormStep(1)} className="flex-1">{t("ai.back")}</Button>
                    <Button onClick={() => handleAIGenerate("personal_statement")} disabled={generateAIDocument.isPending} className="flex-1 gap-2 bg-secondary hover:bg-secondary/90">
                      <FileText className="h-4 w-4" />{t("ai.generate.statement")}
                    </Button>
                    <Button onClick={() => handleAIGenerate("subsidy_application")} disabled={generateAIDocument.isPending} className="flex-1 gap-2">
                      <FileText className="h-4 w-4" />{t("ai.generate.subsidy")}
                    </Button>
                  </div>
                  {generateAIDocument.isPending && (
                    <div className="flex items-center justify-center gap-2 py-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="text-sm text-muted-foreground">{t("ai.generating")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-border pt-4 text-center">
                <p className="text-sm text-muted-foreground">{t("ai.footer.note")}</p>
                <a href="https://t.me/COOCMbot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 text-primary hover:underline text-sm">
                  <MessageCircle className="h-4 w-4" />
                  {language === "zh-HK" ? "\u9700\u8981\u4eba\u5de5\u5e6b\u52a9\uff1fTelegram \u806f\u7d61 COO" : "\u9700\u8981\u4eba\u5de5\u5e2e\u52a9\uff1fTelegram \u8054\u7cfb COO"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" /><span className="text-xl font-bold">{t("footer.company")}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
              <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.contact.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("footer.contact.email")}</p>
                <p>{t("footer.contact.website")}</p>
                <a href="https://t.me/COOCMbot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Telegram: @COOCMbot</a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.services.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/free-resources" className="block hover:text-primary transition-colors">{language === "zh-HK" ? "\u514d\u8cbb\u8cc7\u6e90" : "\u514d\u8d39\u8d44\u6e90"}</a>
                <a href="/subscription" className="block hover:text-primary transition-colors">{language === "zh-HK" ? "\u8a02\u95b1\u65b9\u6848" : "\u8ba2\u9605\u65b9\u6848"}</a>
                <a href="/witness-journey" className="block hover:text-primary transition-colors">{language === "zh-HK" ? "\u898b\u8b49\u4e4b\u65c5" : "\u89c1\u8bc1\u4e4b\u65c5"}</a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.resources.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("footer.resources.templates")}</p>
                <p>{t("footer.resources.blog")}</p>
                <p>{t("footer.resources.faq")}</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">{t("footer.copyright")}</div>
        </div>
      </footer>
    </div>
  );
}
