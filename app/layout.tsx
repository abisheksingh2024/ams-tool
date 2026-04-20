import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMS — Asset Management Service",
  description: "BitGo Asset Management Service — Token Onboarding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
