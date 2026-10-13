import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./minor.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "CT6 — Auth",
  description: "Log in, register, and password recovery flow for CT6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`page-bg ${montserrat.variable}`}>{children}</body>
    </html>
  );
}