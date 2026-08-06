import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormSchema } from "../../lib/schemas";
import { inputClass } from "../../lib/formStyles";
import { User } from "../../api/types";
import { FormLabel } from "./FormLabel";

interface UserFormProps {
  initialValues?: User;
  onSubmit: (values: UserFormSchema) => void;
  isSubmitting: boolean;
}

export function UserForm({ initialValues, onSubmit, isSubmitting }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: initialValues
      ? { name: initialValues.name, email: initialValues.email, isActive: initialValues.isActive }
      : { isActive: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <FormLabel required>Nama</FormLabel>
        <input {...register("name")} className={inputClass(Boolean(errors.name))} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <FormLabel required>Email</FormLabel>
        <input type="email" {...register("email")} className={inputClass(Boolean(errors.email))} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <FormLabel required={!initialValues}>
          Password {initialValues && <span className="font-normal text-secondary-dark/50">(kosongkan jika tidak diubah)</span>}
        </FormLabel>
        <input type="password" {...register("password")} className={inputClass(Boolean(errors.password))} />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-secondary">
        <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-secondary/30" />
        Aktif
      </label>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
