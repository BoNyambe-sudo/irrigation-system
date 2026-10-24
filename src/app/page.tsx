import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const products = await prisma.product.findMany({ take: 6, orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen">
      <section className="relative text-center md:text-left overflow-hidden bg-linear-to-br from-green-900 via-green-800 to-amber-800 px-4 py-28 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)]" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-green-400/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Zambia's trusted irrigation partner
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
              Grow more with
              <span className="block bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                smarter irrigation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-green-50 mb-8 max-w-xl">
              Efficient drip, sprinkler and solar pump systems designed for
              Zambian farms. Save water, boost yields, and irrigate off-grid
              with confidence.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/systems"
                className="bg-amber-500 w-full md:w-auto text-green-950 px-8 py-3.5 rounded-xl hover:bg-amber-400 transition font-semibold shadow-lg shadow-amber-500/30"
              >
                View Systems
              </Link>
              <Link
                href="/order"
                className="border w-full md:w-auto border-white/70 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition"
              >
                Get a Quote
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 text-center max-w-md">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/15">
                <p className="text-3xl font-bold">60%</p>
                <p className="text-xs text-green-100 mt-1">Water saved</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/15">
                <p className="text-3xl font-bold">40%</p>
                <p className="text-xs text-green-100 mt-1">Yield boost</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/15">
                <p className="text-3xl font-bold">10</p>
                <p className="text-xs text-green-100 mt-1">Provinces</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="aspect-square rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.25),transparent_70%)]" />
              <Image
                src="/hero.jpg"
                alt="Lush green farm with modern drip irrigation lines"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-green-900 rounded-2xl shadow-xl p-4 w-48">
              <p className="text-xs text-gray-500">Avg. water saved</p>
              <p className="text-2xl font-bold text-green-700">60%</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-amber-500 text-green-950 rounded-2xl shadow-xl p-4 w-44">
              <p className="text-xs opacity-80">Farms served</p>
              <p className="text-2xl font-bold">500+</p>
            </div>
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
              <div
                key={b.title}
                className="rounded-xl border border-green-100 p-6 bg-green-50/40"
              >
                <h3 className="font-semibold text-green-800 text-lg">
                  {b.title}
                </h3>
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
            {products.map((p: any) => (
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
              <div
                key={t.name}
                className="rounded-xl border border-green-100 p-6 bg-white shadow-sm"
              >
                <p className="text-gray-700 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 font-semibold text-green-800 text-sm">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-10">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Site assessment",
                desc: "We survey your farm and water source.",
              },
              {
                step: "2",
                title: "Custom design",
                desc: "Get a tailored irrigation layout.",
              },
              {
                step: "3",
                title: "Installation",
                desc: "Our crew installs and tests the system.",
              },
              {
                step: "4",
                title: "Support",
                desc: "Ongoing maintenance and training.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center p-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-700 text-white flex items-center justify-center font-bold mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-green-800">{s.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-green-50/40">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What areas do you serve?",
                a: "All 10 provinces of Zambia.",
              },
              {
                q: "Do you offer solar pump kits?",
                a: "Yes, off-grid solar pump kits are available.",
              },
              {
                q: "How long does installation take?",
                a: "Typically 2-5 days depending on farm size.",
              },
              {
                q: "Is there a warranty?",
                a: "Yes, 12 months on equipment and installation.",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-green-100 bg-white p-4"
              >
                <summary className="font-semibold text-green-800 cursor-pointer">
                  {f.q}
                </summary>
                <p className="text-gray-600 text-sm mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-green-50/60 rounded-2xl border border-green-100 p-6 flex flex-wrap items-center justify-center gap-8">
            {[
              "Zambia National Farmers Union",
              "Ministry of Agriculture",
              "ZESCO",
              "World Bank",
            ].map((l) => (
              <span key={l} className="text-gray-500 font-semibold text-sm">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to irrigate smarter?
          </h2>
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
