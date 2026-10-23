"use client";

import { useEffect, useRef } from "react";

type SSEMessage = { type: string; data: unknown; id?: string; time?: string };

// Opens a persistent EventSource to /api/events and dispatches messages
// through the provided handler. Auto-reconnects on drop.
export function useSSE(onMessage: (msg: SSEMessage) => void) {
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      try {
        es = new EventSource("/api/events");
        es.onmessage = (ev: MessageEvent) => {
          try {
            const msg = JSON.parse(ev.data) as SSEMessage;
            handlerRef.current(msg);
          } catch {
            /* ignore malformed payloads */
          }
        };
        es.onerror = () => {
          es?.close();
          reconnectTimer = setTimeout(connect, 3000);
        };
      } catch {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, []);
}