import { prisma } from "@/lib/prisma";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/order";
import { Button } from "@/components/Button";
import { toast } from "sonner";
import type { Product } from "@prisma/client";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-green-900">Products</h2>
        <p className="text-sm text-gray-500">Add, edit or remove irrigation systems.</p>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-5">
        <h3 className="font-semibold text-green-800 mb-3">Add product</h3>
        <form action={createProduct} className="grid sm:grid-cols-2 gap-3">
          <input name="slug" placeholder="Slug (e.g. drip-1-acre)" className="px-3 py-2 rounded-lg border border-green-200 text-sm" required />
          <input name="name" placeholder="Name" className="px-3 py-2 rounded-lg border border-green-200 text-sm" required />
          <select name="type" className="px-3 py-2 rounded-lg border border-green-200 bg-white text-sm">
            {["Drip", "Sprinkler", "Pivot", "Micro-Sprinkler", "Solar"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <input name="coverageAcres" type="number" step="0.1" placeholder="Coverage (acres)" className="w-1/2 px-3 py-2 rounded-lg border border-green-200 text-sm" required />
            <input name="priceZMW" type="number" placeholder="Price (ZMW)" className="w-1/2 px-3 py-2 rounded-lg border border-green-200 text-sm" required />
          </div>
          <textarea name="features" placeholder="Features (comma separated)" className="sm:col-span-2 px-3 py-2 rounded-lg border border-green-200 text-sm" rows={2} />
          <textarea name="images" placeholder="Image URLs (one per line)" className="sm:col-span-2 px-3 py-2 rounded-lg border border-green-200 text-sm" rows={2} />
          <textarea name="specs" placeholder="Specs (key: value, one per line)" className="sm:col-span-2 px-3 py-2 rounded-lg border border-green-200 text-sm" rows={2} />
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary">Create product</Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-green-100 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-800 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Coverage</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No products yet.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-green-50">
                  <td className="px-4 py-3 font-medium text-green-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.type}</td>
                  <td className="px-4 py-3 text-gray-600">{p.coverageAcres} ac</td>
                  <td className="px-4 py-3 font-semibold text-amber-700">K{p.priceZMW.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <EditProductForm product={p} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditProductForm({ product }: { product: Product }) {
  return (
    <details className="group">
      <summary className="list-none cursor-pointer">
        <span className="text-green-700 hover:underline text-sm">Edit</span>
      </summary>
      <form action={updateProduct} className="mt-2 space-y-2 text-xs">
        <input type="hidden" name="id" value={product.id} />
        <input name="slug" defaultValue={product.slug} className="w-full px-2 py-1 rounded border border-green-200" />
        <input name="name" defaultValue={product.name} className="w-full px-2 py-1 rounded border border-green-200" />
        <select name="type" defaultValue={product.type} className="w-full px-2 py-1 rounded border border-green-200 bg-white">
          {["Drip", "Sprinkler", "Pivot", "Micro-Sprinkler", "Solar"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input name="coverageAcres" type="number" step="0.1" defaultValue={product.coverageAcres} className="w-full px-2 py-1 rounded border border-green-200" />
        <input name="priceZMW" type="number" defaultValue={product.priceZMW} className="w-full px-2 py-1 rounded border border-green-200" />
        <textarea name="features" defaultValue={(product.features ?? []).join(", ")} className="w-full px-2 py-1 rounded border border-green-200" rows={2} />
        <textarea name="images" defaultValue={(product.images ?? []).join("\n")} className="w-full px-2 py-1 rounded border border-green-200" rows={2} />
        <textarea name="specs" defaultValue={Object.entries((product.specs as Record<string, unknown>) ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n")} className="w-full px-2 py-1 rounded border border-green-200" rows={2} />
        <div className="flex gap-2">
          <Button type="submit" variant="primary" className="text-xs px-2 py-1">Save</Button>
          <form action={deleteProduct} style={{ display: "inline" }}>
            <input type="hidden" name="id" value={product.id} />
            <button type="submit" className="text-red-600 hover:underline text-xs" onClick={(e) => { if (!confirm("Delete this product?")) e.preventDefault(); }}>
              Delete
            </button>
          </form>
        </div>
      </form>
    </details>
  );
}