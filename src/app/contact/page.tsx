import Hero from '@/components/hero';
import CtaButton from '@/components/ctaButton';

export default function Contact() {
  return (
    <>
      <Hero
        title="立即聯絡我們"
        subtitle="想了解更多或預約免費諮詢？請填寫以下表單，我們會在 24 小時內回覆您。"
      />
      <section className="py-12 px-4 flex justify-center">
        <CtaButton />
      </section>
    </>
  );
}
