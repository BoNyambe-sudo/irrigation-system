"use client";

import { useState } from "react";
import MapView from "@/components/MapView";

type ClusterOrder = {
  id: string;
  customer: { name: string; phone: string; province: string };
  product: { name: string; slug: string };
  amount: number;
  lat: number;
  lng: number;
  address: string;
  farmSize: number;
  cropType: string;
};

export default function AdminMapPage({ orders }: { orders: ClusterOrder[] }) {
  const [selected, setSelected] = useState<ClusterOrder | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-900">Farm map</h2>
        <span className="text-sm text-gray-500">{orders.length} orders</span>
      </div>
      <MapView
        center={[-15.4067, 28.2871]}
        zoom={7}
        markers={orders.map((o) => ({
          lat: o.lat,
          lng: o.lng,
          popup: (
            <div className="text-sm">
              <div className="font-semibold">{o.customer.name}</div>
              <div>{o.customer.province}</div>
              <div className="text-amber-700 font-bold">K{o.amount.toLocaleString()}</div>
              <div className="text-xs text-green-700">{o.product.name}</div>
              <a href={`/admin/orders/${o.id}`} className="text-xs text-green-700 hover:underline">
                View order →
              </a>
            </div>
          ),
        }))}
        height="60vh"
      />
      {selected && (
        <div className="rounded-xl border border-green-100 bg-white p-4">
          <h3 className="font-semibold text-green-900">{selected.customer.name}</h3>
          <p className="text-sm text-gray-600">{selected.customer.province} · {selected.address}</p>
          <p className="text-sm text-gray-600">Farm: {selected.farmSize} acres · {selected.cropType}</p>
        </div>
      )}
    </div>
  );
}