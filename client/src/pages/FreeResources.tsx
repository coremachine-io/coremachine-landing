import { useLanguage } from "@/contexts/LanguageContext";
import EligibilityChecker from "@/components/EligibilityChecker";
import DeadlineTimeline from "@/components/DeadlineTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const fundCards = [
  { id: "opc", icon: "🤖", color: "from-primary/20 to-primary/5" },
  { id: "smartcoupon", icon: "💻", color: "from-secondary/20 to-secondary/5" },
  { id: "kunpeng", icon: "🌟", color: "from-accent/20 to-accent/5" },
  { id: "cyberport", icon: "🏢", color: "from-primary/20 to-primary/5" },
  { id: "hkstp", icon: "🔬", color: "from-secondary/20 to-secondary/5" },
  { id: "itf", icon: "💡", color: "from-accent/20 to-accent/5" },
  { id: "gba", icon: "🌐", color: "from-primary/20 to-primary/5" },
  { id: "youth", icon: "👨‍💼", color: "from-secondary/20 to-secondary/5" },
];

export default function FreeResources() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("pricing.free.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pricing.free.description")}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Feature Cards Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📋</span> {t("pricing.free.feature1")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fundCards.map((fund) => (
              <Card
                key={fund.id}
                className={cn(
                  "bg-gradient-to-br to-card border-border/50 hover:border-primary/30 transition-all cursor-pointer",
                  fund.color
                )}
                onClick={() => document.getElementById("eligibility-checker")?.scrollIntoView({ behavior: "smooth" })}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-4xl mb-3 block">{fund.icon}</span>
                  <p className="font-medium text-sm">{t(`fund.${fund.id}.name`)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t(`fund.${fund.id}.tag`)}</p>
                  <p className="text-sm font-bold text-primary mt-2">{t(`fund.${fund.id}.amount`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Eligibility Checker + Timeline */}
        <section className="grid md:grid-cols-2 gap-8">
          <div id="eligibility-checker">
            <EligibilityChecker />
          </div>
          <div>
            <DeadlineTimeline />

            {/* Process Guide */}
            <Card className="mt-6 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-2xl">📖</span> {t("pricing.free.feature4")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: "1", title: t("fund.process.step1.title"), desc: t("fund.process.step1.desc"), color: "bg-primary" },
                    { step: "2", title: t("fund.process.step2.title"), desc: t("fund.process.step2.desc"), color: "bg-secondary" },
                    { step: "3", title: t("fund.process.step3.title"), desc: t("fund.process.step3.desc"), color: "bg-accent" },
                    { step: "4", title: t("fund.process.step4.title"), desc: t("fund.process.step4.desc"), color: "bg-primary" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm", item.color)}>
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="font-medium text-sm mb-3">{t("fund.docs.title")}</h4>
                  <ul className="space-y-1.5">
                    {["business", "reg", "id", "financial", "tech", "other"].map((key) => (
                      <li key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-primary">✓</span>
                        {t(`fund.docs.${key}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Assessment CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">
              <span className="text-3xl mr-2">🎯</span>
              {t("pricing.free.feature5")}
            </h3>
            <p className="text-muted-foreground mb-6">
              回答幾條簡單問題，立即知道邊個資助啱你
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => document.getElementById("eligibility-checker")?.scrollIntoView({ behavior: "smooth" })}>
                立即評估資格
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#ai-generator">試用 AI 生成文件</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer nav */}
        <section className="text-center py-8 border-t border-border/50">
          <p className="text-muted-foreground mb-4">
            準備好開始？
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/pricing">查看定價</Link>
            </Button>
            <Button asChild>
              <Link to="/#contact">免費咨詢</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
