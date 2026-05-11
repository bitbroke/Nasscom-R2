import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Helpdesk AI — 4-Agent Council | Intelligent Ticket Routing",
  description: "Privacy-first, multi-agent AI helpdesk with ONNX inference, hybrid RAG search, PII redaction, and air-gapped mode. Built for NASSCOM Hackathon 2026.",
  keywords: ["AI helpdesk", "4-agent council", "ONNX", "RAG", "PII redaction", "enterprise", "agentic AI"],
} as Metadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
