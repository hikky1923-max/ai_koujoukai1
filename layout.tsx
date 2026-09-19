import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const body = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "たびプラン",
  description: "旅行の計画を投稿して、いいねをもらえる旅行専用SNS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={body.variable}>
      <body>
        <Header />
        <main className="wrap main">{children}</main>
      </body>
    </html>
  );
}
