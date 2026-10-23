"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// react-leaflet touches `window` at import time, so it must be loaded
// client-side only. The dynamic import keeps it out of the server bundle.
const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: "100%" }}
      className="rounded-lg bg-green-50 flex items-center justify-center text-gray-400 text-sm"
    >
      Loading map…
    </div>
  ),
});

type Props = {
  center?: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; popup?: React.ReactNode }[];
  draggable?: boolean;
  onPositionChange?: (lat: number, lng: number) => void;
  height?: string;
};

export default function MapView({
  center = [-15.4067, 28.2871],
  zoom = 11,
  markers = [],
  draggable = false,
  onPositionChange,
  height = "400px",
}: Props) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return (
      <div
    style={{ height: "100%" }}
        className="rounded-lg bg-green-50 flex items-center justify-center text-gray-400 text-sm"
      >
        Loading map…
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapInner
        center={center}
        zoom={zoom}
        markers={markers}
        draggable={draggable}
        onPositionChange={onPositionChange}
      />
    </div>
  );
}