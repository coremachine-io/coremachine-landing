import Hero from '@/components/hero';

export default function Home() {
  return (
    <>
      <Hero
        title="CoreMachine – AI 補貼代辦平台"
        subtitle="智慧匹配香港與前海政府補貼，文件自動生成、代辦提交，一站式解決資金申請難題。"
      />
      <section className="py-12 px-4 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-accent mb-4">為什麼選擇 CoreMachine？</h2>
        <p className="text-muted leading-relaxed space-y-2">
          • 立即比對最新補貼政策<br />
          • AI 自動生成符合格式的申請文件<br />
          • 代辦提交，省去繁雜流程<br />
          • 無成功抽成，費用透明
        </p>
      </section>
    </>
  );
}
