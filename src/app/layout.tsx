import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Smart Irrigation Zambia",
  description: "Irrigation systems for Zambian farms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <ToastProvider />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
