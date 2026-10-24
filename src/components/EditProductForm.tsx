"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { updateProduct, deleteProduct } from "@/app/actions/order";


export default function EditProductForm({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  return (
    <details open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)} className="group min-w-[260px]">
      <summary className="list-none cursor-pointer" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        <span className="text-green-700 hover:underline text-sm">Edit</span>
      </summary>
      <form
        action={async (fd) => {
          await updateProduct(fd);
          setOpen(false);
        }}
        className="mt-2 space-y-2 text-xs"
      >
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
        </div>
      </form>
      <form action={deleteProduct} style={{ display: "inline" }} className="mt-2">
        <input type="hidden" name="id" value={product.id} />
        <button type="submit" className="text-red-600 hover:underline text-xs" onClick={(e) => { if (!confirm("Delete this product?")) e.preventDefault(); }}>
          Delete
        </button>
      </form>
    </details>
  );
}
