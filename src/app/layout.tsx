import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/components/Providers";
import Chrome from "@/components/Chrome";
import { ToastProvider } from "@/components/ToastProvider";

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
      <Providers>
        <ToastProvider />
        <Chrome>{children}</Chrome>
      </Providers>
    </body>
    </html>
  );
}
