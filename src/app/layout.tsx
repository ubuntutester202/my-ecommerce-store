import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "EStore - 专业的在线购物平台",
    template: "%s | EStore"
  },
  description: "EStore提供优质的商品和贴心的服务，让您享受愉快的购物体验。",
  keywords: ["在线购物", "电商", "购物平台", "优质商品"],
  authors: [{ name: "EStore Team" }],
  creator: "EStore",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://estore.example.com",
    title: "EStore - 专业的在线购物平台",
    description: "EStore提供优质的商品和贴心的服务，让您享受愉快的购物体验。",
    siteName: "EStore",
  },
  twitter: {
    card: "summary_large_image",
    title: "EStore - 专业的在线购物平台",
    description: "EStore提供优质的商品和贴心的服务，让您享受愉快的购物体验。",
    creator: "@estore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
