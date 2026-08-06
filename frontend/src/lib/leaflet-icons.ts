import L from "leaflet";
import { MapMarkerType } from "../api/types";

function dotIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.2)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

const ICONS: Record<MapMarkerType, L.DivIcon> = {
  ORGANIZATION: dotIcon("#FFA000"),
  UMKM: dotIcon("#1B5E20"),
  SCHOOL: dotIcon("#2563EB"),
};

export function getMarkerIcon(type: MapMarkerType) {
  return ICONS[type];
}

export const MARKER_LEGEND: { type: MapMarkerType; label: string; color: string }[] = [
  { type: "ORGANIZATION", label: "Organisasi", color: "#FFA000" },
  { type: "UMKM", label: "UMKM", color: "#1B5E20" },
  { type: "SCHOOL", label: "Sekolah", color: "#2563EB" },
];
