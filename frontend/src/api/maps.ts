import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";
import { ApiResponse, MapMarker } from "./types";

export function useMapMarkers() {
  return useQuery({
    queryKey: ["maps"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MapMarker[]>>("/maps");
      return data.data;
    },
  });
}
