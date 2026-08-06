import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLogin } from "../../api/auth";
import { loginSchema, LoginFormValues } from "../../lib/schemas";

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Login berhasil");
        navigate("/dashboard");
      },
      onError: () => {
        toast.error("Email atau password salah");
      },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-center font-heading text-xl font-semibold text-secondary">Desa Bawu Admin</h1>
        <p className="mt-1 text-center text-sm text-secondary-dark/60">Masuk untuk mengelola konten website</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-secondary/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-secondary/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={login.isPending} className="btn-primary mt-6 w-full disabled:opacity-50">
          {login.isPending ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
