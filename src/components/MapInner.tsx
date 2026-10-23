import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

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
  center: [number, number];
  zoom: number;
  markers: { lat: number; lng: number; popup?: React.ReactNode }[];
  draggable: boolean;
  onPositionChange?: (lat: number, lng: number) => void;
};

export default function MapInner({
  center,
  zoom,
  markers,
  draggable,
  onPositionChange,
}: Props) {
  useEffect(() => {
    // Ensure Leaflet's icon paths resolve at runtime on the client.
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

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
      {markers.map((m, i) => (
        <Marker key={i} position={m} icon={draggable ? customIcon : customIcon}>
          {m.popup && <Popup>{m.popup}</Popup>}
        </Marker>
      ))}
      {draggable && <DraggableHandler />}
    </MapContainer>
  );
}