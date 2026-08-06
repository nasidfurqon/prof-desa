import { useMutation } from "@tanstack/react-query";
import { api, AUTH_TOKEN_KEY } from "./axios";
import { ApiResponse, AuthUser } from "./types";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  user: AuthUser;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<LoginResult>>("/auth/login", payload);
      return data.data;
    },
    onSuccess: (result) => {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      localStorage.setItem("desa_bawu_user", JSON.stringify(result.user));
    },
  });
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem("desa_bawu_user");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("desa_bawu_user");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}
