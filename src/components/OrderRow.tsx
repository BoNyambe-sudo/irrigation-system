import Link from "next/link";
import { Map } from "lucide-react";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";
import { type LiveOrder } from "@/components/LiveOrders";

export function OrderRow({ order }: { order: LiveOrder }) {
  return (
    <tr className="border-b border-green-50 hover:bg-green-50/40">
      <td className="px-4 py-3">
        <div className="font-medium text-green-900">{order.customer.name}</div>
        <div className="text-xs text-gray-500">{order.customer.phone}</div>
      </td>
      <td className="px-4 py-3 text-gray-700">{order.product.name}</td>
      <td className="px-4 py-3 text-gray-700">{order.customer.district}</td>
      <td className="px-4 py-3 font-semibold text-amber-700">K{order.amount.toLocaleString()}</td>
      <td className="px-4 py-3 text-gray-600">{order.paymentMethod}</td>
      <td className="px-4 py-3">
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/orders/${order.id}`}
            className="text-green-700 hover:underline flex items-center gap-1 text-sm"
          >
            <Map className="w-4 h-4" /> View
          </Link>
        </div>
      </td>
    </tr>
  );
}