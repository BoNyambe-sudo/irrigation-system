import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { MapView } from "@/components/MapView";

type Props = { params: Promise<{ slug: string }> };

export default async function SystemDetail({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const specs = (product.specs as Record<string, unknown>) ?? {};
  const image = product.images[0] ?? "/placeholder.jpg";

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/systems" className="text-sm text-green-700 hover:underline mb-4 inline-block">
        ← Back to systems
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-green-50">
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {product.images.slice(1).map((src, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-green-50">
                  <img src={src} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
            {product.type}
          </span>
          <h1 className="text-3xl font-bold text-green-900 mt-2">{product.name}</h1>
          <p className="text-2xl font-bold text-amber-700 mt-3">
            K{product.priceZMW.toLocaleString()}
          </p>
          <p className="text-gray-600 mt-2">Covers up to {product.coverageAcres} acre(s).</p>

          <div className="mt-6">
            <h2 className="font-semibold text-green-800 mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-green-800 mb-2">Specifications</h2>
            <div className="rounded-lg border border-green-100 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([k, v], i) => (
                    <tr key={k} className={i % 2 ? "bg-green-50/40" : "bg-white"}>
                      <td className="px-4 py-2 font-medium text-green-800 border-r border-green-100 capitalize">
                        {k}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link href={`/order/${product.slug}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                Order this system
              </Button>
            </Link>
            <Link href="/systems" className="flex-1">
              <Button variant="ghost" className="w-full">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-green-900 mb-3">Coverage calculator</h2>
        <CoverageCalculator coverageAcres={product.coverageAcres} priceZMW={product.priceZMW} />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-green-900 mb-3">Where we operate</h2>
        <MapView height="320px" />
      </section>
    </main>
  );
}

function CoverageCalculator({
  coverageAcres,
  priceZMW,
}: {
  coverageAcres: number;
  priceZMW: number;
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="rounded-xl border border-green-100 p-4 bg-white">
        <label className="text-xs text-gray-500">Your farm size (acres)</label>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-green-800">{coverageAcres}</span>
          <span className="text-xs text-gray-400">per unit</span>
        </div>
      </div>
      <div className="rounded-xl border border-green-100 p-4 bg-white">
        <label className="text-xs text-gray-500">Recommended units</label>
        <div className="text-2xl font-bold text-green-800 mt-1">
          {Math.max(1, Math.ceil(coverageAcres / coverageAcres))}
        </div>
      </div>
      <div className="rounded-xl border border-green-100 p-4 bg-white">
        <label className="text-xs text-gray-500">Estimated total</label>
        <div className="text-2xl font-bold text-amber-700 mt-1">
          K{(priceZMW * Math.max(1, Math.ceil(coverageAcres / coverageAcres))).toLocaleString()}
        </div>
      </div>
    </div>
  );
}