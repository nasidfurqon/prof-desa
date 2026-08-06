import { useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { useMapMarkers } from "../../api/maps";
import { getMarkerIcon, MARKER_LEGEND } from "../../lib/leaflet-icons";
import { resolveUploadUrl } from "../../api/axios";
import { MapMarker, MapMarkerType } from "../../api/types";

// Centroid of Desa Bawu, Kecamatan Kemusu, Kabupaten Boyolali (7°32'1.068"S 110°42'10.764"E).
const VILLAGE_CENTER: [number, number] = [-7.305569, 110.739936];
const DEFAULT_ZOOM = 14;
const FOCUS_ZOOM = 17;

const DETAIL_PATH: Record<MapMarkerType, string> = {
  ORGANIZATION: "/organisasi",
  UMKM: "/umkm",
  SCHOOL: "/sekolah",
};

type FilterType = "ALL" | MapMarkerType;

function markerKey(marker: MapMarker) {
  return `${marker.type}-${marker.id}`;
}

export function MapView() {
  const { data: markers, isLoading } = useMapMarkers();
  const mapRef = useRef<LeafletMap>(null);
  const markerRefs = useRef(new Map<string, LeafletMarker>());
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filteredMarkers = useMemo(
    () => (markers ?? []).filter((marker) => filter === "ALL" || marker.type === filter),
    [markers, filter]
  );

  function handleFilterChange(next: FilterType) {
    setFilter(next);
    setSelectedKey(null);
  }

  function selectMarker(marker: MapMarker) {
    const key = markerKey(marker);
    setSelectedKey(key);
    mapRef.current?.flyTo([marker.latitude, marker.longitude], FOCUS_ZOOM, { duration: 0.8 });
    markerRefs.current.get(key)?.openPopup();
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="relative z-0 overflow-hidden rounded-2xl border border-secondary/10 shadow-sm md:col-span-2">
        <MapContainer ref={mapRef} center={VILLAGE_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} style={{ height: "420px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredMarkers.map((marker) => {
            const key = markerKey(marker);
            return (
              <Marker
                key={key}
                ref={(instance) => {
                  if (instance) markerRefs.current.set(key, instance);
                  else markerRefs.current.delete(key);
                }}
                position={[marker.latitude, marker.longitude]}
                icon={getMarkerIcon(marker.type)}
                eventHandlers={{ click: () => selectMarker(marker) }}
              >
                <Popup>
                  <div className="w-44 space-y-1.5">
                    {marker.thumbnail ? (
                      <img src={resolveUploadUrl(marker.thumbnail)} alt={marker.name} className="h-24 w-full rounded-md object-cover" />
                    ) : null}
                    <p className="text-sm font-semibold text-secondary">{marker.name}</p>
                    <p className="line-clamp-3 text-xs text-secondary-dark/70">{marker.description}</p>
                    <Link to={`${DETAIL_PATH[marker.type]}/${marker.referenceId}`} className="text-xs font-medium text-accent">
                      Lihat Detail &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="flex flex-wrap gap-2 bg-white px-4 py-3">
          <FilterButton active={filter === "ALL"} color="#1B5E20" label="Semua" onClick={() => handleFilterChange("ALL")} />
          {MARKER_LEGEND.map((item) => (
            <FilterButton
              key={item.type}
              active={filter === item.type}
              color={item.color}
              label={item.label}
              onClick={() => handleFilterChange(item.type)}
            />
          ))}
        </div>
      </div>

      <div className="flex max-h-[420px] flex-col overflow-y-auto rounded-2xl border border-secondary/10 bg-white shadow-sm">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        )}

        {!isLoading && filteredMarkers.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-secondary/50">
            Belum ada lokasi untuk kategori ini.
          </div>
        )}

        {!isLoading &&
          filteredMarkers.map((marker) => {
            const key = markerKey(marker);
            const isSelected = selectedKey === key;
            const legendColor = MARKER_LEGEND.find((item) => item.type === marker.type)?.color ?? "#1B5E20";

            return (
              <div key={key} className={`border-b border-secondary/5 last:border-b-0 ${isSelected ? "bg-accent/5" : ""}`}>
                <button
                  onClick={() => selectMarker(marker)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-secondary/5"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: legendColor }} />
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary/5">
                    {marker.thumbnail && (
                      <img src={resolveUploadUrl(marker.thumbnail)} alt={marker.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-secondary">{marker.name}</span>
                </button>
                {isSelected && (
                  <div className="px-4 pb-4">
                    <p className="line-clamp-3 text-xs text-secondary-dark/70">{marker.description}</p>
                    <Link to={`${DETAIL_PATH[marker.type]}/${marker.referenceId}`} className="mt-2 inline-block text-xs font-medium text-accent">
                      Lihat Detail &rarr;
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function FilterButton({ active, color, label, onClick }: { active: boolean; color: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
        active ? "" : "border-secondary/15 text-secondary-dark/60 hover:border-secondary/30"
      }`}
      style={active ? { backgroundColor: `${color}1f`, borderColor: color, color } : undefined}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </button>
  );
}
