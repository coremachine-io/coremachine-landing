import Hero from '@/components/hero';

export default function Services() {
  return (
    <>
      <Hero
        title="AI 補貼代辦服務"
        subtitle="利用大型語言模型分析政策、快速生成文件、代為提交，讓您專注於業務本身。"
      />
      <section className="py-12 px-4 max-w-4xl mx-auto text-muted space-y-8">
        <h2 className="text-2xl font-semibold text-accent">服務內容</h2>
        <p>
          1️⃣ <strong>政策分析與匹配：</strong>系統自動抓取最新的香港與前海政府補貼資訊，根據您的公司規模、行業與營運狀況給予最適合的補貼建議。
        </p>
        <p>
          2️⃣ <strong>文件自動生成：</strong>根據政策要求，AI 產出符合格式的申請表格、說明書與所需附件，避免手動排版錯誤。
        </p>
        <p>
          3️⃣ <strong>代辦提交：</strong>平台直接向政府相關系統上傳完整文件，提供提交回執與追蹤狀態，讓您不必再跑政府窗口。
        </p>
        <p>
          4️⃣ <strong>持續監測與提醒：</strong>補貼審批進度與截止日期會即時通知，確保不錯過任何申請機會。
        </p>
      </section>
    </>
  );
}
