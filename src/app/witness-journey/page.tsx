import Hero from '@/components/hero';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Calendar, Zap, TrendingUp, Users, Award, Building, Globe } from "lucide-react";
import { motion } from "framer-motion";

const milestones = [
  {
    date: "2025.03",
    title: "產生想法",
    desc: "在香港職場遇到瓶頸，決定北上前海重新開始，構思 AI 創業服務平台。",
    icon: Rocket,
    status: "completed",
  },
  {
    date: "2025.08",
    title: "公司註冊",
    desc: "完成前海深港青年夢工場入駐申請，正式成立 Core Machine Limited。",
    icon: Building,
    status: "completed",
  },
  {
    date: "2025.12",
    title: "AI 工具上線",
    desc: "推出 AI 資格評估與文件生成工具，開始為港澳青年提供免費創業評估服務。",
    icon: Zap,
    status: "completed",
  },
  {
    date: "2026.04",
    title: "服務發展",
    desc: "建立訂閱服務模式，擴展團隊，加入 AI 夥伴 Eva 與 COO。",
    icon: Users,
    status: "in-progress",
  },
  {
    date: "2026.06",
    title: "首個資助成功案例",
    desc: "目標：協助首位客戶成功獲得前海創業資助，建立可信見證。",
    icon: Award,
    status: "upcoming",
  },
  {
    date: "2026.12",
    title: "大灣區擴展",
    desc: "目標：將服務擴展至整個大灣區，覆蓋更多港澳創業青年。",
    icon: Globe,
    status: "upcoming",
  },
];

export default function WitnessJourney() {
  return (
    <>
      <Hero
        title="見證之旅"
        subtitle="從想法到落地，記錄 Core Machine 的每一步成長。追蹤我們的旅程，也為你的創業之路提供參考。"
      />
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">我們的里程碑</h2>
            <p className="text-xl text-muted-foreground">每個里程碑都代表著真實的努力與成長</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                  milestone.status === 'completed' ? 'bg-primary/10 border-primary text-primary' :
                  milestone.status === 'in-progress' ? 'bg-secondary/10 border-secondary text-secondary animate-pulse' :
                  'bg-muted border-border text-muted-foreground'
                }`}>
                  <milestone.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                  <Card className={`border-l-4 ${
                    milestone.status === 'completed' ? 'border-l-primary' :
                    milestone.status === 'in-progress' ? 'border-l-secondary' :
                    'border-l-muted'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                        <Calendar className="h-4 w-4" />
                        {milestone.date}
                        {milestone.status === 'in-progress' && (
                          <span className="ml-2 px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">進行中</span>
                        )}
                        {milestone.status === 'upcoming' && (
                          <span className="ml-2 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">即將到來</span>
                        )}
                      </div>
                      <CardTitle className="text-xl">{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{milestone.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-16 p-8 bg-card/30 rounded-2xl">
            <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">追蹤我們的成長</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              我們會持續更新這個時間線。每個免費使用我們工具的用戶，都是這段旅程的見證者。
              你的支持，是我們前進的動力。
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
