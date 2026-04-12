import './globals.css';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata = {
  title: 'CoreMachine – AI 補貼代辦平台',
  description: '智慧匹配香港與前海政府補貼，文件自動生成與代辦提交，一站式解決資金申請難題。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="bg-primary text-[#f5f5f5] min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
