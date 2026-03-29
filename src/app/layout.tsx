import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的自動化部落格",
  description: "由 cron job 自動產生內容的個人空間",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
