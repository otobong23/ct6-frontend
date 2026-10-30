import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import "./globals.css";
import "./minor.css";
import { cn } from "@/lib/utils";
import I18nProvider from "@/components/I18nProvider";
import { Providers } from "./providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "CT6",
  description: "Modern Trading Automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`page-bg ${montserrat.variable}`}><Providers>{children}</Providers></body>
    </html>
  );
}
