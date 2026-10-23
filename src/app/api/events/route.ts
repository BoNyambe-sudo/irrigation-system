import { NextRequest } from "next/server";
import { subscribe } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      send({ type: "connected" });

      const onEvent = (event: any) => {
        send(event);
      };
      const unsubscribe = subscribe(onEvent);

      const interval = setInterval(() => {
        send({ type: "ping", time: Date.now() });
      }, 30000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* noop */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}