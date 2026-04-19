import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StripeCheckoutButtonProps {
  planKey: "starter" | "starter_yearly" | "pro" | "pro_monthly";
  price: string;
  email?: string; // 用於識別會員
  disabled?: boolean;
  className?: string;
}

export default function StripeCheckoutButton({
  planKey,
  price,
  email,
  disabled = false,
  className = "",
}: StripeCheckoutButtonProps) {
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

  const handleCheckout = async () => {
    if (disabled) return;
    
    setIsLoading(true);
    try {
      const origin = window.location.origin;
      const result = await createCheckout.mutateAsync({
        planKey,
        successUrl: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/payment-cancel`,
        email: email,
      });

      if (result.type === "not_configured" && result.error) {
        toast.error(result.error);
        return;
      }

      if (result.type === "subscription" && result.url) {
        window.location.href = result.url;
      } else if (result.type === "payment" && result.clientSecret) {
        toast.error(language === "zh-HK" 
          ? "一次性付款功能準備中，請聯絡我們" 
          : "一次性付款功能准备中，请联系我们");
      }
    } catch (error: any) {
      toast.error(error?.message || (language === "zh-HK" 
        ? "啟動付款失敗，請稍後再試" 
        : "启动付款失败，请稍后再试"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || isLoading || createCheckout.isPending}
      className={`w-full mt-6 ${className}`}
    >
      {isLoading || createCheckout.isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {language === "zh-HK" ? "連接 Stripe..." : "连接 Stripe..."}
        </>
      ) : (
        <>
          {t("stripe.pay")} {price}
        </>
      )}
    </Button>
  );
}
