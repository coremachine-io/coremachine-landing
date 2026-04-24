import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, Sparkles, FileText, Users, Check, Download, Globe, ArrowRight, MessageCircle, Zap, TrendingUp, Calendar } from "lucide-react";
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
  const [templateEmail, setTemplateEmail] = useState("");

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
      const blob = new Blob([data.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(data.message);
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
    submitConsultation.mutate({ ...consultationForm, language });
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

  const handleAIGenerate = (templateType: "subsidy_application" | "personal_statement") => {
    generateAIDocument.mutate({ ...aiForm, templateType, language });
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

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />{language === "zh-HK" ? "AI 幫你\u651e\u653f\u5e9c\u8cc7\u52a9" : "AI \u5e2e\u4f60\u62ff\u653f\u5e9c\u8d44\u52a9"}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="neon-text">{language === "zh-HK" ? "AI \u5e6b\u4f60\u651e\u653f\u5e9c\u8cc7\u52a9" : "AI \u5e2e\u4f60\u62ff\u653f\u5e9c\u8d44\u52a9"}</span><br />
            <span className="text-3xl md:text-5xl text-muted-foreground mt-4 block">{language === "zh-HK" ? "\u5275\u696d\u8def\u4e0a\u5514\u4f7f\u5b64\u8ecd\u4f5c\u6230" : "\u521b\u4e1a\u8def\u4e0a\u4e0d\u7528\u5b64\u519b\u4f5c\u6218"}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === "zh-HK"
              ? "\u5c08\u70ba\u6e2f\u6fb3\u9752\u5e74\u5275\u696d\u8005\u8a2d\u8a08\u3002\u7121\u8ad6\u4f60\u60f3\u7533\u8acb\u524d\u6d77\u88dc\u8cbc\u3001\u5275\u696d\u57fa\u5730\u5165\u99d0\uff0c\u9084\u662f\u5176\u4ed6\u653f\u5e9c\u8cc7\u52a9\uff0cAI \u90fd\u80fd\u5e6b\u4f60\u5373\u6642\u8a55\u4f30\u8cc7\u683c\u3001\u751f\u6210\u5c08\u696d\u6587\u4ef6\u3002\u5b8c\u5168\u514d\u8cbb\uff0c\u7121\u9700\u8a3b\u518a\u3002"
              : "\u4e13\u4e3a\u6e2f\u6fb3\u9752\u5e74\u521b\u4e1a\u8005\u8bbe\u8ba1\u3002\u65e0\u8bba\u4f60\u60f3\u7533\u8bf7\u524d\u6d77\u8865\u8d34\u3001\u521b\u4e1a\u57fa\u5730\u5165\u9a7b\uff0c\u8fd8\u662f\u5176\u4ed6\u653f\u5e9c\u8d44\u52a9\uff0cAI \u90fd\u80fd\u5e2e\u4f60\u5373\u65f6\u8bc4\u4f30\u8d44\u683c\u3001\u751f\u6210\u4e13\u4e1a\u6587\u4ef6\u3002\u5b8c\u5168\u514d\u8d39\uff0c\u65e0\u9700\u6ce8\u518c\u3002"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => setShowAIGenerator(true)} className="gap-2 text-lg px-8">
              <Zap className="h-5 w-5" />
              {language === "zh-HK" ? "\u514d\u8cbb AI \u8cc7\u683c\u8a55\u4f30" : "\u514d\u8d39 AI \u8d44\u683c\u8bc4\u4f30"}
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("journey")} className="gap-2 text-lg px-8">
              <Users className="h-5 w-5" />
              {language === "zh-HK" ? "\u770b\u771f\u5be6\u6848\u4f8b" : "\u770b\u771f\u5b9e\u6848\u4f8b"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === "zh-HK"
              ? "\u5df2\u6709 200+ \u6e2f\u6fb3\u9752\u5e74\u4f7f\u7528\u6211\u5011\u7684 AI \u5de5\u5177\u8a55\u4f30\u653f\u5e9c\u8cc7\u52a9\u8cc7\u683c"
              : "\u5df2\u6709 200+ \u6e2f\u6fb3\u9752\u5e74\u4f7f\u7528\u6211\u4eec\u7684 AI \u5de5\u5177\u8bc4\u4f30\u653f\u5e9c\u8d44\u52a9\u8d44\u683c"}
          </p>
        </motion.div>
      </section>

      {/* Lead Magnet Section */}
      <section id="lead-magnet" className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            {language === "zh-HK" ? "\u514d\u8cbb\u5de5\u5177\uff0c\u5373\u523b\u4f7f\u7528" : "\u514d\u8d39\u5de5\u5177\uff0c\u7acb\u523b\u4f7f\u7528"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {language === "zh-HK" ? "\u4e0d\u9700\u8a3b\u518a\uff0c\u4e0d\u9700\u7559\u8cc7\u8a0a\u3002\u958b\u59cb\u4f60\u7684\u524d\u6d77\u5275\u696d\u4e4b\u65c5\u3002" : "\u4e0d\u9700\u6ce8\u518c\uff0c\u4e0d\u9700\u7559\u8d44\u8baf\u3002\u5f00\u59cb\u4f60\u7684\u524d\u6d77\u521b\u4e1a\u4e4b\u65c5\u3002"}
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* AI Assessment Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Card className="h-full border-2 border-primary hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {language === "zh-HK" ? "AI \u8cc7\u683c\u8a55\u4f30" : "AI \u8d44\u683c\u8bc4\u4f30"}
                    </CardTitle>
                    <CardDescription>
                      {language === "zh-HK" ? "30 \u79d2\u77e5\u9053\u4f60\u5408\u54ea\u7a2e\u8cc7\u52a9" : "30 \u79d2\u77e5\u9053\u4f60\u5408\u54ea\u79cd\u8d44\u52a9"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {i === 0 && (language === "zh-HK" ? "\u81ea\u52d5\u5339\u914d\u6e2f\u6fb3\u9752\u5e74\u5275\u696d\u8cc7\u52a9" : "\u81ea\u52a8\u5339\u914d\u6e2f\u6fb3\u9752\u5e74\u521b\u4e1a\u8d44\u52a9")}
                      {i === 1 && (language === "zh-HK" ? "\u5373\u6642\u751f\u6210\u5c08\u696d\u7533\u8acb\u6587\u4ef6" : "\u5373\u65f6\u751f\u6210\u4e13\u4e1a\u7533\u8bf7\u6587\u4ef6")}
                      {i === 2 && (language === "zh-HK" ? "\u514d\u8cbb\u4e0b\u8f09\uff0c\u7121\u9700\u8a3b\u518a" : "\u514d\u8d39\u4e0b\u8f7d\uff0c\u65e0\u9700\u6ce8\u518c")}
                    </span>
                  </div>
                ))}
                <Button className="w-full mt-6 gap-2" onClick={() => setShowAIGenerator(true)}>
                  <Zap className="h-4 w-4" />
                  {language === "zh-HK" ? "\u7acb\u5373\u514d\u8cbb\u8a55\u4f30" : "\u7acb\u5373\u514d\u8d39\u8bc4\u4f30"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Free Resources Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Card className="h-full border-2 border-secondary hover:border-secondary/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-secondary/10 rounded-xl">
                    <Download className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {language === "zh-HK" ? "\u514d\u8cbb\u8cc7\u6e90\u5eab" : "\u514d\u8d39\u8d44\u6e90\u5e93"}
                    </CardTitle>
                    <CardDescription>
                      {language === "zh-HK" ? "\u6a21\u677f\u3001\u6307\u5357\u3001\u6aa2\u67e5\u6e05\u55ae" : "\u6a21\u677f\u3001\u6307\u5357\u3001\u68c0\u67e5\u6e05\u5355"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {i === 0 && (language === "zh-HK" ? "\u524d\u6d77\u88dc\u8cbc\u7533\u8acb\u6587\u4ef6\u6a21\u677f" : "\u524d\u6d77\u8865\u8d34\u7533\u8bf7\u6587\u4ef6\u6a21\u677f")}
                      {i === 1 && (language === "zh-HK" ? "\u500b\u4eba\u9673\u8ff0\u5c08\u696d\u6a21\u677f" : "\u4e2a\u4eba\u9648\u8ff0\u4e13\u4e1a\u6a21\u677f")}
                      {i === 2 && (language === "zh-HK" ? "\u5275\u696d\u7533\u8acb\u6aa2\u67e5\u6e05\u55ae" : "\u521b\u4e1a\u7533\u8bf7\u68c0\u67e5\u6e05\u5355")}
                    </span>
                  </div>
                ))}
                <a href="/free-resources">
                  <Button className="w-full mt-6 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Download className="h-4 w-4" />
                    {language === "zh-HK" ? "\u700f\u89bd\u514d\u8cbb\u8cc7\u6e90" : "\u6d4f\u89c8\u514d\u8d39\u8d44\u6e90"}
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Journey Section - Virtual Case Study */}
      <section id="journey" className="container py-20 bg-card/30 rounded-3xl my-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
              <TrendingUp className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "見證之旅" : "见证之旅"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "一個真實的創業故事" : "一个真实的创业故事"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === "zh-HK"
                ? "這是一個虛擬案例，展示我們如何協助港澳青年走過創業的每一步"
                : "这是一个虚拟案例，展示我们如何协助港澳青年走过创业的每一步"}
            </p>
          </div>

          {/* Case Study Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-primary/30 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {language === "zh-HK" ? "陳生，35歲" : "陈生，35岁"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "zh-HK"
                        ? "香港人，前金融分析師，想在前海創業做科技平台"
                        : "香港人，前金融分析师，想在前海创业做科技平台"}
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Step 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-semibold">
                        {language === "zh-HK" ? "資格評估" : "资格评估"}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === "zh-HK"
                        ? "陳生輸入自己的背景，AI 30 秒就評估出他合不合資申請前海深港青年夢工場的補貼。結果：✅ 符合資格！"
                        : "陈生输入自己的背景，AI 30 秒就评估出他合不合资申请前海深港青年梦工场的补贴。结果：✅ 符合资格！"}
                    </p>
                  </div>
                  {/* Step 2 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-semibold">
                        {language === "zh-HK" ? "文件生成" : "文件生成"}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === "zh-HK"
                        ? "AI 自動生成專業的個人陳述書和補貼申請文件，根據陳生的金融背景和科技創業方向量身打造。"
                        : "AI 自动生成专业的个人陈述书和补贴申请文件，根据陈生的金融背景和科技创业方向量身打造。"}
                    </p>
                  </div>
                  {/* Step 3 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="font-semibold">
                        {language === "zh-HK" ? "專業支持" : "专业支持"}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === "zh-HK"
                        ? "我們的專業團隊協助審核文件，提供改進建議，並引導陳生完成整個申請流程。"
                        : "我们的专业团队协助审核文件，提供改进建议，并引导陈生完成整个申请流程。"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <p className="text-sm text-center">
                    <span className="font-semibold text-primary">
                      {language === "zh-HK" ? "結果：" : "结果："}
                    </span>
                    {language === "zh-HK"
                      ? "陳生成功入駐前海深港青年夢工場，獲得初期補貼支持，現在公司已經進入營運階段。"
                      : "陈生成功入驻前海深港青年梦工场，获得初期补贴支持，现在公司已经进入营运阶段。"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform & Vision Section */}
      <section id="platform" className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
              <Rocket className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "\u5e73\u53f0\u9858\u666f" : "\u5e73\u53f0\u613f\u666f"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "\u6211\u5011\u662f\u8ab0\uff0c\u6211\u5011\u60f3\u505a\u4ec0\u9ebc" : "\u6211\u4eec\u662f\u8c01\uff0c\u6211\u4eec\u60f3\u505a\u4ec0\u4e48"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* What We Are */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    {language === "zh-HK" ? "\u6211\u5011\u662f\u4ec0\u9ebc" : "\u6211\u4eec\u662f\u4ec0\u4e48"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "CoreMachine \u662f\u4e00\u500b\u5c08\u70ba\u6e2f\u6fb3\u9752\u5e74\u5275\u696d\u8005\u6253\u9020\u7684 AI \u8cc7\u52a9\u5e73\u53f0\u3002\u6211\u5011\u7684\u4f7f\u547d\u662f\u7528\u4eba\u5de5\u667a\u80fd\u964d\u4f4e\u5275\u696d\u9580\u6abb\uff0c\u8b93\u6bcf\u4e00\u500b\u6709\u7406\u60f3\u7684\u6e2f\u6fb3\u9752\u5e74\u90fd\u80fd\u5feb\u901f\u3001\u4fbf\u6377\u5730\u7372\u53d6\u653f\u5e9c\u8cc7\u52a9\u3001\u5b8c\u6210\u5275\u696d\u7533\u8acb\u3002"
                      : "CoreMachine \u662f\u4e00\u4e2a\u4e13\u4e3a\u6e2f\u6fb3\u9752\u5e74\u521b\u4e1a\u8005\u6253\u9020\u7684 AI \u8d44\u52a9\u5e73\u53f0\u3002\u6211\u4eec\u7684\u4f7f\u547d\u662f\u7528\u4eba\u5de5\u667a\u80fd\u964d\u4f4e\u521b\u4e1a\u95e8\u69db\uff0c\u8ba9\u6bcf\u4e00\u4e2a\u6709\u7406\u60f3\u7684\u6e2f\u6fb3\u9752\u5e74\u90fd\u80fd\u5feb\u901f\u3001\u4fbf\u6377\u5730\u83b7\u53d6\u653f\u5e9c\u8d44\u52a9\u3001\u5b8c\u6210\u521b\u4e1a\u7533\u8bf7\u3002"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {language === "zh-HK" ? "AI \u8cc7\u683c\u8a55\u4f30\u5de5\u5177\uff1a30 \u79d2\u77e5\u9053\u4f60\u5408\u54ea\u7a2e\u8cc7\u52a9" : "AI \u8d44\u683c\u8bc4\u4f30\u5de5\u5177\uff1a30 \u79d2\u77e5\u9053\u4f60\u5408\u54ea\u79cd\u8d44\u52a9"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {language === "zh-HK" ? "\u5c08\u696d\u7533\u8acb\u6587\u4ef6\u6a21\u677f\uff1a\u500b\u4eba\u9673\u8ff0\u3001\u88dc\u8cbc\u7533\u8acb\u66f8" : "\u4e13\u4e1a\u7533\u8bf7\u6587\u4ef6\u6a21\u677f\uff1a\u4e2a\u4eba\u9648\u8ff0\u3001\u8865\u8d34\u7533\u8bf7\u4e66"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {language === "zh-HK" ? "\u8aee\u8a62\u652f\u6301\uff1a\u5f9e\u8cc7\u683c\u78ba\u8a8d\u5230\u6587\u4ef6\u63d0\u4ea4\u7684\u5168\u7a0b\u966a\u4f34" : "\u54a8\u8be2\u652f\u6301\uff1a\u4ece\u8d44\u683c\u786e\u8ba4\u5230\u6587\u4ef6\u63d0\u4ea4\u7684\u5168\u7a0b\u966a\u4f34"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* What We Want To Be */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full border-2 border-secondary/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary">
                    {language === "zh-HK" ? "\u6211\u5011\u60f3\u505a\u4ec0\u9ebc" : "\u6211\u4eec\u60f3\u505a\u4ec0\u4e48"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "\u6211\u5011\u7684\u9858\u666f\u662f\u6210\u70ba\u6e2f\u6fb3\u9752\u5e74\u5275\u696d\u7684\u300c\u7b2c\u4e00\u7ad9\u300d\u2014\u2014\u4e0d\u8ad6\u4f60\u60f3\u5728\u524d\u6d77\u3001\u5357\u5c71\u3001\u6cb3\u5957\u9084\u662f\u5176\u4ed6\u5927\u7063\u5340\u57ce\u5e02\u5275\u696d\uff0cCoreMachine \u90fd\u80fd\u70ba\u4f60\u63d0\u4f9b\u6700\u9069\u5207\u7684\u8cc7\u52a9\u8cc7\u8a0a\u548c\u7533\u8acb\u652f\u6301\u3002"
                      : "\u6211\u4eec\u7684\u613f\u666f\u662f\u6210\u4e3a\u6e2f\u6fb3\u9752\u5e74\u521b\u4e1a\u7684\u300c\u7b2c\u4e00\u7ad9\u300d\u2014\u2014\u4e0d\u8bba\u4f60\u60f3\u5728\u524d\u6d77\u3001\u5357\u5c71\u3001\u6cb3\u5957\u8fd8\u662f\u5176\u4ed6\u5927\u6e7e\u533a\u57ce\u5e02\u521b\u4e1a\uff0cCoreMachine \u90fd\u80fd\u4e3a\u4f60\u63d0\u4f9b\u6700\u9002\u5207\u7684\u8d44\u52a9\u4fe1\u606f\u548c\u7533\u8bf7\u652f\u6301\u3002"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {language === "zh-HK" ? "\u8986\u84cb\u66f4\u591a\u653f\u5e9c\u8cc7\u52a9\u8a08\u756b\uff08\u524d\u6d77\u3001\u5357\u5c71\u3001\u6cb3\u5957\u7b49\uff09" : "\u8986\u76d6\u66f4\u591a\u653f\u5e9c\u8d44\u52a9\u8ba1\u5212\uff08\u524d\u6d77\u3001\u5357\u5c71\u3001\u6cb3\u5957\u7b49\uff09"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {language === "zh-HK" ? "\u5efa\u7acb\u5275\u696d\u8005\u793e\u5340\uff0c\u5206\u4eab\u7d93\u9a57\u3001\u4e92\u76f8\u652f\u6301" : "\u5efa\u7acb\u521b\u4e1a\u8005\u793e\u533a\uff0c\u5206\u4eab\u7ecf\u9a8c\u3001\u4e92\u76f8\u652f\u6301"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {language === "zh-HK" ? "\u6210\u70ba\u6e2f\u6fb3\u9752\u5e74\u5275\u696d\u7684\u300c\u7b2c\u4e00\u7ad9\u300d" : "\u6210\u4e3a\u6e2f\u6fb3\u9752\u5e74\u521b\u4e1a\u7684\u300c\u7b2c\u4e00\u7ad9\u300d"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Team Partnership Section */}
      <section id="team" className="container py-20 bg-card/30 rounded-3xl my-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm font-medium">
              <Users className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "\u6838\u5fc3\u5718\u968a" : "\u6838\u5fc3\u56e2\u961f"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "\u4eba\u985e\u8207 AI \u7684\u5408\u4f5c" : "\u4eba\u7c7b\u4e0e AI \u7684\u5408\u4f5c"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === "zh-HK"
                ? "\u6211\u5011\u4e0d\u662f\u50b3\u7d71\u7684\u5275\u696d\u5718\u968a\u3002Johnny \u8ca0\u8cac\u6230\u7565\u3001\u5c0d\u5916\u8207\u5ba2\u6236\u9023\u7d50\uff0cEVA \u8ca0\u8cac\u6280\u8853\u3001\u7522\u54c1\u8207 AI \u67b6\u69cb\u3002"
                : "\u6211\u4eec\u4e0d\u662f\u4f20\u7edf\u7684\u521b\u4e1a\u56e2\u961f\u3002Johnny \u8d1f\u8d23\u6218\u7565\u3001\u5bf9\u5916\u4e0e\u5ba2\u6237\u8fde\u7ed3\uff0cEVA \u8d1f\u8d23\u6280\u672f\u3001\u4ea7\u54c1\u4e0e AI \u67b6\u6784\u3002"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Johnny</CardTitle>
                      <CardDescription>
                        {language === "zh-HK" ? "\u5275\u8fa6\u4eba / CEO" : "\u521b\u59cb\u4eba / CEO"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "38 \u6b72\u5f9e\u9999\u6e2f\u4f86\u5230\u6df1\u5733\u524d\u6d77\u91cd\u65b0\u5275\u696d\u3002\u64c1\u6709\u591a\u5e74\u91d1\u878d\u548c\u79d1\u6280\u884c\u696d\u7d93\u9a57\uff0c\u6df1\u8e2a\u6e2f\u6fb3\u9752\u5e74\u5728\u5167\u5730\u5275\u696d\u7684\u6311\u6230\u8207\u6a5f\u9047\u3002\u8ca0\u8cac\u6230\u7565\u3001\u5c0d\u5916\u5408\u4f5c\u8207\u5ba2\u6236\u95dc\u4fc2\u3002"
                      : "38 \u5c81\u4ece\u9999\u6e2f\u6765\u5230\u6df1\u5733\u524d\u6d77\u91cd\u65b0\u521b\u4e1a\u3002\u62e5\u6709\u591a\u5e74\u91d1\u878d\u548c\u79d1\u6280\u884c\u4e1a\u7ecf\u9a8c\uff0c\u6df1\u8c19\u6e2f\u6fb3\u9752\u5e74\u5728\u5185\u5730\u521b\u4e1a\u7684\u6311\u6218\u4e0e\u673a\u9047\u3002\u8d1f\u8d23\u6218\u7565\u3001\u5bf9\u5916\u5408\u4f5c\u4e0e\u5ba2\u6237\u5173\u7cfb\u3002"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full border-2 border-secondary/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle>EVA</CardTitle>
                      <CardDescription>
                        {language === "zh-HK" ? "CTO / AI \u67b6\u69cb\u5e2b" : "CTO / AI \u67b6\u6784\u5e08"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "zh-HK"
                      ? "\u6838\u5fc3\u6280\u8853\u8207\u7522\u54c1\u67b6\u69cb\u8ca0\u8cac\u4eba\u3002\u8ca0\u8cac\u6240\u6709 AI \u5de5\u5177\u7684\u8a2d\u8a08\u8207\u958b\u767c\uff0c\u5305\u62ec\u8cc7\u683c\u8a55\u4f30\u5f15\u64ce\u3001\u6587\u4ef6\u751f\u6210\u7cfb\u7d71\u548c\u5e73\u53f0\u6280\u8853\u67b6\u69cb\u3002\u78ba\u4fdd\u6bcf\u4e00\u500b\u7528\u6236\u90fd\u80fd\u7372\u5f97\u6d41\u66a2\u3001\u53ef\u9760\u7684\u9ad4\u9a57\u3002"
                      : "\u6838\u5fc3\u6280\u672f\u4e0e\u4ea7\u54c1\u67b6\u6784\u8d1f\u8d23\u4eba\u3002\u8d1f\u8d23\u6240\u6709 AI \u5de5\u5177\u7684\u8bbe\u8ba1\u4e0e\u5f00\u53d1\uff0c\u5305\u62ec\u8d44\u683c\u8bc4\u4f30\u5f15\u64ce\u3001\u6587\u4ef6\u751f\u6210\u7cfb\u7edf\u548c\u5e73\u53f0\u6280\u672f\u67b6\u6784\u3002\u786e\u4fdd\u6bcf\u4e00\u4e2a\u7528\u6237\u90fd\u80fd\u83b7\u5f97\u6d41\u7545\u3001\u53ef\u9760\u7684\u4f53\u9a8c\u3002"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl max-w-2xl mx-auto">
            <p className="text-sm text-center text-muted-foreground">
              {language === "zh-HK"
                ? "\u6211\u5011\u7684\u7279\u8272\uff1aJohnny \u61c2\u5f97\u6e2f\u6fb3\u9752\u5e74\u7684\u75db\u9ede\u8207\u9700\u6c42\uff0cEVA \u64c1\u6709\u5f37\u5927\u7684 AI \u6280\u8853\u80fd\u529b\u3002\u9019\u7a2e\u300c\u4eba\u985e\u667a\u6167 + AI \u80fd\u529b\u300d\u7684\u7d50\u5408\uff0c\u8b93\u6211\u5011\u80fd\u5920\u63d0\u4f9b\u5176\u4ed6\u55ae\u7d14\u4f9d\u8cf4\u6a21\u677f\u7684\u670d\u52d9\u6240\u7121\u6cd5\u6bd4\u64ec\u7684\u500b\u6027\u5316\u652f\u6301\u3002"
                : "\u6211\u4eec\u7684\u7279\u8272\uff1aJohnny \u61c2\u5f97\u6e2f\u6fb3\u9752\u5e74\u7684\u75db\u70b9\u4e0e\u9700\u6c42\uff0cEVA \u62e5\u6709\u5f3a\u5927\u7684 AI \u6280\u672f\u80fd\u529b\u3002\u8fd9\u79cd\u300c\u4eba\u7c7b\u667a\u6167 + AI \u80fd\u529b\u300d\u7684\u7ed3\u5408\uff0c\u8ba9\u6211\u4eec\u80fd\u591f\u63d0\u4f9b\u5176\u4ed6\u5355\u7eaf\u4f9d\u8d56\u6a21\u677f\u7684\u670d\u52a1\u6240\u65e0\u6cd5\u6bd4\u62df\u7684\u4e2a\u6027\u5316\u652f\u6301\u3002"}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Company Milestones Section */}
      <section id="milestones" className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
              <Calendar className="inline h-4 w-4 mr-2" />
              {language === "zh-HK" ? "\u516c\u53f8\u91cc\u7a0b\u7891" : "\u516c\u53f8\u91cc\u7a0b\u7891"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === "zh-HK" ? "\u6211\u5011\u7684\u6210\u9577\u8db3\u8de1" : "\u6211\u4eec\u7684\u6210\u957f\u8db3\u8ff9"}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Rocket, date: "2025.03", title: language === "zh-HK" ? "\u5275\u696d\u8d77\u9ede" : "\u521b\u4e1a\u8d77\u70b9", desc: language === "zh-HK" ? "\u6c7a\u5b9a\u5317\u4e0a\u524d\u6d77\uff0c\u70ba\u6e2f\u6fb3\u9752\u5e74\u5275\u696d\u8005\u5c0b\u627e\u6a5f\u6703" : "\u51b3\u5b9a\u5317\u4e0a\u524d\u6d77\uff0c\u4e3a\u6e2f\u6fb3\u9752\u5e74\u521b\u4e1a\u8005\u5bfb\u627e\u673a\u4f1a" },
              { icon: Calendar, date: "2025.08", title: language === "zh-HK" ? "\u516c\u53f8\u8a3b\u518a" : "\u516c\u53f8\u6ce8\u518c", desc: language === "zh-HK" ? "\u524d\u6d77\u6df1\u6e2f\u9752\u5e74\u5922\u5de5\u5834\u5165\u99d0\uff0c\u6b63\u5f0f\u6210\u7acb CoreMachine" : "\u524d\u6d77\u6df1\u6e2f\u9752\u5e74\u68a6\u5de5\u573a\u5165\u9a7b\uff0c\u6b63\u5f0f\u6210\u7acb CoreMachine" },
              { icon: Zap, date: "2025.12", title: language === "zh-HK" ? "AI \u5e73\u53f0\u4e0a\u7dda" : "AI \u5e73\u53f0\u4e0a\u7ebf", desc: language === "zh-HK" ? "\u63a8\u51fa\u8cc7\u683c\u8a55\u4f30\u3001\u6587\u4ef6\u751f\u6210\u7b49\u6838\u5fc3\u529f\u80fd\uff0c200+ \u7528\u6236" : "\u63a8\u51fa\u8d44\u683c\u8bc4\u4f30\u3001\u6587\u4ef6\u751f\u6210\u7b49\u6838\u5fc3\u529f\u80fd\uff0c200+ \u7528\u6237" },
              { icon: TrendingUp, date: "2026.04", title: language === "zh-HK" ? "\u670d\u52d9\u5347\u7d1a" : "\u670d\u52a1\u5347\u7ea7", desc: language === "zh-HK" ? "\u5efa\u7acb\u5b9a\u50f9\u8a02\u95b1\u6a21\u5f0f\uff0c\u64f4\u5c55\u66f4\u591a\u653f\u5e9c\u8cc7\u52a9\u8986\u84cb" : "\u5efa\u7acb\u5b9a\u4ef7\u8ba2\u9605\u6a21\u5f0f\uff0c\u6269\u5c55\u66f4\u591a\u653f\u5e9c\u8d44\u52a9\u8986\u76d6" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <Card className="h-full border-border hover:border-primary/50 transition-all">
                  <CardHeader className="pb-2">
                    <item.icon className="h-8 w-8 text-primary mb-2" />
                    <div className="text-xs text-muted-foreground font-mono">{item.date}</div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                )}
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
