import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { ApiResponse, News, NewsFormValues, PaginatedResponse } from "./types";

export interface NewsListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useNewsList(params: NewsListParams = {}) {
  return useQuery({
    queryKey: ["news", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<News>>("/news", { params });
      return data;
    },
  });
}

export function useNews(id: number | undefined) {
  return useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<News>>(`/news/${id}`);
      return data.data;
    },
    enabled: id !== undefined,
  });
}

export function useNewsBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["news", "slug", slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<News>>(`/news/slug/${slug}`);
      return data.data;
    },
    enabled: Boolean(slug),
  });
}

function toFormData(values: NewsFormValues) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("summary", values.summary);
  formData.append("content", values.content);
  if (values.relatedType) formData.append("relatedType", values.relatedType);
  if (values.relatedId !== undefined) formData.append("relatedId", String(values.relatedId));
  if (values.publishedAt) formData.append("publishedAt", values.publishedAt);
  if (values.thumbnail?.[0]) formData.append("thumbnail", values.thumbnail[0]);
  if (values.images) {
    Array.from(values.images).forEach((file) => formData.append("images", file));
  }
  return formData;
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: NewsFormValues) => {
      const { data } = await api.post<ApiResponse<News>>("/news", toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useUpdateNews(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: NewsFormValues) => {
      const { data } = await api.put<ApiResponse<News>>(`/news/${id}`, toFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/news/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
  });
}
