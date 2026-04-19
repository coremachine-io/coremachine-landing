import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const categoryLabels: Record<string, Record<"zh-HK" | "zh-CN", string>> = {
  subsidy: { "zh-HK": "補貼資助", "zh-CN": "补贴资助" },
  tax: { "zh-HK": "稅務優惠", "zh-CN": "税务优惠" },
  talent: { "zh-HK": "人才政策", "zh-CN": "人才政策" },
  office: { "zh-HK": "辦公室補貼", "zh-CN": "办公室补贴" },
};

const regionLabels: Record<string, Record<"zh-HK" | "zh-CN", string>> = {
  qianhai: { "zh-HK": "前海", "zh-CN": "前海" },
  nansha: { "zh-HK": "南沙", "zh-CN": "南沙" },
  hengqin: { "zh-HK": "橫琴", "zh-CN": "横琴" },
};

const categoryColors: Record<string, string> = {
  subsidy: "bg-green-100 text-green-800 border-green-200",
  tax: "bg-blue-100 text-blue-800 border-blue-200",
  talent: "bg-purple-100 text-purple-800 border-purple-200",
  office: "bg-amber-100 text-amber-800 border-amber-200",
};

interface Policy {
  id: string;
  title: string;
  category: string;
  region: string;
  targetAudience: string;
  amount: string;
  deadline?: string;
  keyPoints: string[];
  eligibility: string;
  officialUrl?: string;
  isNew: boolean;
  source: string;
}

interface PolicyData {
  policies: Policy[];
  lastUpdated: string;
  summary: string;
  nextUpdate: string;
}

// Demo policies when AI fetch fails or is loading
const demoPolicies: Policy[] = [
  {
    id: "pol_demo_001",
    title: "前海深港合作區科技創新專項扶持",
    category: "subsidy",
    region: "qianhai",
    targetAudience: "港澳居民創業者、科技類企業",
    amount: "最高 RMB 50萬",
    deadline: "2026-12-31",
    keyPoints: [
      "AI/大數據/雲計算項目優先",
      "需在前海設立公司",
      "團隊至少3人",
    ],
    eligibility: "港澳身份優先，科技類項目",
    isNew: true,
    source: "前海管理局",
  },
  {
    id: "pol_demo_002",
    title: "港澳青年創業補貼",
    category: "subsidy",
    region: "qianhai",
    targetAudience: "35歲以下港澳青年",
    amount: "最高 HK$12萬",
    deadline: "無期限",
    keyPoints: [
      "首次創業優先",
      "需入駐前海創業園區",
      "為期6個月觀察期",
    ],
    eligibility: "35歲以下，首次創業港澳居民",
    isNew: false,
    source: "前海管理局",
  },
  {
    id: "pol_demo_003",
    title: "前海辦公室租金補貼",
    category: "office",
    region: "qianhai",
    targetAudience: "入駐前海寫字樓的港澳企業",
    amount: "最高補貼50%租金",
    deadline: "2026-06-30",
    keyPoints: [
      "補貼期最長3年",
      "需簽訂2年以上租約",
      "補貼面積最高500平方米",
    ],
    eligibility: "入駐前海指定園區的港澳企業",
    isNew: false,
    source: "前海管理局",
  },
];

export default function PolicyDisplay() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data, isLoading, refetch, error } = trpc.policy.fetchLatest.useQuery(
    { category: "all", region: "qianhai" },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  const policies: Policy[] = data?.policies?.length ? data.policies : demoPolicies;
  const displayPolicies = selectedCategory === "all" 
    ? policies 
    : policies.filter(p => p.category === selectedCategory);

  const handleRefresh = () => {
    refetch();
    toast.success(language === "zh-HK" ? "正在更新政策資訊..." : "正在更新政策资讯...");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(
        language === "zh-HK" ? "zh-HK" : "zh-CN",
        { year: "numeric", month: "long", day: "numeric" }
      );
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {language === "zh-HK" ? "最新政策動態" : "最新政策动态"}
          </h3>
          {data?.lastUpdated && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {language === "zh-HK" ? "更新：" : "更新："}{formatDate(data.lastUpdated)}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          {language === "zh-HK" ? "更新" : "更新"}
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "subsidy", "tax", "talent", "office"].map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 ${
              selectedCategory === cat 
                ? "bg-primary hover:bg-primary/90" 
                : "hover:bg-muted"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" 
              ? (language === "zh-HK" ? "全部" : "全部")
              : categoryLabels[cat]?.[language] || cat}
          </Badge>
        ))}
      </div>

      {/* Summary */}
      {data?.summary && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">{data.summary}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            {language === "zh-HK" 
              ? "暫時無法獲取最新政策，使用本地數據。" 
              : "暂时无法获取最新政策，使用本地数据。"}
          </p>
        </div>
      )}

      {/* Policy Cards */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : displayPolicies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{language === "zh-HK" ? "暫無此類政策資訊" : "暂无此类政策资讯"}</p>
          </div>
        ) : (
          displayPolicies.map((policy, i) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {policy.isNew && (
                          <Badge variant="destructive" className="text-xs">
                            NEW
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${categoryColors[policy.category] || ""}`}
                        >
                          {categoryLabels[policy.category]?.[language] || policy.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {regionLabels[policy.region]?.[language] || policy.region}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-snug">
                        {policy.title}
                      </CardTitle>
                    </div>
                    {policy.officialUrl && (
                      <a
                        href={policy.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Amount & Deadline */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">{policy.amount}</span>
                    </div>
                    {policy.deadline && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {language === "zh-HK" ? "截止：" : "截止："}{policy.deadline}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Target Audience */}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === "zh-HK" ? "適用對象：" : "适用对象："}{policy.targetAudience}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === "zh-HK" ? "資格：" : "资格："}{policy.eligibility}
                    </p>
                  </div>

                  {/* Key Points */}
                  {policy.keyPoints?.length > 0 && (
                    <ul className="space-y-1">
                      {policy.keyPoints.map((point, pi) => (
                        <li key={pi} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Source */}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    {language === "zh-HK" ? "來源：" : "来源："}{policy.source}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Next Update */}
      {data?.nextUpdate && (
        <p className="text-center text-xs text-muted-foreground">
          {language === "zh-HK" ? "下次更新：" : "下次更新："}{data.nextUpdate}
        </p>
      )}
    </div>
  );
}
