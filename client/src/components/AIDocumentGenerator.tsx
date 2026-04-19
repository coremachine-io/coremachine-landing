import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function AIDocumentGenerator() {
  const { language, t } = useLanguage();
  const [documentType, setDocumentType] = useState<"subsidy_application" | "personal_statement">("subsidy_application");
  const [email, setEmail] = useState(""); // 會員 email，用於扣減 credits
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    background: "",
    businessIdea: "",
    experience: "",
    targetMarket: "",
    fundingNeeds: "",
    otherInfo: "",
  });
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generateMutation = trpc.ai.generateDocument.useMutation();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.name.trim()) {
      toast.error(t("ai.form.name.placeholder"));
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        documentType,
        language: language as "zh-HK" | "zh-CN",
        email: email || undefined, // 如果提供了 email，會扣減 credits
        userInfo: {
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : undefined,
          background: formData.background || undefined,
          businessIdea: formData.businessIdea || undefined,
          experience: formData.experience || undefined,
          targetMarket: formData.targetMarket || undefined,
          fundingNeeds: formData.fundingNeeds || undefined,
          otherInfo: formData.otherInfo || undefined,
        },
      });

      if (result.success) {
        const content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
        setGeneratedContent(content);
        
        // 顯示剩餘配額（如果有）
        if (result.remainingCredits !== null && result.remainingCredits !== undefined) {
          toast.success(
            language === "zh-HK"
              ? `生成成功！剩餘配額：${result.remainingCredits} 次`
              : `生成成功！剩余配额：${result.remainingCredits} 次`
          );
        } else {
          toast.success(t("ai.success"));
        }
      }
    } catch (error: any) {
      const message = error?.message || (language === "zh-HK" ? "生成失敗，請稍後再試" : "生成失败，请稍后再试");
      toast.error(message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success(t("ai.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${documentType}_${language}_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(t("ai.form.download"));
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            {t("ai.title")}
          </h2>
          <p className="text-lg text-foreground/80">{t("ai.subtitle")}</p>
          <p className="text-foreground/60 mt-2">{t("ai.description")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
              <div className="space-y-4">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.documentType")}</label>
                  <Select value={documentType} onValueChange={(value: any) => setDocumentType(value)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subsidy_application">
                        {t("ai.form.documentType.subsidy")}
                      </SelectItem>
                      <SelectItem value="personal_statement">
                        {t("ai.form.documentType.statement")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email — for member credit tracking */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "zh-HK" ? "你的 email（已訂閱會員）" : "你的 email（已订阅会员）"}
                    <span className="text-xs text-muted-foreground ml-2">
                      {language === "zh-HK" ? "可選" : "可选"}
                    </span>
                  </label>
                  <Input
                    type="email"
                    placeholder={language === "zh-HK" ? "已訂閱的話填寫，會扣 credit" : "已订阅的话填写，会扣 credit"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.name")}</label>
                  <Input
                    placeholder={t("ai.form.name.placeholder")}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.age")}</label>
                  <Input
                    type="number"
                    placeholder={t("ai.form.age.placeholder")}
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Background */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.background")}</label>
                  <Textarea
                    placeholder={t("ai.form.background.placeholder")}
                    value={formData.background}
                    onChange={(e) => handleInputChange("background", e.target.value)}
                    className="bg-background border-border h-20"
                  />
                </div>

                {/* Business Idea */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.businessIdea")}</label>
                  <Textarea
                    placeholder={t("ai.form.businessIdea.placeholder")}
                    value={formData.businessIdea}
                    onChange={(e) => handleInputChange("businessIdea", e.target.value)}
                    className="bg-background border-border h-24"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.experience")}</label>
                  <Textarea
                    placeholder={t("ai.form.experience.placeholder")}
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    className="bg-background border-border h-20"
                  />
                </div>

                {/* Target Market */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.targetMarket")}</label>
                  <Input
                    placeholder={t("ai.form.targetMarket.placeholder")}
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Funding Needs */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.fundingNeeds")}</label>
                  <Input
                    placeholder={t("ai.form.fundingNeeds.placeholder")}
                    value={formData.fundingNeeds}
                    onChange={(e) => handleInputChange("fundingNeeds", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Other Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t("ai.form.otherInfo")}</label>
                  <Textarea
                    placeholder={t("ai.form.otherInfo.placeholder")}
                    value={formData.otherInfo}
                    onChange={(e) => handleInputChange("otherInfo", e.target.value)}
                    className="bg-background border-border h-20"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !formData.name.trim()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-black font-semibold h-12"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("ai.form.generating")}
                    </>
                  ) : (
                    t("ai.form.generate")
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {generatedContent ? (
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                  {documentType === "subsidy_application"
                    ? t("ai.form.documentType.subsidy")
                    : t("ai.form.documentType.statement")}
                </h3>

                {/* Generated Content */}
                <div className="flex-1 overflow-y-auto mb-4 bg-background/50 p-4 rounded border border-border/30">
                  <div className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
                    {generatedContent}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1 border-border hover:bg-background"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {t("ai.copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        {t("ai.form.copy")}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-black font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("ai.form.download")}
                  </Button>
                </div>

                {/* Tip */}
                <p className="text-xs text-foreground/50 mt-4 text-center">
                  {language === "zh-HK"
                    ? "💡 提示：生成嘅文件可以複製或下載，然後根據你嘅需要進行編輯。"
                    : "💡 提示：生成的文件可以复制或下载，然后根据您的需要进行编辑。"}
                </p>
              </Card>
            ) : (
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur h-full flex items-center justify-center">
                <div className="text-center text-foreground/60">
                  <p className="text-lg font-medium mb-2">
                    {language === "zh-HK" ? "填寫左邊嘅表單開始生成" : "填写左边的表单开始生成"}
                  </p>
                  <p className="text-sm">
                    {language === "zh-HK"
                      ? "AI 會根據你嘅信息生成專業文件"
                      : "AI 会根据您的信息生成专业文件"}
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
