import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question: string;
  options: { label: string; matches: string[] }[];
}

const questions: Question[] = [
  {
    id: "age",
    question: "你嘅年齡係？",
    options: [
      { label: "35歲以下", matches: ["kunpeng", "youth", "itf"] },
      { label: "35-45歲", matches: ["opc", "smartcoupon", "cyberport", "hkstp", "gba"] },
      { label: "45歲以上", matches: ["opc", "smartcoupon", "cyberport", "hkstp", "gba", "itf"] },
    ],
  },
  {
    id: "location",
    question: "你打算喺邊度創業？",
    options: [
      { label: "前海 / 深圳", matches: ["opc", "smartcoupon", "kunpeng", "youth"] },
      { label: "香港", matches: ["cyberport", "hkstp", "itf", "gba"] },
      { label: "大灣區其他城市", matches: ["gba", "youth", "kunpeng"] },
    ],
  },
  {
    id: "industry",
    question: "你嘅項目屬於邊個行業？",
    options: [
      { label: "AI / 數碼科技", matches: ["opc", "smartcoupon", "cyberport", "hkstp", "itf", "kunpeng"] },
      { label: "生物醫藥 / 新能源", matches: ["kunpeng", "cyberport", "hkstp", "itf"] },
      { label: "其他創新行業", matches: ["kunpeng", "cyberport", "hkstp", "youth", "gba"] },
    ],
  },
  {
    id: "stage",
    question: "你嘅項目目前係咩階段？",
    options: [
      { label: "只有想法，尚未成立公司", matches: ["opc", "kunpeng", "youth", "gba"] },
      { label: "已經成立香港公司", matches: ["cyberport", "hkstp", "itf", "opc", "smartcoupon"] },
      { label: "已經成立內地公司", matches: ["smartcoupon", "itf", "opc"] },
    ],
  },
  {
    id: " residency",
    question: "你嘅居民身份係？",
    options: [
      { label: "香港永久居民", matches: ["opc", "cyberport", "hkstp", "itf", "kunpeng", "gba", "youth", "smartcoupon"] },
      { label: "香港非永久居民", matches: ["opc", "youth", "kunpeng", "smartcoupon"] },
      { label: "澳門居民", matches: ["opc", "youth", "kunpeng", "smartcoupon"] },
    ],
  },
];

const subsidyMeta: Record<string, { name: string; amount: string; tag: string; priority: number }> = {
  opc: { name: "前海OPC「獨行俠禮包」", amount: "200㎡ + 50P算力", tag: "AI創業首選", priority: 1 },
  smartcoupon: { name: "深圳智能券", amount: "最高1000萬算力", tag: "算力補貼", priority: 2 },
  kunpeng: { name: "鯤鵬青年創新創業項目", amount: "5萬+100萬研發", tag: "創新創業", priority: 3 },
  cyberport: { name: "Cyberport數碼港孵化", amount: "最高50萬", tag: "香港旗艦孵化", priority: 4 },
  hkstp: { name: "科技園Incu-Tech", amount: "最高百萬", tag: "科技企業", priority: 5 },
  itf: { name: "創新及科技基金AI補貼", amount: "最高70%算力", tag: "創科支援", priority: 6 },
  gba: { name: "大灣區青年創業基金", amount: "專項資助", tag: "跨境創業", priority: 7 },
  youth: { name: "粵港澳青年創業計劃", amount: "生活補貼+支援", tag: "青年創業", priority: 8 },
};

export default function EligibilityChecker() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [matchedSubsidies, setMatchedSubsidies] = useState<string[]>([]);

  const handleAnswer = (questionId: string, matches: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: matches.join(",") }));
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults({ ...answers, [questionId]: matches.join(",") });
    }
  };

  const calculateResults = (allAnswers: Record<string, string>) => {
    const scoreMap: Record<string, number> = {};
    
    Object.values(allAnswers).forEach((matchesStr) => {
      const matches = matchesStr.split(",");
      matches.forEach((m) => {
        scoreMap[m] = (scoreMap[m] || 0) + 1;
      });
    });

    const maxScore = questions.length;
    const results = Object.entries(scoreMap)
      .filter(([_, score]) => score >= maxScore * 0.6)
      .sort((a, b) => {
        const metaA = subsidyMeta[a[0]];
        const metaB = subsidyMeta[b[0]];
        return (metaA?.priority || 99) - (metaB?.priority || 99);
      })
      .map(([id]) => id);

    setMatchedSubsidies(results);
    setShowResults(true);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setMatchedSubsidies([]);
  };

  if (showResults) {
    return (
      <Card className="bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">🎯</span> 你的資助配對結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matchedSubsidies.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                根據你嘅回答，我哋為你精選咗 {matchedSubsidies.length} 個適合你嘅資助計劃：
              </p>
              <div className="space-y-3">
                {matchedSubsidies.map((id, idx) => {
                  const meta = subsidyMeta[id];
                  if (!meta) return null;
                  return (
                    <div
                      key={id}
                      className={cn(
                        "p-4 rounded-lg border",
                        idx === 0
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {idx === 0 && (
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                最適合你
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {meta.tag}
                            </Badge>
                          </div>
                          <p className="font-semibold">{meta.name}</p>
                        </div>
                        <span className="text-lg">{"⭐".repeat(Math.min(idx + 1, 3))}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{meta.amount}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400 font-medium mb-2">
                  想提高獲批機會？
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  我哋嘅AI可以幫你生成專業申請文件，大幅提升成功機會
                </p>
                <Button className="w-full" onClick={() => window.location.href = "/#ai-generator"}>
                  立即試用 AI 生成文件
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                根據你嘅回答，暫時未匹配到明確適合嘅資助計劃
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                但係好多資助計劃係滾動申請，或者可以叠加申請
              </p>
              <Button variant="outline" onClick={reset}>
                重新測試
              </Button>
            </div>
          )}

          <Button variant="ghost" className="w-full mt-4" onClick={reset}>
            重新回答問題
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-2xl">✅</span> {t("pricing.free.feature2")}
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1}/{questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => handleAnswer(currentQuestion.id, opt.matches)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          回答 {questions.length} 條問題，即時獲得個人化資助配對
        </p>
      </CardContent>
    </Card>
  );
}
