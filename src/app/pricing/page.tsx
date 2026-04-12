import Hero from '@/components/hero';

export default function Pricing() {
  return (
    <>
      <Hero
        title="收費模式"
        subtitle="透明固定收費，無成功抽成，讓您安心使用 AI 補貼代辦服務。"
      />
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <table className="w-full border border-[#1a233f] text-muted">
          <thead className="bg-darkBg2 text-accent">
            <tr>
              <th className="py-3">方案</th>
              <th className="py-3">月費 (HKD)</th>
              <th className="py-3">功能說明</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#1a233f]">
              <td className="py-3 text-center">基礎版</td>
              <td className="py-3 text-center">1,200</td>
              <td className="py-3">每月最多 5 件補貼代辦、文件自動生成、基本支援</td>
            </tr>
            <tr className="border-t border-[#1a233f]">
              <td className="py-3 text-center">專業版</td>
              <td className="py-3 text-center">3,500</td>
              <td className="py-3">每月最多 20 件補貼代辦、API 存取、客製化政策匹配、優先支援</td>
            </tr>
            <tr className="border-t border-[#1a233f]">
              <td className="py-3 text-center">額外服務</td>
              <td className="py-3 text-center">500 / 次</td>
              <td className="py-3">額外文件審核、個別諮詢、快速加急提交等增值服務</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-6 text-muted">
          所有方案皆 <strong>不收成功抽成</strong>，費用於每月固定收費，讓您可以提前預算而無額外風險。
        </p>
      </section>
    </>
  );
}
