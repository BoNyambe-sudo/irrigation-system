import Link from "next/link";


type Props = { product: any };

export function ProductCard({ product }: Props) {
  const image = product.images[0] ?? "/placeholder.jpg";
  const specs = (product.specs as Record<string, unknown>) ?? {};
  const specEntries = Object.entries(specs).slice(0, 2);

  return (
    <div className="group rounded-xl border border-green-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-green-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-white/90 text-green-800 text-xs font-semibold px-2 py-1 rounded">
          {product.type}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-green-900 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Covers {product.coverageAcres} acre(s)</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-amber-700">K{product.priceZMW.toLocaleString()}</span>
          <Link
            href={`/systems/${product.slug}`}
            className="text-sm font-medium text-green-700 hover:underline"
          >
            View details →
          </Link>
        </div>
        {specEntries.length > 0 && (
          <div className="mt-3 pt-3 border-t border-green-50 text-xs text-gray-500 flex flex-wrap gap-2">
            {specEntries.map(([k, v]) => (
              <span key={k} className="bg-green-50 text-green-700 px-2 py-1 rounded">
                {k}: {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
