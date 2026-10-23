import { prisma } from "@/lib/prisma";
import { LiveOrders } from "@/components/LiveOrders";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { customer: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">Orders</h2>
        <span className="text-xs text-green-600 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
        </span>
      </div>
      <LiveOrders initialOrders={orders as any} />
    </div>
  );
}