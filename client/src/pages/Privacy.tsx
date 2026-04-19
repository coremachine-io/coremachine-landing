import { useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Privacy() {
  const { language } = useLanguage();
  const isHK = language === "zh-HK";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Content */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
            {isHK ? "私隱政策" : "私隐政策"}
          </h1>

          <Card className="mb-8">
            <CardContent className="prose prose-invert max-w-none p-6 space-y-6">
              <p className="text-muted-foreground">
                {isHK
                  ? "最後更新日期：2026年4月16日"
                  : "最后更新日期：2026年4月16日"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "1. 收集的資料" : "1. 收集的资料"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們收集的資料包括：你自願提供的個人資料（如姓名、聯絡方式、項目詳情）、AI 文件生成所需的信息、以及網站使用數據。我們不會收集與服務無關的個人資料。"
                  : "我们收集的资料包括：您自愿提供的个人资料（如姓名、联络方式、项目详情）、AI 文件生成所需的信息、以及网站使用数据。我们不会收集与服务无关的个人资料。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "2. 資料使用" : "2. 资料使用"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們使用收集的資料用於：提供及改進我們的服務、處理您的咨詢及申請、發送服務相關通知（如您要求）。未經您的同意，我們不會將個人資料用於直接營銷用途。"
                  : "我们使用收集的资料用于：提供及改进我们的服务、处理您的咨询及申请、发送服务相关通知（如您要求）。未经您的同意，我们不会将个人资料用于直接营销用途。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "3. 資料保護" : "3. 资料保护"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們採用合理的技術及管理措施保護您的個人資料，防止未授權的訪問、使用或洩露。但互聯網傳輸無法保證 100% 安全，請理解並配合。"
                  : "我们采用合理的技术及管理措施保护您的个人资料，防止未授权的访问、使用或泄露。但互联网传输无法保证 100% 安全，请理解并配合。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "4. 資料共享" : "4. 资料共享"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們不會出售或出租您的個人資料。我們可能會與服務供應商共享資料（如雲端托管、數據庫服務），但僅限於提供服務所需。我們可能在法律要求時披露資料。"
                  : "我们不会出售或出租您的个人资料。我们可能会与服务供应商共享资料（如云端托管、数据库服务），但仅限 于提供服务所需。我们可能在法律要求时披露资料。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "5. Cookie 使用" : "5. Cookie 使用"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "我們使用 Cookie 改善用戶體驗，包括記住您的偏好設定及分析網站流量。您可以通過瀏覽器設置拒絕 Cookie，但可能影響部分功能。"
                  : "我们使用 Cookie 改善用户体验，包括记住您的偏好设定及分析网站流量。您可以通过浏览器设置拒绝 Cookie，但可能影响部分功能。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "6. 您的權利" : "6. 您的权利"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "您有權要求查閱、更正或刪除您的個人資料。如需行使這些權利，請通過電郵 hello@coremachine.io 與我們聯絡。"
                  : "您有权要求查阅、更正或删除您的个人资料。如需行使这些权利，请通过电邮 hello@coremachine.io 与我们联络。"}
              </p>

              <h2 className="text-xl font-semibold text-primary">{isHK ? "7. 聯絡我們" : "7. 联络我们"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHK
                  ? "如對本私隱政策有任何疑問，請通過電郵 hello@coremachine.io 與我們聯絡。"
                  : "如对本私隐政策有任何疑问，请通过电邮 hello@coremachine.io 与我们联络。"}
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
