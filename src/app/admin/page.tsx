import { prisma } from "@/lib/prisma";
import { Card } from "@/components/Card";

export default async function AdminPage() {
  const [totalOrders, paidOrders, pendingOrders, totalRevenue, products, customers] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: "PAID" } }),
      prisma.order.count({ where: { paymentStatus: "PENDING" } }),
      prisma.order
        .aggregate({ _sum: { amount: true }, where: { paymentStatus: "PAID" } })
        .then((r) => r._sum.amount ?? 0),
      prisma.product.count(),
      prisma.customer.count(),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    include: { customer: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total orders" value={totalOrders} />
        <Card title="Paid" value={paidOrders} accent="green" />
        <Card title="Pending payment" value={pendingOrders} accent="amber" />
        <Card title="Revenue (K)" value={totalRevenue.toLocaleString()} accent="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-green-100 bg-white p-4">
          <h2 className="font-semibold text-green-900 mb-3">Recent orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between text-sm border-b border-green-50 pb-2">
                  <div>
                    <span className="font-medium text-green-900">{o.customer.name}</span>
                    <span className="text-gray-500"> · {o.product.name}</span>
                  </div>
                  <span className="font-semibold text-amber-700">K{o.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-green-100 bg-white p-4">
          <h2 className="font-semibold text-green-900 mb-3">Quick stats</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex justify-between"><span>Products</span><span className="font-semibold">{products}</span></li>
            <li className="flex justify-between"><span>Customers</span><span className="font-semibold">{customers}</span></li>
            <li className="flex justify-between"><span>Average order value (K)</span><span className="font-semibold">{totalOrders ? Math.round(totalRevenue / totalOrders).toLocaleString() : 0}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}