"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths when bundling with Next.js.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
        style={{ height }}
        className="rounded-lg bg-green-50 flex items-center justify-center text-gray-400 text-sm"
      >
        Loading map…
      </div>
    );
  }

  const mapMarkers: { lat: number; lng: number; popup?: React.ReactNode }[] =
    markers.length > 0
      ? markers
      : draggable
      ? [{ lat: center[0], lng: center[1] }]
      : [];

  const DraggableHandler = () => {
    useMapEvents({
      moveend(e) {
        if (onPositionChange) {
          const c = e.target.getCenter();
          onPositionChange(c.lat, c.lng);
        }
      },
    });
    return null;
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {mapMarkers.map((m, i) => (
          <Marker key={i} position={m} icon={draggable ? customIcon : customIcon}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
        {draggable && <DraggableHandler />}
      </MapContainer>
    </div>
  );
}