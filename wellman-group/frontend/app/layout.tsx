import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wellman Group | Healthcare Infrastructure Experts",
  description: "12+ years of excellence in Modular OT, Medical Gas Pipeline Systems, HVAC, Cleanroom Engineering, and more across 185+ hospitals in 45+ cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)] antialiased bg-[#F5F8FC]">
        {children}
      </body>
    </html>
  );
}
