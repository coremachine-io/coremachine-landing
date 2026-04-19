import { Rocket, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

interface NavBarProps {
  transparent?: boolean;
}

export default function NavBar({ transparent = false }: NavBarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  const scrollToSection = (id: string) => {
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHome = location === "/";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between py-4">
        <a href="/" className="flex items-center gap-2">
          <Rocket className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold neon-text">Core Machine</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("mission")}
            className="text-sm hover:text-primary transition-colors"
          >
            {t("nav.story")}
          </button>
          <button
            onClick={() => scrollToSection("subsidy")}
            className="text-sm hover:text-primary transition-colors"
          >
            {language === "zh-HK" ? "資助一覽" : "资助一览"}
          </button>
          <a href="/free-resources" className="text-sm hover:text-primary transition-colors">
            {t("nav.freeResources")}
          </a>
          <a href="/free-assessment" className="text-sm hover:text-primary transition-colors text-cyan-400">
            {language === "zh-HK" ? "免費評估" : "免费评估"}
          </a>
          <a href="/pricing" className="text-sm hover:text-primary transition-colors">
            {t("nav.pricing")}
          </a>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm hover:text-primary transition-colors"
          >
            {t("nav.contact")}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "zh-HK" ? "zh-CN" : "zh-HK")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === "zh-HK" ? "繁" : "简"}
          </Button>
          <Button
            onClick={() => scrollToSection("contact")}
            className="gap-2"
          >
            {t("hero.cta.primary")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
