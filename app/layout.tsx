import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-NJMQMZQC";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LOU Tea — Вишукані чаї з усього світу",
  description:
    "Інтернет-магазин преміального чаю. Зелений, чорний, улун, пуер та трав'яні збори.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="min-h-full bg-cream-50 text-tea-900">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
