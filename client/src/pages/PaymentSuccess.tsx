import { useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Rocket, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="border-2 border-green-500/50 bg-green-500/5">
          <CardContent className="pt-8 pb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6"
            >
              <CheckCircle className="w-20 h-20 text-green-500" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-4 text-green-500">
              {language === "zh-HK" ? "付款成功！" : "付款成功！"}
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              {language === "zh-HK"
                ? "感謝你選用 Core Machine 服務。我哋會盡快聯絡你確認詳情。"
                : "感谢你选用 Core Machine 服务。我们会尽快联络你确认详情。"}
            </p>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-green-400">
                ✉️ {language === "zh-HK"
                  ? "確認電郵已發送到你的 inbox，請查收。如果沒有看到，請檢查垃圾郵件文件夾。"
                  : "确认邮件已发送到你的 inbox，请查收。如果没有看到，请检查垃圾邮件文件夹。"}
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link to="/">
                  <Rocket className="w-4 h-4 mr-2" />
                  {language === "zh-HK" ? "返回首頁" : "返回首页"}
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/free-resources">
                  {language === "zh-HK" ? "探索免費資源" : "探索免费资源"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              {language === "zh-HK"
                ? "如果有任何問題，請透過 WhatsApp 聯絡我們。"
                : "如果有任何问题，请透过 WhatsApp 联络我们。"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
