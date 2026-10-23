import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default async function Home() {
  const products = await prisma.product.findMany({ take: 6, orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-amber-50 px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">
            Smart Irrigation Zambia
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Efficient irrigation solutions for Zambian farms
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/systems"
              className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition"
            >
              View Systems
            </Link>
            <Link
              href="/order"
              className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-10">
            Why choose us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Water efficient",
                desc: "Drip and micro-sprinkler systems save up to 60% water vs flood irrigation.",
              },
              {
                title: "Zambia built",
                desc: "Designed for local climate, water sources and farm sizes across provinces.",
              },
              {
                title: "Off-grid ready",
                desc: "Solar pump kits keep your farm running even where the grid is unreliable.",
              },
            ].map((b) => (
              <div key={b.title} className="rounded-xl border border-green-100 p-6 bg-green-50/40">
                <h3 className="font-semibold text-green-800 text-lg">{b.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-green-50/40">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-10">
            Featured systems
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/systems"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
              >
                View all systems
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-10">
            What our customers say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "M. Banda",
                text: "The drip kit transformed my 1-acre vegetable farm. Yields up 40%.",
              },
              {
                name: "C. Sichilongo",
                text: "Installation crew were professional and the solar pump pays for itself.",
              },
              {
                name: "R. Phiri",
                text: "Best value irrigation system I have used in Central Province.",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-green-100 p-6 bg-white shadow-sm">
                <p className="text-gray-700 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 font-semibold text-green-800 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to irrigate smarter?</h2>
          <p className="text-green-100 mb-6">
            Get a custom quote for your farm in minutes.
          </p>
          <Link
            href="/order"
            className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-400 transition font-semibold"
          >
            Start your order
          </Link>
        </div>
      </section>
    </main>
  );
}