export const events = new Map();
export function emitEvent(type: string, data: any) {
  const id = Date.now().toString();
  events.set(id, { type, data, id });
}
