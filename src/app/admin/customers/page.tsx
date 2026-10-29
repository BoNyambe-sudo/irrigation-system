import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-green-900">Customers</h2>
      <div className="rounded-xl border border-green-100 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-800 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">WhatsApp</th>
              <th className="px-4 py-3 font-semibold">District</th>
              <th className="px-4 py-3 font-semibold">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No customers yet.</td>
              </tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.id} className="border-b border-green-50">
                  <td className="px-4 py-3 font-medium text-green-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{c.whatsapp || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{c.province}</td>
                  <td className="px-4 py-3 font-semibold text-green-800">{c._count.orders}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
