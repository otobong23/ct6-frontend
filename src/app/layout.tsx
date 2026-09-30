import type { Metadata } from "next";
import "./globals.css";

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
      <body className="page-bg">{children}</body>
    </html>
  );
}