import type { Metadata } from "next";
import "./globals.css";
import { DentalProvider } from "@/context/DentalContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Konnector AI DentalOS | The AI Dental Practice Growth Platform",
  description:
    "Enterprise-grade AI Workforce and Practice Growth Platform for Dental Clinics & Chains in India and the United States.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        <DentalProvider>
          <AppShell>{children}</AppShell>
        </DentalProvider>
      </body>
    </html>
  );
}
