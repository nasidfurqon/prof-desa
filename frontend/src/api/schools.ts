import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { ApiResponse, PaginatedResponse, School, SchoolFormValues } from "./types";

export interface SchoolListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useSchools(params: SchoolListParams = {}) {
  return useQuery({
    queryKey: ["schools", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<School>>("/schools", { params });
      return data;
    },
  });
}

export function useSchool(id: number | undefined) {
  return useQuery({
    queryKey: ["schools", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<School>>(`/schools/${id}`);
      return data.data;
    },
    enabled: id !== undefined,
  });
}

function toFormData(values: SchoolFormValues) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("level", values.level);
  formData.append("description", values.description);
  if (values.address) formData.append("address", values.address);
  if (values.phone) formData.append("phone", values.phone);
  if (values.latitude !== undefined) formData.append("latitude", String(values.latitude));
  if (values.longitude !== undefined) formData.append("longitude", String(values.longitude));
  if (values.thumbnail?.[0]) formData.append("thumbnail", values.thumbnail[0]);
  if (values.images) {
    Array.from(values.images).forEach((file) => formData.append("images", file));
  }
  return formData;
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SchoolFormValues) => {
      const { data } = await api.post<ApiResponse<School>>("/schools", toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });
}

export function useUpdateSchool(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SchoolFormValues) => {
      const { data } = await api.put<ApiResponse<School>>(`/schools/${id}`, toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/schools/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });
}
