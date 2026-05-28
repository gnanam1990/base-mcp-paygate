import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayGate",
  description: "x402 content paywalls for creators and AI agents on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
