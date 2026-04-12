import CtaButton from '@/components/ctaButton';

type HeroProps = {
  title: string;
  subtitle: string;
  bgImage?: string;
};

export default function Hero({ title, subtitle, bgImage }: HeroProps) {
  return (
    <section
      className="text-center py-20 px-4 flex flex-col items-center justify-center"
      style={{
        background: bgImage
          ? `url(${bgImage}) center/cover no-repeat`
          : 'linear-gradient(135deg, #001133 0%, #001b44 100%)',
      }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">{title}</h1>
      <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl">{subtitle}</p>
      <CtaButton />
    </section>
  );
}
