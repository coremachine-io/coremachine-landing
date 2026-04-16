import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Core Machine | 港澳青年前海創業加速器",
  description: "一站式前海公司註冊、補貼申請、AI工具落地服務",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body>{children}</body>
    </html>
  );
}
