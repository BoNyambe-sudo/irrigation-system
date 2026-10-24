"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/order";
import { toast } from "sonner";

const STATUSES = [
  "PENDING",
  "REVIEWING",
  "QUOTED",
  "APPROVED",
  "INSTALLED",
  "COMPLETED",
  "CANCELLED",
] as const;

const colors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-blue-100 text-blue-800",
  QUOTED: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  INSTALLED: "bg-teal-100 text-teal-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrderStatusSelect({ orderId, status, onChange }: { orderId: string; status: string; onChange?: (status: string) => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      className={`text-xs font-semibold rounded px-2 py-1 border-0 cursor-pointer ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          const res = await updateOrderStatus(orderId, next);
          if (res.success) { toast.success("Status updated"); onChange?.(next); router.refresh(); }
          else toast.error("Failed");
        });
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}