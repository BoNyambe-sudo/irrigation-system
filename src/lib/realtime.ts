// In-memory realtime bus used by the SSE endpoint and server actions.
// Replaces the stub events.ts with a proper pub/sub so every connected
// /admin/orders EventSource receives order:new (and status updates) live.

type RealtimeEvent = {
  type: string;
  data: unknown;
  id: string;
  time: string;
};

type Listener = (event: RealtimeEvent) => void;

const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function broadcast(type: string, data: unknown): void {
  const event: RealtimeEvent = {
    type,
    data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toISOString(),
  };
  for (const fn of listeners) {
    try {
      fn(event);
    } catch {
      /* ignore dead listeners */
    }
  }
}

export function emitOrderCreated(order: unknown): void {
  broadcast("order:new", order);
}

export function emitOrderStatusChange(order: unknown): void {
  broadcast("order:status", order);
}