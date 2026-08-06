import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import { ApiResponse, Page } from "./types";

export function usePages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Page[]>>("/pages");
      return data.data;
    },
  });
}

export function usePageContent(pages: Page[] | undefined, pageKey: string) {
  return pages?.find((p) => p.pageKey === pageKey);
}

export function useUpdatePage(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: { title: string; content: string }) => {
      const { data } = await api.put<ApiResponse<Page>>(`/pages/${id}`, values);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pages"] }),
  });
}
