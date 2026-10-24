import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MyOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();
  let orders: any[] = [];
  if (q) {
    // Try by order id first
    const byId = await prisma.order.findUnique({
      where: { id: q },
      include: { customer: true, product: true, timeline: { orderBy: { createdAt: "asc" } } },
    });
    if (byId) orders = [byId];
    else {
      const customers = await prisma.customer.findMany({ where: { phone: { contains: q } } });
      if (customers.length) {
        orders = await prisma.order.findMany({
          where: { customerId: { in: customers.map((c) => c.id) } },
          include: { customer: true, product: true, timeline: { orderBy: { createdAt: "asc" } } },
          orderBy: { createdAt: "desc" },
        });
      }
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-green-900 mb-4">Track your orders</h1>
      <form action="/my-orders" method="get" className="flex gap-2 mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Order ID or phone number"
          className="flex-1 px-3 py-2 rounded-lg border border-green-200 text-sm"
        />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Search</button>
      </form>

      {q && orders.length === 0 && (
        <p className="text-gray-500">No orders found.</p>
      )}

      <div className="space-y-6">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-green-900">{o.product.name}</p>
                <p className="text-xs text-gray-500">Order #{o.id}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">{o.status}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">K{o.amount.toLocaleString()} · {o.customer.district}</p>
            <h3 className="font-semibold text-green-800 text-sm mb-2">Timeline</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {o.timeline.map((t: any) => (
                <li key={t.id} className="flex gap-2">
                  <span className="text-green-700 font-semibold">{t.status}</span>
                  <span className="text-gray-500 text-xs">{new Date(t.createdAt).toLocaleString()}</span>
                  {t.note && <span className="text-gray-600">— {t.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/" className="text-green-700 hover:underline text-sm">← Back home</Link>
      </div>
    </main>
  );
}