import Hero from '@/components/hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Checklist, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FreeResources() {
  return (
    <>
      <Hero
        title="免費資源"
        subtitle="專業模板、檢查清單與創業指南，助你快速完成前海創業申請"
      />
      <section className="container py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">免費 AI 模板下載</h2>
          <p className="text-xl text-muted-foreground">專業文件模板，助你快速完成申請</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="border-primary/30 hover:border-primary transition-all">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>前海補貼申請文件模板</CardTitle>
              <CardDescription>包含完整的申請資格說明、所需文件清單同線上申請步驟，繁簡雙語版本。</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />下載模板
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/30 hover:border-secondary transition-all">
            <CardHeader>
              <FileText className="h-10 w-10 text-secondary mb-2" />
              <CardTitle>個人陳述專業模板</CardTitle>
              <CardDescription>專業撰寫指引，幫你突出個人優勢，提高申請成功率。</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Download className="h-4 w-4" />下載模板
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/30 hover:border-accent transition-all">
            <CardHeader>
              <Checklist className="h-10 w-10 text-accent mb-2" />
              <CardTitle>創業申請檢查清單</CardTitle>
              <CardDescription>從公司註冊到補貼申請的完整步驟檢查清單，確保不遺漏任何環節。</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2" variant="outline">
                <Download className="h-4 w-4" />下載清單
              </Button>
            </CardContent>
          </Card>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">創業指南</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "前海公司註冊全流程", desc: "從準備文件到領取營業執照的詳細步驟", icon: BookOpen },
              { title: "港澳青年補貼攻略", desc: "各類補貼的申請條件、時間與注意事項", icon: BookOpen },
              { title: "銀行開戶指南", desc: "前海銀行開戶所需文件與流程", icon: BookOpen },
              { title: "社保與稅務須知", desc: "創業初期必備的社保繳納與稅務申報知識", icon: BookOpen },
            ].map((item, i) => (
              <Card key={i} className="hover:border-primary/50 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-start gap-4">
                  <item.icon className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">需要更多幫助？</p>
          <a href="https://t.me/COOCMbot" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              Telegram 聯絡 COO <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
