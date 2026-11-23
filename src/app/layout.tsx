import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroPulse India",
  description: "Real-time fare and aviation intelligence",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
