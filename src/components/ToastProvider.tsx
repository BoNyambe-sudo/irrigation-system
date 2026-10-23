"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      richColors
      expand={false}
      visibleToasts={5}
      theme="light"
    />
  );
}