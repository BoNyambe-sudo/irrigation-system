import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function Systems({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const sp = await searchParams;
  const type = sp?.type;
  const products = await prisma.product.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
  });
  const all = await prisma.product.findMany();
  const types = Array.from(new Set(all.map((p) => p.type)));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-900">Irrigation Systems</h1>
        <p className="text-gray-600 mt-1">Browse all available systems and filter by type.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/systems"
          className={`px-3 py-1 rounded-full text-sm ${!type ? "bg-green-700 text-white" : "bg-white border border-green-200 text-green-800 hover:bg-green-50"}`}
        >
          All
        </Link>
        {types.map((t) => (
          <Link
            key={t}
            href={`/systems?type=${encodeURIComponent(t)}`}
            className={`px-3 py-1 rounded-full text-sm ${type === t ? "bg-green-700 text-white" : "bg-white border border-green-200 text-green-800 hover:bg-green-50"}`}
          >
            {t}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No systems yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}