"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";
import { createOrder } from "@/app/actions/order";
import { ZambianProvinces } from "@/app/actions/orderSchema";
import { toast } from "sonner";
import MapView from "@/components/MapView";

type Props = {
  product: any;
};

type Step = 1 | 2 | 3 | 4 | 5;

const WATER_SOURCES = ["Borehole", "River", "Dam", "Well", "Municipal"];
const CROPS = ["Maize", "Vegetables", "Wheat", "Groundnuts", "Soybeans", "Tobacco", "Other"];

export default function CheckoutForm({ product }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>(1);

  const [customer, setCustomer] = useState({ name: "", phone: "", whatsapp: "" });
  const [location, setLocation] = useState({
    lat: -15.4067,
    lng: 28.2871,
    accuracy: 0,
    address: "",
    province: "Lusaka",
  });
  const [farm, setFarm] = useState({
    farmSize: Math.max(0.5, Number(product.coverageAcres) || 1),
    waterSource: WATER_SOURCES[0],
    cropType: CROPS[0],
    sitePhotos: [] as string[],
  });
  const [payment, setPayment] = useState({
    method: "MOMO" as "MOMO" | "AIRTEL" | "CARD" | "CASH",
  });

  const pricePerAcre = product.priceZMW / Math.max(product.coverageAcres, 0.1);
  const amount = Math.round(pricePerAcre * farm.farmSize);

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).slice(0, 6);
    const dataUrls = await Promise.all(arr.map((f) => fileToBase64(f)));
    setFarm((f) => ({ ...f, sitePhotos: [...f.sitePhotos, ...dataUrls].slice(0, 6) }));
  };

  const useGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation((l) => ({
          ...l,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }));
        toast.success("Location updated");
      },
      () => toast.error("Failed to get location")
    );
  };

  const canNext = () => {
    if (step === 1) return customer.name.trim() && customer.phone.trim() && customer.whatsapp.trim();
    if (step === 2) return location.address.trim() && location.province.trim();
    if (step === 3) return farm.farmSize > 0 && farm.waterSource && farm.cropType;
    if (step === 4) return !!payment.method;
    return true;
  };

  const next = () => canNext() && setStep((s) => Math.min(5, s + 1) as Step);
  const back = () => setStep((s) => Math.max(1, s - 1) as Step);

  const submit = () => {
    startTransition(async () => {
      const res = await createOrder({
        productId: product.id,
        name: customer.name,
        phone: customer.phone,
        whatsapp: customer.whatsapp,
        province: location.province,
        address: location.address,
        farmSize: Number(farm.farmSize),
        waterSource: farm.waterSource,
        cropType: farm.cropType,
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy || undefined,
        sitePhotos: farm.sitePhotos,
        paymentMethod: payment.method,
      });
      if (res.success) {
        toast.success("Order created! Redirecting...");
        router.push(`/my-orders?q=${res.orderId}`);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`flex-1 text-center ${n <= step ? "text-green-700 font-semibold" : "text-gray-400"}`}
          >
            Step {n}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-900">Customer details</h2>
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="e.g., John Mwale"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Phone number</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+260 97..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">WhatsApp number</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200"
                  value={customer.whatsapp}
                  onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                  placeholder="+260 97..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-900">Location</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" type="button" onClick={useGeolocation}>
                Use my current location
              </Button>
              <span className="text-sm text-gray-500 self-center">or select on the map</span>
            </div>
            <MapView
              center={[location.lat, location.lng]}
              markers={[{ lat: location.lat, lng: location.lng }]}
              draggable
              onPositionChange={(lat, lng) => setLocation((l) => ({ ...l, lat, lng }))}
              height="320px"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Province</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200 bg-white"
                  value={location.province}
                  onChange={(e) => setLocation({ ...location, province: e.target.value })}
                >
                  {ZambianProvinces.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Address / farm description</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  placeholder="Village, chief area, road..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-900">Farm details</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600">Farm size (acres)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200"
                  value={farm.farmSize}
                  onChange={(e) => setFarm({ ...farm, farmSize: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Water source</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200 bg-white"
                  value={farm.waterSource}
                  onChange={(e) => setFarm({ ...farm, waterSource: e.target.value })}
                >
                  {WATER_SOURCES.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Main crop</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-green-200 bg-white"
                  value={farm.cropType}
                  onChange={(e) => setFarm({ ...farm, cropType: e.target.value })}
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Site photos (up to 6)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full mt-1"
                onChange={(e) => handlePhotoUpload(e.target.files)}
              />
              {farm.sitePhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {farm.sitePhotos.map((src, i) => (
                    <img key={i} src={src} alt="site" className="w-full h-24 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-900">Payment</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: "MOMO", label: "MTN MoMo" },
                { key: "AIRTEL", label: "Airtel Money" },
                { key: "CARD", label: "Card / Flutterwave" },
                { key: "CASH", label: "Cash on Delivery" },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setPayment({ method: m.key as any })}
                  className={`px-4 py-3 rounded-lg border text-left transition ${
                    payment.method === m.key
                      ? "border-green-700 bg-green-50 text-green-900"
                      : "border-green-200 bg-white text-gray-700 hover:border-green-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              This is a mock payment flow. Real MTN MoMo/Airtel/Flutterwave integration can be wired via env vars.
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-900">Summary & Confirm</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-green-100 p-3">
                <div className="font-semibold text-green-800 mb-1">Customer</div>
                <div>{customer.name}</div>
                <div>{customer.phone}</div>
                <div>WhatsApp: {customer.whatsapp}</div>
              </div>
              <div className="rounded-lg border border-green-100 p-3">
                <div className="font-semibold text-green-800 mb-1">Location</div>
                <div>{location.province}</div>
                <div className="line-clamp-2">{location.address}</div>
                <div className="text-xs text-gray-500">
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </div>
              </div>
              <div className="rounded-lg border border-green-100 p-3">
                <div className="font-semibold text-green-800 mb-1">Farm</div>
                <div>{farm.farmSize} acres</div>
                <div>Water: {farm.waterSource}</div>
                <div>Crop: {farm.cropType}</div>
              </div>
              <div className="rounded-lg border border-green-100 p-3">
                <div className="font-semibold text-green-800 mb-1">Payment</div>
                <div>Method: {payment.method}</div>
                <div>Amount: K{amount.toLocaleString()}</div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <div className="font-semibold text-green-900">System</div>
              <div>
                {product.name} · K{product.priceZMW.toLocaleString()} / {product.coverageAcres} acre(s)
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" type="button" onClick={back} disabled={step === 1}>
            Back
          </Button>
          {step < 5 ? (
            <Button variant="primary" type="button" onClick={next} disabled={!canNext()}>
              Next
            </Button>
          ) : (
            <Button variant="secondary" type="button" onClick={submit} disabled={isPending}>
              {isPending ? "Creating..." : "Confirm order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
