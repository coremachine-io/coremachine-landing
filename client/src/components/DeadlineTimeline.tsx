import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Deadline {
  name: string;
  tag: string;
  deadline: string;
  status: "open" | "upcoming" | "closed";
  color: string;
}

export default function DeadlineTimeline() {
  const { t } = useLanguage();

  const deadlines: Deadline[] = [
    {
      name: t("fund.opc.name"),
      tag: t("fund.opc.tag"),
      deadline: "滾動申請",
      status: "open",
      color: "bg-primary",
    },
    {
      name: t("fund.smartcoupon.name"),
      tag: t("fund.smartcoupon.tag"),
      deadline: "2026-03-31",
      status: "open",
      color: "bg-secondary",
    },
    {
      name: t("fund.kunpeng.name"),
      tag: t("fund.kunpeng.tag"),
      deadline: "2026-03-15",
      status: "upcoming",
      color: "bg-accent",
    },
    {
      name: t("fund.cyberport.name"),
      tag: t("fund.cyberport.tag"),
      deadline: "滾動申請",
      status: "open",
      color: "bg-primary",
    },
    {
      name: t("fund.hkstp.name"),
      tag: t("fund.hkstp.tag"),
      deadline: "滾動申請",
      status: "open",
      color: "bg-secondary",
    },
    {
      name: t("fund.itf.name"),
      tag: t("fund.itf.tag"),
      deadline: "2026-05-31",
      status: "upcoming",
      color: "bg-accent",
    },
    {
      name: t("fund.gba.name"),
      tag: t("fund.gba.tag"),
      deadline: "2026-06-30",
      status: "upcoming",
      color: "bg-primary",
    },
  ];

  const getStatusBadge = (status: Deadline["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">開放中</Badge>;
      case "upcoming":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">即將截止</Badge>;
      case "closed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">已截止</Badge>;
    }
  };

  const formatDate = (date: string) => {
    if (date === "滾動申請") return "滾動申請";
    const d = new Date(date);
    return d.toLocaleDateString("zh-HK", { month: "long", day: "numeric" });
  };

  const isUrgent = (deadline: string) => {
    if (deadline === "滾動申請") return false;
    const d = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    if (a.deadline === "滾動申請") return 1;
    if (b.deadline === "滾動申請") return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-2xl">📅</span> {t("pricing.free.feature3")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          <div className="space-y-4">
            {sortedDeadlines.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-10">
                {/* Dot */}
                <div
                  className={cn(
                    "absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-background z-10",
                    item.color
                  )}
                />

                <div
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all",
                    isUrgent(item.deadline)
                      ? "border-yellow-500/50 bg-yellow-500/5"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-medium text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.tag}</p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <p
                    className={cn(
                      "text-sm font-mono mt-2",
                      isUrgent(item.deadline) ? "text-yellow-400" : "text-muted-foreground"
                    )}
                  >
                    {item.deadline !== "滾動申請" ? (
                      <>截止：{formatDate(item.deadline)}</>
                    ) : (
                      <span className="text-green-400">{item.deadline}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          * 截止日期僅供參考，請以官方公告為準
        </p>
      </CardContent>
    </Card>
  );
}
