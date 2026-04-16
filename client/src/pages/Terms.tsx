import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  const { language } = useLanguage();
  const isHK = language === "zh-HK";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold neon-text">Core Machine</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {isHK ? "返回首頁" : "返回首页"}
          </Link>
        </div>
      </nav>

      {/* Content */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
            {isHK ? "服務條款" : "服务条款"}
          </h1>

          <Card className="mb-8">
            <CardContent className="prose prose-invert max-w-none p-6 space-y-6">
              <p className="text-muted-foreground">
                {isHK
                  ? "最後更新日期：2026年4月16日"
                  : "最后更新日期：2026年4月16日"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "1. 服務說明" : "1. 服务说明"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "Core Machine 為港澳青年提供前海創業支援服務，包括但不限於：AI 文件生成、資助申請諮詢、公司註冊服務支援等。本服務旨在幫助用戶了解及申請各類創業資助計劃。"
                  : "Core Machine 为港澳青年提供前海创业支援服务，包括但不限于：AI 文件生成、资助申请咨询、公司注册服务支援等。本服务旨在帮助用户了解及申请各类创业资助计划。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "2. AI 生成內容" : "2. AI 生成内容"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "本服務生成的 AI 文件僅供參考用途，不構成法律或專業建議。用戶在使用前應自行審閱及修改內容，確保符合各資助計劃的具體要求。本服務不對 AI 生成內容的準確性、完整性或適用性作出任何明示或暗示的保證。"
                  : "本服务生成的 AI 文件仅供参考用途，不构成法律或专业建议。用户在使用前应自行审阅及修改内容，确保符合各资助计划的具体要求。本服务不对 AI 生成内容的准确性、完整性或适用性作出任何明示或暗示的保证。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "3. 知識產權" : "3. 知识产权"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "用戶使用本服務生成的內容，其知識產權歸用戶所有。Core Machine 保留服務本身的知識產權及相關技術。"
                  : "用户使用本服务生成的内容，其知识产权归用户所有。Core Machine 保留服务本身的知识产权及相关技术。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "4. 私隱保障" : "4. 私隐保障"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們重視用戶私隱，收集的個人資料僅用於提供服務及改善用戶體驗。有關資料處理方式，請參閱我們的私隱政策。"
                  : "我们重视用户私隐，收集的个人资料仅用于提供服务及改善用户体验。有关资料处理方式，请参阅我们的私隐政策。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "5. 服務變更" : "5. 服务变更"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們保留隨時修改或終止服務的權利，恕不另行通知。我們將盡力提前通知用戶任何重大變更。"
                  : "我们保留随时修改或终止服务的权利，恕不另行通知。我们将尽力提前通知用户任何重大变更。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "6. 聯絡我們" : "6. 联络我们"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "如對本服務條款有任何疑問，請通過電郵 hello@coremachine.io 與我們聯絡。"
                  : "如对本服务条款有任何疑问，请通过电邮 hello@coremachine.io 与我们联络。"}
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/" className="text-primary hover:underline">
              ← {isHK ? "返回首頁" : "返回首页"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
