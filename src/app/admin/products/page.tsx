import { prisma } from "@/lib/prisma";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/order";
import { Button } from "@/components/Button";
import EditProductForm from "@/components/EditProductForm";
import DeleteProductButton from "@/components/DeleteProductButton";
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
        <form action={createProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
          <input name="slug" placeholder="Slug (e.g. drip-1-acre)" className="px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0 w-full" required />
          <input name="name" placeholder="Name" className="px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0 w-full" required />
          <select name="type" className="px-3 py-2 rounded-lg border border-green-200 bg-white text-sm min-w-0 w-full">
            {["Drip", "Sprinkler", "Pivot", "Micro-Sprinkler", "Solar"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <input name="coverageAcres" type="number" step="0.1" placeholder="Coverage (acres)" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0" required />
            <input name="priceZMW" type="number" placeholder="Price (ZMW)" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0" required />
          </div>
          <textarea name="features" placeholder="Features (comma separated)" className="sm:col-span-2 px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0 w-full" rows={2} />
          <textarea name="images" placeholder="Image URLs (one per line)" className="sm:col-span-2 px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0 w-full" rows={2} />
          <textarea name="specs" placeholder="Specs (key: value, one per line)" className="sm:col-span-2 px-3 py-2 rounded-lg border border-green-200 text-sm min-w-0 w-full" rows={2} />
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary">Create product</Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-green-100 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
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
