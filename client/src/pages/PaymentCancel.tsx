import { useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function PaymentCancel() {
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
          <Card className="border-2 border-muted">
            <CardContent className="pt-8 pb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto mb-6"
              >
                <XCircle className="w-20 h-20 text-muted-foreground" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-4">
                {language === "zh-HK" ? "付款已取消" : "付款已取消"}
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === "zh-HK"
                  ? "你嘅付款已經取消。如果你有任何問題，隨時可以再次嘗試或聯絡我們。"
                  : "你的付款已经取消。如果你有任何问题，随时可以再次尝试或联络我们。"}
              </p>

              <div className="space-y-4">
                <Button asChild className="w-full" size="lg">
                  <Link to="/pricing">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === "zh-HK" ? "返回定價頁面" : "返回定价页面"}
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link to="/free-assessment">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {language === "zh-HK" ? "做個免費資格評估" : "做个免费资格评估"}
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="w-full" size="lg">
                  <Link to="/">
                    {language === "zh-HK" ? "返回首頁" : "返回首页"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
