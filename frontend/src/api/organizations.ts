import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { ApiResponse, Organization, OrganizationFormValues, PaginatedResponse } from "./types";

export interface OrganizationListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useOrganizations(params: OrganizationListParams = {}) {
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Organization>>("/organizations", { params });
      return data;
    },
  });
}

export function useOrganization(id: number | undefined) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Organization>>(`/organizations/${id}`);
      return data.data;
    },
    enabled: id !== undefined,
  });
}

function toFormData(values: OrganizationFormValues) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  if (values.phone) formData.append("phone", values.phone);
  if (values.email) formData.append("email", values.email);
  if (values.address) formData.append("address", values.address);
  if (values.latitude !== undefined) formData.append("latitude", String(values.latitude));
  if (values.longitude !== undefined) formData.append("longitude", String(values.longitude));
  if (values.thumbnail?.[0]) formData.append("thumbnail", values.thumbnail[0]);
  if (values.images) {
    Array.from(values.images).forEach((file) => formData.append("images", file));
  }
  return formData;
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: OrganizationFormValues) => {
      const { data } = await api.post<ApiResponse<Organization>>("/organizations", toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });
}

export function useUpdateOrganization(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: OrganizationFormValues) => {
      const { data } = await api.put<ApiResponse<Organization>>(`/organizations/${id}`, toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/organizations/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });
}
