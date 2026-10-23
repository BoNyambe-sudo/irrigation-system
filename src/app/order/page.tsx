import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export default async function OrderIndex() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-900 mb-2">Start your order</h1>
      <p className="text-gray-600 mb-6">Pick a system to configure your irrigation quote.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-green-100 p-4 bg-white flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-green-700 font-semibold">{p.type}</div>
              <div className="font-semibold text-green-900">{p.name}</div>
              <div className="text-sm text-amber-700 font-bold">K{p.priceZMW.toLocaleString()}</div>
            </div>
            <Link href={`/order/${p.slug}`}>
              <Button variant="secondary">Continue</Button>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/systems" className="text-green-700 hover:underline text-sm">
          ← Browse all systems
        </Link>
      </div>
    </main>
  );
}