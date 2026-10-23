"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "260971234567"; // placeholder Zambian number

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello! I would like to enquire about an irrigation system."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-full shadow-lg transition"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
        <path d="M16 .5C7.44.5.5 7.44.5 16c0 3.08 1.08 5.92 2.88 8.16L.5 31.5l7.02-2.12c2.1 1.58 4.74 2.52 7.56 2.52C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 27c-2.64 0-5.1-.94-7.02-2.52l-3.5 1.06 1.14-3.4A10.46 10.46 0 015.5 16C5.5 10.2 10.2 5.5 16 5.5S26.5 10.2 26.5 16 21.8 26.5 16 26.5zm5.4-8.4c-.3-.5-1.7-2.1-1.96-2.34-.26-.24-.52-.26-.74-.26-.2 0-.44.06-.66.3-.24.24-.92 1.14-.92 1.14-.2.34-.66.42-.92.1-.26-.32-1.06-1.5-1.34-2.02-.3-.58-.5-1.04-.5-1.04s-.06-.3.06-.5c.12-.2.3-.3.44-.42.12-.1.24-.16.34-.24.1-.08.18-.16.24-.28.06-.12.04-.24-.02-.34-.06-.1-.26-.62-.44-.86-.18-.24-.36-.4-.36-.4-.2-.3-.64-.3-.86-.1-.22.2-.8.6-.8 1.46 0 .86.86 1.64.96 1.76.1.12 1.7 2.72 4.12 3.8 2.42 1.08 2.94.86 3.46.72.52-.14 1.64-.66 1.86-1.3.22-.64.22-1.18.14-1.28-.08-.1-.26-.2-.54-.4z" />
      </svg>
      <span className="font-semibold text-sm">Chat on WhatsApp</span>
    </a>
  );
}