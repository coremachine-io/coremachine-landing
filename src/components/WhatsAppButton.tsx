import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppButton({ phoneNumber, message }: WhatsAppButtonProps) {
  const { language } = useLanguage();

  const defaultMessage = language === "zh-HK"
    ? "你好！我想咨詢關於前海創業嘅服務。"
    : "你好！我想咨询关于前海创业的服务。";

  const whatsappMessage = message || defaultMessage;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const tooltipText = language === "zh-HK" ? "WhatsApp 即時咨詢" : "WhatsApp 即时咨询";

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3, type: "spring" }}
    >
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        <span className="text-sm font-medium">{tooltipText}</span>
        <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-card border-r border-b border-border" />
      </div>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-8 h-8" />
      </motion.a>

      {/* Pulsing Ring Animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-30"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
