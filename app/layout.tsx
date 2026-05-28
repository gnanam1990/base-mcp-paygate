import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayGate",
  description: "x402 content paywalls for creators and AI agents on Base.",
  other: {
    "talentapp:project_verification":
      "d535e0f68c3646eb9b9516cd1c55ca0ccf47b7b3f0fdaf7363beaf3effa17d57d9f6fb661efd8083617f5264717769491e77d33ecefd5303decbba78c434e685",
  },
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
