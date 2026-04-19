import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CaseDisplayProps {
  cases?: Array<{
    heroName: string;
    heroBackground: string;
    industry: string;
    city: string;
    evaluationScore: number;
    status: string;
    websiteCase?: {
      headline: string;
      summary: string;
      keyMetrics: string[];
      quote: string;
    };
  }>;
  compact?: boolean;
}

export default function CaseDisplay({ cases: manualCases, compact = false }: CaseDisplayProps) {
  const { language, t } = useLanguage();

  // 示範案例（等待真實案例積累）
  const demoCases = manualCases || [
    {
      heroName: "陳生",
      heroBackground: language === "zh-HK"
        ? "香港IT人，40歲，想在深圳前海創業"
        : "香港IT人，40岁，想在深圳前海创业",
      industry: "科技",
      city: "前海",
      evaluationScore: 72,
      status: "準備中",
      websiteCase: {
        headline: language === "zh-HK"
          ? "用咗 Core Machine 評估，先知自己可以申請到呢個數"
          : "用了 Core Machine 评估，才知自己可以申请到这个数",
        summary: language === "zh-HK"
          ? "香港IT創業者，評估後發現符合前海補貼資格，準備文件中"
          : "香港IT创业者，评估后发现符合前海补贴资格，准备文件中",
        keyMetrics: [
          language === "zh-HK" ? "補貼評分：72分" : "补贴评分：72分",
          language === "zh-HK" ? "目標補貼：HK$100萬+" : "目标补贴：HK$100万+",
          language === "zh-HK" ? "使用服務：免費評估" : "使用服务：免费评估",
        ],
        quote: language === "zh-HK"
          ? "估唔到免費評估已經咁詳細！"
          : "估不到免费评估已经咁详细！",
      },
    },
    {
      heroName: "李小姐",
      heroBackground: language === "zh-HK"
        ? "澳門設計師，35歲，首次創業"
        : "澳门设计师，35岁，首次创业",
      industry: "創意",
      city: "前海",
      evaluationScore: 68,
      status: "已提交",
      websiteCase: {
        headline: language === "zh-HK"
          ? "第一次申請補貼，Core Machine 全程幫我搞掂"
          : "第一次申请补贴，Core Machine 全程帮我搞掂",
        summary: language === "zh-HK"
          ? "澳門創業者，首次接觸內地補貼，現已成功提交申請"
          : "澳门创业者，首次接触内地补贴，现已成功提交申请",
        keyMetrics: [
          language === "zh-HK" ? "補貼評分：68分" : "补贴评分：68分",
          language === "zh-HK" ? "目標補貼：HK$50萬+" : "目标补贴：HK$50万+",
          language === "zh-HK" ? "申請狀態：已提交" : "申请状态：已提交",
        ],
        quote: language === "zh-HK"
          ? "自己搞唔知幾時先搞完，有佢幫手放心好多"
          : "自己搞不知几时先搞完，有它帮手放心好多",
      },
    },
  ];

  if (compact) {
    return (
      <div className="space-y-4">
        {demoCases.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{c.heroName}</span>
                      <Badge variant="outline" className="text-xs">
                        {c.industry}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {c.websiteCase?.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-medium">{c.evaluationScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {demoCases.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {c.heroName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{c.heroName}</CardTitle>
                    <CardDescription className="text-xs">
                      {c.industry} · {c.city}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{c.evaluationScore}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Headline */}
              {c.websiteCase?.headline && (
                <p className="font-medium text-sm leading-relaxed">
                  "{c.websiteCase.headline}"
                </p>
              )}

              {/* Quote */}
              {c.websiteCase?.quote && (
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <span className="text-primary text-lg leading-none mt-0.5">"</span>
                  <p className="text-sm italic text-muted-foreground">
                    {c.websiteCase.quote}
                  </p>
                </div>
              )}

              {/* Metrics */}
              {c.websiteCase?.keyMetrics && (
                <div className="flex flex-wrap gap-2">
                  {c.websiteCase.keyMetrics.map((metric, mi) => (
                    <Badge key={mi} variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      {metric}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {c.heroBackground}
                </span>
                <Badge
                  variant={c.status === "已提交" || c.status === "審批中" ? "default" : "secondary"}
                  className="text-xs"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {c.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
