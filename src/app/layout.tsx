import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-display-custom",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-sans-custom",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MBTI 人格测试 — 发现你的真实人格",
  description:
    "免费专业的 MBTI 16 型人格测试。60 道情境化题目，科学评分算法，深入了解你的性格特质、职业方向与人际关系。",
  keywords: ["MBTI", "人格测试", "16型人格", "性格测试", "心理测试"],
  openGraph: {
    title: "MBTI 人格测试 — 发现你的真实人格",
    description:
      "免费专业的 MBTI 16 型人格测试。60 道情境化题目，深入了解你自己。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-2 text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
