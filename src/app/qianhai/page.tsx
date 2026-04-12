import Hero from '@/components/hero';

export default function Qianhai() {
  return (
    <>
      <Hero
        title="前海創業補貼機會"
        subtitle="前海提供創業補貼、公司註冊、法規諮詢與銀行開戶支援，CoreMachine 為您全程代辦。"
      />
      <section className="py-12 px-4 max-w-4xl mx-auto text-muted space-y-6">
        <p>
          前海作為粵港合作的示範區，提供多項創業扶持計畫，包括一次性創業資金補貼、租金減免、稅務優惠以及快速公司註冊服務。
        </p>
        <p>
          我們的 AI 補貼代辦平台會自動比對您的業務條件，生成符合前海政策的申請文件，並代為提交，讓您在最短時間內取得資金與政策支援。
        </p>
        <p>
          透過 CoreMachine，您可快速掌握最新的前海補貼訊息，省去繁雜的資料搜集與文件編寫，專注於產品與市場開發。
        </p>
      </section>
    </>
  );
}
