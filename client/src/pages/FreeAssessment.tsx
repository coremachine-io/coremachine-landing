import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, ArrowRight, Mail, Gift } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import NavBar from "@/components/NavBar";

export default function FreeAssessment() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessType: "" as "" | "technology" | "retail" | "catering" | "creative" | "professional" | "other",
    yearsInBusiness: "" as "" | "0" | "1-3" | "3-5" | "5+",
    hasHKID: "" as "" | "yes" | "no",
    city: "" as "" | "前海" | "南沙" | "橫琴" | "未決定",
    message: "",
  });
  const [result, setResult] = useState<{
    score: number;
    eligible: boolean;
    maxSubsidy: string;
    analysis: string;
    recommendations: string[];
  } | null>(null);

  const assessMutation = trpc.ai.evaluateSubsidyEligibility.useMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error(language === "zh-HK" ? "請輸入姓名" : "请输入姓名");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error(language === "zh-HK" ? "請輸入有效的 email" : "请输入有效的 email");
      return;
    }
    if (!formData.businessType) {
      toast.error(language === "zh-HK" ? "請選擇行業類型" : "请选择行业类型");
      return;
    }
    if (!formData.hasHKID) {
      toast.error(language === "zh-HK" ? "請選擇是否有港澳身份證" : "请选择是否有港澳身份证");
      return;
    }

    try {
      const response = await assessMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        businessType: formData.businessType as any,
        yearsInBusiness: formData.yearsInBusiness as any || undefined,
        hasHKID: formData.hasHKID === "yes",
        city: formData.city as any || undefined,
        additionalInfo: formData.message || undefined,
      });

      setResult(response);
      setStep("result");
    } catch (error: any) {
      toast.error(error?.message || (language === "zh-HK" ? "評估失敗，請稍後再試" : "评估失败，请稍后再试"));
    }
  };

  const isHK = language === "zh-HK";

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
              <Gift className="h-4 w-4" />
              {isHK ? "完全免費 · 只需 2 分鐘" : "完全免费 · 只需 2 分钟"}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {isHK ? (
                <>
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    前海補貼資格
                  </span>
                  <br />
                  評估器
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    前海补贴资格
                  </span>
                  <br />
                  评估器
                </>
              )}
            </h1>

            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              {isHK
                ? "輸入基本資料，AI 即時分析你可以拎幾多補貼"
                : "输入基本资料，AI 即时分析你可以领多少补贴"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form / Result Section */}
      <section className="px-4 pb-20">
        <div className="container max-w-3xl mx-auto">
          {step === "form" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    {isHK ? "開始評估" : "开始评估"}
                  </CardTitle>
                  <CardDescription>
                    {isHK
                      ? "填寫以下資料，AI 幫你分析補貼資格"
                      : "填写以下资料，AI 帮你分析补贴资格"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isHK ? "姓名 *" : "姓名 *"}
                    </label>
                    <Input
                      placeholder={isHK ? "你嘅名字" : "你的名字"}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder={isHK ? "你嘅 email" : "你的 email"}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-background border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {isHK
                        ? "評估結果會發送到呢個 email"
                        : "评估结果会发送到这个 email"}
                    </p>
                    <div className="mt-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-xs text-cyan-400 font-medium mb-1">
                        {isHK ? "📋 我哋點樣跟進你？" : "📋 我们怎样跟进你？"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isHK
                          ? "提交後，Johnny 會喺 24 小時內親自聯絡你，解答你對補貼申請嘅問題。"
                          : "提交后，Johnny 会于 24 小时内亲自联络你，解答你对补贴申请的问题。"}
                      </p>
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isHK ? "行業類型 *" : "行业类型 *"}
                    </label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(v) => handleInputChange("businessType", v)}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder={isHK ? "選擇你嘅行業" : "选择你的行业"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">{isHK ? "科技 / 互聯網" : "科技 / 互联网"}</SelectItem>
                        <SelectItem value="retail">{isHK ? "零售 / 電商" : "零售 / 电商"}</SelectItem>
                        <SelectItem value="catering">{isHK ? "餐飲 / 食品" : "餐饮 / 食品"}</SelectItem>
                        <SelectItem value="creative">{isHK ? "創意 / 文化" : "创意 / 文化"}</SelectItem>
                        <SelectItem value="professional">{isHK ? "專業服務" : "专业服务"}</SelectItem>
                        <SelectItem value="other">{isHK ? "其他行業" : "其他行业"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Years in Business */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isHK ? "創業經驗" : "创业经验"}
                    </label>
                    <Select
                      value={formData.yearsInBusiness}
                      onValueChange={(v) => handleInputChange("yearsInBusiness", v)}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder={isHK ? "選擇經驗年數" : "选择经验年数"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">{isHK ? "0 - 初次創業者" : "0 - 初次创业者"}</SelectItem>
                        <SelectItem value="1-3">1-3 {isHK ? "年" : "年"}</SelectItem>
                        <SelectItem value="3-5">3-5 {isHK ? "年" : "年"}</SelectItem>
                        <SelectItem value="5+">5+ {isHK ? "年" : "年"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* HKID */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isHK ? "是否持有港澳居民身份證？ *" : "是否持有港澳居民身份证？ *"}
                    </label>
                    <Select
                      value={formData.hasHKID}
                      onValueChange={(v) => handleInputChange("hasHKID", v)}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder={isHK ? "請選擇" : "请选择"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{isHK ? "係，有港澳身份證" : "是，有港澳身份证"}</SelectItem>
                        <SelectItem value="no">{isHK ? "否，其他身份" : "否，其他身份"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isHK ? "想喺邊個城市創業？" : "想在哪个城市创业？"}
                    </label>
                    <Select
                      value={formData.city}
                      onValueChange={(v) => handleInputChange("city", v)}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder={isHK ? "選擇城市" : "选择城市"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="前海">前海（深圳）</SelectItem>
                        <SelectItem value="南沙">南沙（廣州）</SelectItem>
                        <SelectItem value="橫琴">橫琴（珠海）</SelectItem>
                        <SelectItem value="未決定">{isHK ? "未決定" : "未决定"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isHK ? "其他想補充的資料" : "其他想补充的资料"}
                    </label>
                    <Textarea
                      placeholder={isHK ? "例如：我想做跨境電商..." : "例如：我想做跨境电商..."}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="bg-background border-border h-24"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white"
                    size="lg"
                    disabled={assessMutation.isPending}
                    onClick={handleSubmit}
                  >
                    {assessMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isHK ? "分析中..." : "分析中..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isHK ? "立即評估（免費）" : "立即评估（免费）"}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {isHK
                      ? "🔒 你的資料只用於評估，不會用於其他用途"
                      : "🔒 你的资料只用于评估，不会用于其他用途"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result Card */}
                <Card className={`border-2 ${result.eligible ? "border-green-500/50 bg-green-500/5" : "border-yellow-500/50 bg-yellow-500/5"}`}>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      {result.eligible ? (
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 mb-4">
                          <AlertCircle className="w-10 h-10 text-yellow-400" />
                        </div>
                      )}

                      <h2 className="text-2xl font-bold mb-2">
                        {result.eligible
                          ? (isHK ? "🎉 你符合補貼資格！" : "🎉 你符合补贴资格！")
                          : (isHK ? "⚠️ 有機會符合資格" : "⚠️ 有机会符合资格")}
                      </h2>

                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <span className="text-sm text-cyan-400">
                          {isHK ? "預計最高補貼：" : "预计最高补贴："}
                          <strong className="text-xl ml-1">{result.maxSubsidy}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-xl p-4 mb-6">
                      <h3 className="font-semibold mb-2">{isHK ? "📊 AI 分析" : "📊 AI 分析"}</h3>
                      <p className="text-sm text-foreground/70 whitespace-pre-wrap">{result.analysis}</p>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div className="bg-background/50 rounded-xl p-4">
                        <h3 className="font-semibold mb-2">{isHK ? "💡 下一步建議" : "💡 下一步建议"}</h3>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                              <ArrowRight className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CTA Card — 轉換到聯絡 */}
                <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-background to-purple-500/10">
                  <CardContent className="pt-6 text-center space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      {isHK ? "評估完成 — 我哋會喺 24 小時內聯絡你" : "评估完成 — 我们会于 24 小时内联络你"}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {isHK ? "想加快申請流程？" : "想加快申请流程？"}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {isHK
                          ? "直接聯絡 Johnny，問你啱啱嘅評估結果"
                          : "直接联络 Johnny，问你刚刚的评估结果"}
                      </p>
                    </div>

                    {/* Primary CTA — WhatsApp */}
                    <a
                      href={`https://wa.me/85291444340?text=${encodeURIComponent(isHK
                        ? `你好，我啱啱做咗免費評估，想知多啲關於補貼申請嘅事宜。`
                        : `你好，我刚刚做了免费评估，想知多啲关于补贴申请的事宜。`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white gap-2 text-base">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp 聯絡 Johnny
                      </Button>
                    </a>

                    {/* Secondary — Telegram */}
                    <a
                      href="https://t.me/coremachine"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button size="lg" variant="outline" className="w-full gap-2 text-base">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                        Telegram
                      </Button>
                    </a>

                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">
                        {isHK
                          ? "或"
                          : "或"}{" "}
                        <Link href="/pricing" className="text-cyan-400 hover:underline">
                          {isHK ? "先查看方案" : "先查看方案"}
                        </Link>{" "}
                        {isHK ? "再決定" : "再决定"}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => setStep("form")}
                    >
                      {isHK ? "重新評估" : "重新评估"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Email captured note */}
                <p className="text-xs text-muted-foreground text-center">
                  {isHK
                    ? `評估結果已發送到 ${formData.email}，記得檢查 inbox`
                    : `评估结果已发送到 ${formData.email}，记得检查 inbox`}
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
