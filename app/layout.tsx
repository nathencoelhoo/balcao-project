import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Balcão — A Living Archive of Konkani Voices",
  description: "A living digital archive for Konkani oral history from Goa's coastal and inland villages.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${devanagari.variable}`}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
