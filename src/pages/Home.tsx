import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc-client";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, Sparkles, FileText, Users, Check, Download, Globe, ArrowRight, MessageCircle } from "lucide-react";
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
      toast.success(language === "zh-HK" ? "下載成功！" : "下载成功！");
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
          <div className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold neon-text">{t("hero.title")}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("services")} className="text-sm hover:text-primary transition-colors">{t("nav.services")}</button>
            <button onClick={() => scrollToSection("story")} className="text-sm hover:text-primary transition-colors">{t("nav.story")}</button>
            <button onClick={() => scrollToSection("templates")} className="text-sm hover:text-primary transition-colors">{t("nav.templates")}</button>
            <button onClick={() => scrollToSection("contact")} className="text-sm hover:text-primary transition-colors">{t("nav.contact")}</button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "zh-HK" ? "zh-CN" : "zh-HK")} className="gap-2">
              <Globe className="h-4 w-4" />
              {language === "zh-HK" ? "繁" : "简"}
            </Button>
            <Button onClick={() => scrollToSection("contact")} className="gap-2">
              {t("hero.cta.primary")}<ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />{t("hero.tagline")}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="neon-text">{t("hero.title")}</span><br />
            <span className="text-3xl md:text-5xl text-muted-foreground mt-4 block">{t("hero.subtitle")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("hero.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => scrollToSection("contact")} className="gap-2 text-lg px-8">
              {t("hero.cta.primary")}<ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("templates")} className="gap-2 text-lg px-8">
              <Download className="h-5 w-5" />{t("hero.cta.secondary")}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">{t("services.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("services.subtitle")}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Package */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-3xl">{t("services.basic.title")}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{t("services.basic.price")}</div>
                </div>
                <CardDescription className="text-base">{t("services.basic.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{t(`services.basic.feature${i}`)}</span>
                  </div>
                ))}
                <Button className="w-full mt-6" onClick={() => scrollToSection("contact")}>{t("services.cta")}</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* VIP Package */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Card className="h-full border-2 border-secondary hover:border-secondary/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">VIP</div>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-3xl">{t("services.vip.title")}</CardTitle>
                  <div className="text-3xl font-bold text-secondary">{t("services.vip.price")}</div>
                </div>
                <CardDescription className="text-base">{t("services.vip.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{t(`services.vip.feature${i}`)}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => scrollToSection("contact")}>{t("services.cta")}</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="container py-20 bg-card/30 rounded-3xl my-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm font-medium">
              <Users className="inline h-4 w-4 mr-2" />{t("story.age")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t("story.title")}</h2>
            <p className="text-2xl text-accent font-semibold">{t("story.subtitle")}</p>
            <p className="text-lg text-muted-foreground">{t("story.intro")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-accent/30">
              <CardHeader><CardTitle className="text-accent">{t("story.challenge.title")}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{t("story.challenge.content")}</p></CardContent>
            </Card>
            <Card className="border-primary/30">
              <CardHeader><CardTitle className="text-primary">{t("story.solution.title")}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{t("story.solution.content")}</p></CardContent>
            </Card>
            <Card className="border-secondary/30">
              <CardHeader><CardTitle className="text-secondary">{t("story.vision.title")}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{t("story.vision.content")}</p></CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">{t("templates.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("templates.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
          {/* Subsidy Template */}
          <Card className="border-primary/30">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("templates.subsidy.title")}</CardTitle>
              <CardDescription>{t("templates.subsidy.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2" onClick={() => handleTemplateDownload("subsidy_application")} disabled={downloadTemplate.isPending}>
                <Download className="h-4 w-4" />{t("templates.download")}
              </Button>
            </CardContent>
          </Card>

          {/* Statement Template */}
          <Card className="border-secondary/30">
            <CardHeader>
              <FileText className="h-10 w-10 text-secondary mb-2" />
              <CardTitle>{t("templates.statement.title")}</CardTitle>
              <CardDescription>{t("templates.statement.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => handleTemplateDownload("personal_statement")} disabled={downloadTemplate.isPending}>
                <Download className="h-4 w-4" />{t("templates.download")}
              </Button>
            </CardContent>
          </Card>

          {/* AI Generator Card */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("ai.section.title")}</CardTitle>
              <CardDescription>{t("ai.section.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2" onClick={() => setShowAIGenerator(true)}>
                <Sparkles className="h-4 w-4" />{t("ai.section.cta")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-md mx-auto">
          <Label htmlFor="template-email" className="text-center block mb-2">{t("templates.email.hint")}</Label>
          <Input id="template-email" type="email" placeholder={t("templates.email.placeholder")} value={templateEmail} onChange={(e) => setTemplateEmail(e.target.value)} className="text-center" />
        </div>
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
              <button onClick={() => setShowAIGenerator(false)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
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
                    <Label>{t("ai.form.email")}（{t("ai.form.optional")}）</Label>
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
                <a href={`https://wa.me/85291444340?text=${encodeURIComponent(language === "zh-HK" ? `你好！我想咨詢 AI 文件生成服務。我叫 ${aiForm.name || '[姓名]'}` : `你好！我想咨询 AI 文件生成服务。我叫 ${aiForm.name || '[姓名]'}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 text-primary hover:underline text-sm">
                  <MessageCircle className="h-4 w-4" />{t("ai.footer.whatsapp")}
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
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t("footer.services.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("footer.services.registration")}</p>
                <p>{t("footer.services.subsidy")}</p>
                <p>{t("footer.services.ai")}</p>
                <p>{t("footer.services.marketing")}</p>
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
