type Accent = "green" | "amber" | "red" | "default";

const accents: Record<Accent, string> = {
  green: "text-green-700",
  amber: "text-amber-700",
  red: "text-red-600",
  default: "text-gray-900",
};

export function Card({
  title,
  value,
  accent = "default",
}: {
  title: string;
  value: string | number;
  accent?: Accent;
}) {
  return (
    <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${accents[accent]}`}>{value}</div>
    </div>
  );
}