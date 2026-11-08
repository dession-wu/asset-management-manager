import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import "./ledger.css";
import "./wealth.css";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/brand/icon.svg?v=20261103-brand1", type: "image/svg+xml" }, { url: "/favicon.ico?v=20261103-brand1" }],
    apple: "/brand/icon-180.png",
  },
  title: "资产账本 · 持仓与收益管理",
  description: "安全、便捷的个人资产管理工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
