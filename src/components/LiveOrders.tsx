"use client";

import { useEffect, useState } from "react";
import { useSSE } from "@/hooks/useSSE";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { OrderRow } from "@/components/OrderRow";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";
import { playSound } from "@/lib/sound";
import type { Order } from "@prisma/client";

export type LiveOrder = Order & {
  customer: { name: string; phone: string; district: string };
  product: { name: string; slug: string };
};

// Normalize server-sent payloads (dates come over JSON as strings) to match
// the Prisma shape used by the initial server render.
function normalize(o: any): LiveOrder {
  return {
    ...o,
    createdAt: o.createdAt ? new Date(o.createdAt) : o.createdAt,
    updatedAt: o.updatedAt ? new Date(o.updatedAt) : o.updatedAt,
  };
}

export function LiveOrders({ initialOrders }: { initialOrders: LiveOrder[] }) {
  const [orders, setOrders] = useState<LiveOrder[]>(initialOrders);

  useSSE((msg) => {
    if (msg.type === "order:new") {
      const order = normalize(msg.data);
      setOrders((prev) => [order, ...prev]);
      toast.success(`New order from ${order.customer.name}`, {
        description: `K${order.amount.toLocaleString()} · ${order.customer.district}`,
      });
      playSound();
    } else if (msg.type === "order:status") {
      const order = normalize(msg.data);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
      toast.info(`Order ${order.id.slice(0, 8)} → ${order.status}`);
    }
  });

  return (
    <div className="rounded-xl border border-green-100 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-green-50 text-green-800 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">System</th>
            <th className="px-4 py-3 font-semibold">District</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                No orders yet. New orders will appear here live.
              </td>
            </tr>
          ) : (
            orders.map((o) => <OrderRow key={o.id} order={o} onStatusChange={(id, s) => setOrders((prev) => prev.map((x) => x.id === id ? { ...x, status: s as any } : x))} />)
          )}
        </tbody>
      </table>
    </div>
  );
}