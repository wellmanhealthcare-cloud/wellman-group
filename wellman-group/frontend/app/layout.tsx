import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/layout/ChatWidget";

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
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)] antialiased bg-[#BAEBFF]">

        {/* Decorative logo watermarks */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { top: '3%',  left: '7%',  size: 90  , opacity: 0.18 },
            { top: '8%',  left: '78%', size: 130 , opacity: 0.12 },
            { top: '15%', left: '50%', size: 55  , opacity: 0.15 },
            { top: '18%', left: '93%', size: 72  , opacity: 0.16 },
            { top: '30%', left: '1%',  size: 110 , opacity: 0.10 },
            { top: '38%', left: '66%', size: 82  , opacity: 0.14 },
            { top: '44%', left: '28%', size: 60  , opacity: 0.18 },
            { top: '52%', left: '88%', size: 95  , opacity: 0.12 },
            { top: '62%', left: '12%', size: 75  , opacity: 0.15 },
            { top: '70%', left: '55%', size: 50  , opacity: 0.17 },
            { top: '76%', left: '80%', size: 115 , opacity: 0.11 },
            { top: '84%', left: '35%', size: 85  , opacity: 0.13 },
            { top: '91%', left: '68%', size: 65  , opacity: 0.16 },
            { top: '95%', left: '4%',  size: 100 , opacity: 0.10 },
          ].map(({ top, left, size, opacity }, i) => (
            <img
              key={i}
              src="/wellman_logo.png"
              alt=""
              style={{
                position: 'absolute',
                top, left,
                width: size,
                height: size,
                opacity,
                objectFit: 'contain',
                userSelect: 'none',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%', flex: 1 }}>
          {children}
        </div>

        <ChatWidget />

      </body>
    </html>
  );
}
