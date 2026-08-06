import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { ApiResponse, PaginatedResponse, Umkm, UmkmFormValues } from "./types";

export interface UmkmListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useUmkms(params: UmkmListParams = {}) {
  return useQuery({
    queryKey: ["umkms", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Umkm>>("/umkms", { params });
      return data;
    },
  });
}

export function useUmkm(id: number | undefined) {
  return useQuery({
    queryKey: ["umkms", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Umkm>>(`/umkms/${id}`);
      return data.data;
    },
    enabled: id !== undefined,
  });
}

function toFormData(values: UmkmFormValues) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("ownerName", values.ownerName);
  formData.append("description", values.description);
  if (values.phone) formData.append("phone", values.phone);
  if (values.address) formData.append("address", values.address);
  if (values.latitude !== undefined) formData.append("latitude", String(values.latitude));
  if (values.longitude !== undefined) formData.append("longitude", String(values.longitude));
  if (values.thumbnail?.[0]) formData.append("thumbnail", values.thumbnail[0]);
  if (values.images) {
    Array.from(values.images).forEach((file) => formData.append("images", file));
  }
  return formData;
}

export function useCreateUmkm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: UmkmFormValues) => {
      const { data } = await api.post<ApiResponse<Umkm>>("/umkms", toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["umkms"] }),
  });
}

export function useUpdateUmkm(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: UmkmFormValues) => {
      const { data } = await api.put<ApiResponse<Umkm>>(`/umkms/${id}`, toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["umkms"] }),
  });
}

export function useDeleteUmkm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/umkms/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["umkms"] }),
  });
}
