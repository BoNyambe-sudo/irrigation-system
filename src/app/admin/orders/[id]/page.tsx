import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import MapView from "@/components/MapView";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";
import { Timeline } from "@/components/Timeline";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, product: true, timeline: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) notFound();

  const specs = (order.product.specs as Record<string, unknown>) ?? {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-900">Order {order.id.slice(0, 8)}</h2>
          <p className="text-sm text-gray-500">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <Link href="/admin/orders" className="text-green-700 hover:underline text-sm">
          ← Back to orders
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Customer</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-green-900">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium text-green-900">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-500">WhatsApp</dt>
                <dd className="font-medium text-green-900">{order.customer.whatsapp || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">District</dt>
                <dd className="font-medium text-green-900">{order.customer.province}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Farm &amp; system</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-gray-500">System</dt>
                <dd className="font-medium text-green-900">{order.product.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Farm size</dt>
                <dd className="font-medium text-green-900">{order.farmSize} acres</dd>
              </div>
              <div>
                <dt className="text-gray-500">Water source</dt>
                <dd className="font-medium text-green-900">{order.waterSource}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Crop type</dt>
                <dd className="font-medium text-green-900">{order.cropType}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Address</dt>
                <dd className="font-medium text-green-900">{order.address}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Coordinates</dt>
                <dd className="font-medium text-green-900 text-xs">
                  {order.lat.toFixed(5)}, {order.lng.toFixed(5)}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-green-800 mb-2">Specifications</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(specs).map(([k, v]) => (
                  <span key={k} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {k}: {String(v)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Site photos</h3>
            {order.sitePhotos.length === 0 ? (
              <p className="text-sm text-gray-500">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {order.sitePhotos.map((src, i) => (
                  <img key={i} src={src} alt={`site ${i + 1}`} className="w-full h-28 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Payment</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Amount</dt>
                <dd className="font-bold text-amber-700">K{order.amount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Method</dt>
                <dd className="font-medium text-green-900">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Payment status</dt>
                <dd className="font-medium text-green-900">{order.paymentStatus}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Order status</h3>
            <OrderStatusSelect orderId={order.id} status={order.status} />
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Location</h3>
            <MapView
              center={[order.lat, order.lng]}
              markers={[{ lat: order.lat, lng: order.lng, popup: <span>{order.customer.name}</span> }]}
              height="240px"
            />
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h3 className="font-semibold text-green-800 mb-3">Timeline</h3>
            <Timeline events={order.timeline.map((t) => ({ status: t.status, note: t.note ?? "", time: t.createdAt }))} />
          </div>
        </div>
      </div>
    </div>
  );
}