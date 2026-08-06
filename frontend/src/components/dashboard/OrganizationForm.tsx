import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema, OrganizationFormSchema } from "../../lib/schemas";
import { inputClass } from "../../lib/formStyles";
import { Organization } from "../../api/types";
import { FormLabel } from "./FormLabel";
import { FileDropzone } from "./FileDropzone";

interface OrganizationFormProps {
  initialValues?: Organization;
  onSubmit: (values: OrganizationFormSchema) => void;
  isSubmitting: boolean;
}

export function OrganizationForm({ initialValues, onSubmit, isSubmitting }: OrganizationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OrganizationFormSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          description: initialValues.description,
          phone: initialValues.phone ?? "",
          email: initialValues.email ?? "",
          address: initialValues.address ?? "",
          latitude: initialValues.location ? Number(initialValues.location.latitude) : undefined,
          longitude: initialValues.location ? Number(initialValues.location.longitude) : undefined,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <FormLabel required>Nama Organisasi</FormLabel>
        <input {...register("name")} className={inputClass(Boolean(errors.name))} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <FormLabel required>Deskripsi</FormLabel>
        <textarea {...register("description")} rows={4} className={inputClass(Boolean(errors.description))} />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>Telepon</FormLabel>
          <input {...register("phone")} className={inputClass(Boolean(errors.phone))} />
        </div>
        <div>
          <FormLabel>Email</FormLabel>
          <input {...register("email")} className={inputClass(Boolean(errors.email))} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <FormLabel>Alamat</FormLabel>
        <input {...register("address")} className={inputClass(Boolean(errors.address))} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>Latitude</FormLabel>
          <input {...register("latitude")} className={inputClass(Boolean(errors.latitude))} />
          {errors.latitude && <p className="mt-1 text-xs text-red-600">{errors.latitude.message}</p>}
        </div>
        <div>
          <FormLabel>Longitude</FormLabel>
          <input {...register("longitude")} className={inputClass(Boolean(errors.longitude))} />
          {errors.longitude && <p className="mt-1 text-xs text-red-600">{errors.longitude.message}</p>}
        </div>
      </div>

      <FileDropzone control={control} name="thumbnail" label="Thumbnail" existingUrl={initialValues?.thumbnail} />
      <FileDropzone control={control} name="images" label="Galeri (bisa lebih dari satu)" multiple />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
