type Event = {
  status: string;
  note: string;
  time: string | Date;
};

export function Timeline({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-gray-400">No timeline events yet.</p>;
  }
  return (
    <ol className="relative border-l border-green-200 ml-3 space-y-4">
      {events.map((e, i) => (
        <li key={i} className="ml-6">
          <span className="absolute -left-2.5 w-4 h-4 rounded-full bg-green-100 border border-green-400" />
          <div className="text-sm">
            <span className="font-semibold text-green-900">{e.status}</span>
            {e.note && <span className="text-gray-600"> — {e.note}</span>}
            <div className="text-xs text-gray-400">
              {new Date(e.time).toLocaleString()}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}