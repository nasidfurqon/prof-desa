import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { getMarkerIcon } from "../../lib/leaflet-icons";
import { MapMarkerType } from "../../api/types";

interface SingleLocationMapProps {
  latitude: number;
  longitude: number;
  type: MapMarkerType;
}

export function SingleLocationMap({ latitude, longitude, type }: SingleLocationMapProps) {
  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-secondary/10 shadow-sm">
      <MapContainer center={[latitude, longitude]} zoom={16} scrollWheelZoom={false} style={{ height: "280px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={getMarkerIcon(type)} />
      </MapContainer>
    </div>
  );
}
