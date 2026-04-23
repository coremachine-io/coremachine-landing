import Hero from '@/components/hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  UtensilsCrossed,
  BrainCircuit,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  MessageSquare,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function RetailAI() {
  return (
    <>
      {/* Hero */}
      <Hero
        title="零售與餐飲業 AI 轉型方案"
        subtitle="用人工智能提升營運效率、降低成本、增加營收——從今天開始，讓 AI 成為你最強的店員"
      />

      {/* Problem Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-sm">行業痛點</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">你的店舖，是否也面對這些挑戰？</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            零售與餐飲業的經營環境越來越艱難，傳統方法已經難以應對
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-destructive mb-2" />
              <CardTitle className="text-lg">人手短缺</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                請人難、留人更難。員工流失率高，培訓成本不斷上升，高峰期總是手忙腳亂。
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <BarChart3 className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-lg">成本上漲</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                租金、食材、人工樣樣漲，利潤空間被壓縮到極限。傳統減成本方法已經見底。
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">客戶體驗</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                顧客期待個人化服務，但忙起來根本無暇顧及。負評一條，可能流失十位客人。
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader className="pb-3">
              <Zap className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="text-lg">數據盲點</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                每日產生大量數據，卻不懂如何利用。不知道什麼好賣、什麼時候進貨、什麼顧客最有價值。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4 text-sm">AI 解決方案</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI 不是取代你，是放大你的能力</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Core Machine 為零售與餐飲業量身打造 AI 轉型方案，讓小店也能擁有大企業的智能營運能力
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Retail Solutions */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Store className="h-8 w-8 text-primary" />
                  <CardTitle>零售業 AI 方案</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">智能庫存管理</p>
                    <p className="text-sm text-muted-foreground">AI 預測銷售趨勢，自動建議補貨時間與數量，減少積壓與缺貨</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">顧客行為分析</p>
                    <p className="text-sm text-muted-foreground">分析購買模式，識別高價值顧客，自動推送個人化優惠</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">動態定價策略</p>
                    <p className="text-sm text-muted-foreground">根據時段、庫存、競爭對手自動調整價格，最大化利潤</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">智能客服助手</p>
                    <p className="text-sm text-muted-foreground">24/7 自動回答顧客查詢，處理訂單與退換貨，減輕人手壓力</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* F&B Solutions */}
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="h-8 w-8 text-accent" />
                  <CardTitle>餐飲業 AI 方案</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">智能點餐系統</p>
                    <p className="text-sm text-muted-foreground">AI 推薦菜單、自動配餐、預估等候時間，提升翻台率</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">食材損耗預測</p>
                    <p className="text-sm text-muted-foreground">根據歷史數據與節日預測需求量，精準採購，減少浪費</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">評論情感分析</p>
                    <p className="text-sm text-muted-foreground">自動監控網上評價，識別問題所在，快速回應改善</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">員工排班優化</p>
                    <p className="text-sm text-muted-foreground">AI 根據預測客流量自動生成最佳排班表，減少人手浪費</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">轉型成效</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">導入 AI 後，你可以預期什麼改變？</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">營收提升 20-40%</h3>
            <p className="text-muted-foreground">
              透過精準推薦與動態定價，平均客單價提升，回頭客比例增加
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold">營運成本降低 30%</h3>
            <p className="text-muted-foreground">
              減少食材浪費、優化人手配置、自動化重複性工作
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
              <BrainCircuit className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">決策速度提升 10 倍</h3>
            <p className="text-muted-foreground">
              從憑感覺到靠數據，每個商業決定都有 AI 分析支持
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-sm">實施流程</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">四步驟完成 AI 轉型</h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">免費診斷評估</h3>
                <p className="text-muted-foreground">我們深入瞭解你的業務流程、痛點與目標，評估最適合的 AI 應用場景</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">定制化方案設計</h3>
                <p className="text-muted-foreground">根據評估結果，設計專屬 AI 轉型路線圖，明確投入產出比與時間表</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">快速部署上線</h3>
                <p className="text-muted-foreground">最快 2 週內完成系統部署，無需複雜技術背景，我們全程手把手教學</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h3 className="text-xl font-bold mb-2">持續優化支援</h3>
                <p className="text-muted-foreground">上線後持續監測成效，每月檢討優化，確保 AI 系統持續為你創造價值</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">準備好讓 AI 為你的店舖賺更多？</h2>
          <p className="text-xl text-muted-foreground">
            首 20 位預約的零售與餐飲業主，可獲得免費 AI 營運診斷（價值 HK$2,000）
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 text-lg px-8" asChild>
              <a href="/contact">
                立即預約免費診斷 <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8" asChild>
              <a href="https://wa.me/85263188503" target="_blank" rel="noopener noreferrer">
                WhatsApp 查詢
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            無需技術背景 · 最快 2 週上線 · 明確投資回報
          </p>
        </div>
      </section>
    </>
  );
}
